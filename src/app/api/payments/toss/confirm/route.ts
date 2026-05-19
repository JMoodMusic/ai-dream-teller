import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { after } from "next/server";
import { sendTelegramMessage } from "@/lib/telegram";
import { processAIGeneration } from "@/lib/ai/gemini";

// Vercel Hobby 플랜 최대 타임아웃(60초) 설정 - AI 이미지 생성 대기
export const maxDuration = 60;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { paymentKey, orderId, amount } = body;

    const supabase = await createClient();

    interface OrderRecord {
      id: string;
      order_number: string;
      total_amount: number;
      status: string;
      profile_id?: string;
      guest_id?: string;
    }

    // 1. DB 주문 내역 조회 및 금액 교차 검증
    const { data: order, error: fetchError } = await supabase
      .rpc("get_order_by_number", { p_order_number: orderId })
      .single();

    const typedOrder = order as OrderRecord;

    if (fetchError || !typedOrder) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    if (typedOrder.total_amount !== Number(amount)) {
      return NextResponse.json({ message: "Amount mismatch - verification failed" }, { status: 400 });
    }

    if (typedOrder.status === "SUCCESS") {
      return NextResponse.json({ message: "Already processed" }, { status: 400 });
    }

    if (typedOrder.status === "FAILED") {
      return NextResponse.json({ message: "Order already failed or cancelled" }, { status: 400 });
    }

    // 2. Toss Payments 승인 API 호출
    const secretKey = process.env.TOSS_SECRET_KEY;
    if (!secretKey) {
      return NextResponse.json({ message: "Toss Secret key missing" }, { status: 500 });
    }

    const encryptedSecretKey = Buffer.from(`${secretKey}:`).toString("base64");

    const response = await fetch("https://api.tosspayments.com/v1/payments/confirm", {
      method: "POST",
      headers: {
        Authorization: `Basic ${encryptedSecretKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        paymentKey,
        orderId,
        amount: Number(amount),
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      // 승인 실패 시 DB 업데이트
      await supabase.rpc("update_order_status", { 
        p_order_number: orderId, 
        p_status: "FAILED" 
      });
      return NextResponse.json(
        { message: data.message || "Payment confirm failed", code: data.code },
        { status: response.status }
      );
    }

    // 3. 승인 성공 시 DB 업데이트
    await supabase.rpc("update_order_status", {
      p_order_number: orderId,
      p_status: "SUCCESS",
      p_payment_key: paymentKey
    });

    // 4. 결제 성공 알림 전송을 위한 정보 조회
    const adminSupabase = createAdminClient();
    const { data: dream, error: dreamFetchError } = await adminSupabase
      .from("dreams")
      .select("dream_content")
      .eq("order_id", typedOrder.id)
      .single();
      
    if (dreamFetchError) {
      console.error("Failed to fetch dream content for AI generation:", dreamFetchError);
    }

    const dreamSnippet = dream?.dream_content 
      ? (dream.dream_content.length > 20 ? dream.dream_content.substring(0, 20) + "..." : dream.dream_content)
      : "내용 없음";
    const productType = typedOrder.total_amount > 1500 ? "텍스트 + 이미지" : "텍스트";
    const userId = typedOrder.profile_id || typedOrder.guest_id || "알 수 없음";

    const message = `✅ [결제 승인 완료]\n- 상품: AI 해몽 (${productType})\n- 유저: ${userId}\n- 금액: ${typedOrder.total_amount}원\n- 꿈 내용: ${dreamSnippet}`;
    await sendTelegramMessage(message);

    // 5. AI 분석 비동기 트리거 호출
    after(async () => {
      try {
        await processAIGeneration(typedOrder.id, dream?.dream_content || "", typedOrder.total_amount > 1500);
      } catch (err) {
        console.error("Background AI processing error:", err);
      }
    });
    
    return NextResponse.json(data, { status: 200 });
  } catch (error: unknown) {
    console.error("Payment confirm error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
