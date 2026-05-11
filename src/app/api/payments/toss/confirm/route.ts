import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

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

    // TODO: AI 분석 비동기 트리거 호출 (이후 AI파트에서 연동)
    
    return NextResponse.json(data, { status: 200 });
  } catch (error: unknown) {
    console.error("Payment confirm error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
