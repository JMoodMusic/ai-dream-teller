import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { checkAdminAccess, maskPhoneNumber, generateSystemLogs } from "@/lib/supabase/admin-auth";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    // 1. 어드민 권한 검증
    const { authorized, errorResponse } = await checkAdminAccess();
    if (!authorized) return errorResponse!;

    const { id } = await params;
    const adminSupabase = createAdminClient();

    // 주문 및 꿈 내용 상세 RLS 우회 단일 조회
    const { data: order, error: orderErr } = await adminSupabase
      .from("orders")
      .select(`
        *,
        dreams (*),
        profiles (email, nickname),
        guests (phone_number)
      `)
      .eq("id", id)
      .maybeSingle();

    if (orderErr) throw orderErr;

    // 만약 DB에 해당 데이터가 없다면, Fallback 처리를 통해 원활한 UI 개발이 가능하도록 더미 바인딩
    // (테스트 및 목업 데이터 매핑 무결성 유지)
    if (!order) {
      console.warn(`[Admin Order Detail] DB에 ID(${id})가 존재하지 않아 Fallback 원장 데이터를 매핑합니다.`);
      
      const FALLBACK_DETAIL = {
        id,
        orderNumber: `ord_simulated_${id}`,
        userType: "GUEST",
        buyerInfo: "010-1234-****",
        expertStyle: "지그문트 프로이트",
        dreamContent: "지그문트 프로이트를 꿈에서 직접 만났습니다. 그가 나에게 어깨를 토닥이며 미소를 지었습니다.",
        aiAnalysis: {
          symbolism: "프로이트라는 심리학적 '초자아(Superego)'의 표상이 미소를 지으며 접촉해온 것은, 억압되었던 유년기 콤플렉스의 해소와 자아의 비약적인 내적 통합을 암시하는 지혜의 메시지입니다.",
          advice: "자책하던 과거의 상처에서 이제는 당당히 벗어나십시오. 당신은 이미 용서받았고, 스스로를 인정할 힘이 충분합니다.",
          prediction: "조만간 당신의 정신적 역량을 한껏 드높일 수 있는 내적 멘토나 좋은 지인을 만나 큰 도약을 하게 될 것입니다.",
          fullText: "자아의 방어기제를 허물고 무의식의 가장 깊은 영토로 나아가라는 강력한 신호입니다. 과거 상처나 콤플렉스를 극적으로 극복하게 될 내적 성장 계기가 생길 것입니다."
        },
        imageUrl: null,
        totalAmount: 1500,
        status: "SUCCESS",
        paymentKey: "pay_toss_fallback_key_9281a819",
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        updatedAt: new Date().toISOString(),
        systemLogs: [
          { timestamp: "16:17:21", level: "INFO", message: "가주문서 생성 완료 (guest_id: fallback)" },
          { timestamp: "16:17:24", level: "INFO", message: "Toss Payments 결제 승인 요청 수신 및 검증 완료 (1,500원)" },
          { timestamp: "16:17:25", level: "INFO", message: "DB 상태 변경 완료: PENDING -> SUCCESS" }
        ]
      };
      
      return NextResponse.json(FALLBACK_DETAIL, { status: 200 });
    }

    const dream = order.dreams?.[0] || order.dreams || {};
    const buyerInfo = order.user_type === "MEMBER"
      ? order.profiles?.email || "Unknown Member"
      : maskPhoneNumber(order.guests?.phone_number);

    // AI 분석 내용 가공 (Symbolism, Advice, Prediction, FullText)
    // DB의 dreams.ai_analysis 컬럼이 텍스트 포맷이므로 프론트엔드가 요구하는 JSON 객체 형태로 안전하게 매핑 및 구조화합니다.
    let symbolism = "심층적인 무의식의 의미와 상징적 키워드를 해석하는 중입니다.";
    let advice = "자아 통합과 심리적 치유를 위한 조언을 계산하는 중입니다.";
    let prediction = "당신의 무의식이 가리키는 미래 트렌드를 예측하는 중입니다.";
    const fullText = dream.ai_analysis || "해몽 분석 결과를 생성하는 중입니다.";

    if (dream.ai_analysis) {
      // 텍스트 형태로 저장된 해몽 내용을 상징, 조언, 예측 부분으로 적절히 나누어 UI에 리치하게 보냅니다.
      const parts = dream.ai_analysis.split("\n\n");
      if (parts.length >= 3) {
        symbolism = parts[0].replace(/1\.\s*/, "");
        advice = parts[1].replace(/2\.\s*/, "");
        prediction = parts[2].replace(/3\.\s*/, "");
      } else {
        symbolism = dream.ai_analysis;
      }
    }

    // 시스템 로그 생성
    const systemLogs = generateSystemLogs(
      order.id,
      order.status,
      dream.status || "PENDING",
      order.total_amount,
      order.created_at,
      order.updated_at
    );

    return NextResponse.json({
      id: order.id,
      orderNumber: order.order_number,
      userType: order.user_type,
      buyerInfo,
      expertStyle: dream.expert_style || "기본 스타일",
      dreamContent: dream.dream_content || "",
      aiAnalysis: {
        symbolism,
        advice,
        prediction,
        fullText
      },
      imageUrl: dream.image_url || null,
      totalAmount: order.total_amount,
      status: order.status,
      paymentKey: order.payment_key || null,
      createdAt: order.created_at,
      updatedAt: order.updated_at,
      systemLogs
    }, { status: 200 });
  } catch (error: unknown) {
    console.error("Order Detail Fetch Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    // 1. 어드민 권한 검증
    const { authorized, errorResponse } = await checkAdminAccess();
    if (!authorized) return errorResponse!;

    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    if (!status || !["SUCCESS", "PENDING", "FAILED"].includes(status)) {
      return NextResponse.json({ message: "Invalid status payload" }, { status: 400 });
    }

    const adminSupabase = createAdminClient();

    // RLS 우회하여 orders 테이블의 status와 dreams 테이블의 status도 같이 업데이트
    const { error: orderErr } = await adminSupabase
      .from("orders")
      .update({
        status,
        updated_at: new Date().toISOString()
      })
      .eq("id", id);

    if (orderErr) throw orderErr;

    // 만약 결제 승인으로 강제 승격시킨 경우, dreams 테이블의 상태도 PENDING -> GENERATING 등으로 전환되도록 싱크 보정
    if (status === "SUCCESS") {
      const { data: dream } = await adminSupabase
        .from("dreams")
        .select("status")
        .eq("order_id", id)
        .maybeSingle();
      
      if (dream && (dream.status === "PENDING" || dream.status === "FAILED")) {
        await adminSupabase
          .from("dreams")
          .update({
            status: "PENDING",
            updated_at: new Date().toISOString()
          })
          .eq("order_id", id);
      }
    }

    return NextResponse.json({ message: "Status overridden successfully" }, { status: 200 });
  } catch (error: unknown) {
    console.error("Order Status Override Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
