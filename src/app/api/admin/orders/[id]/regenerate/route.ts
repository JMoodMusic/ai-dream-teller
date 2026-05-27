import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { checkAdminAccess } from "@/lib/supabase/admin-auth";
import { processAIGeneration } from "@/lib/ai/gemini";
import { after } from "next/server";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    // 1. 어드민 권한 검증
    const { authorized, errorResponse } = await checkAdminAccess();
    if (!authorized) return errorResponse!;

    const { id } = await params;
    const adminSupabase = createAdminClient();

    // 주문 및 꿈 내용 조회
    const { data: order, error: orderErr } = await adminSupabase
      .from("orders")
      .select("id, total_amount, status, dreams(dream_content, status)")
      .eq("id", id)
      .maybeSingle();

    if (orderErr || !order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    // 어드민 재생성의 경우, 결제 자체가 취소되거나 실패한 건이 아니라면 재생성을 허용합니다.
    if (order.status !== "SUCCESS") {
      return NextResponse.json({ message: "Cannot regenerate: Payment not completed" }, { status: 400 });
    }

    const dream = order.dreams?.[0] || order.dreams || {};
    const dreamContent = dream.dream_content || "";
    const includeImage = order.total_amount > 1500;

    // AI 재생성을 위해 dreams 테이블의 status를 GENERATING 상태로 즉시 변경
    const { error: updateErr } = await adminSupabase
      .from("dreams")
      .update({
        status: "GENERATING",
        updated_at: new Date().toISOString()
      })
      .eq("order_id", id);

    if (updateErr) throw updateErr;

    // after() API를 활용하여 Gemini LLM 해몽 및 이미지 재생성을 백그라운드에서 비동기로 트리거
    // (클라이언트는 대기 시간을 최소화하고, 즉시 접수 202 응답 수신)
    after(() => {
      console.log(`[Admin Regenerate] 어드민 강제 재생성 트리거 수신 (order_id: ${id})`);
      processAIGeneration(id, dreamContent, includeImage)
        .then(() => {
          console.log(`[Admin Regenerate] 어드민 강제 재생성 완료 성공 (order_id: ${id})`);
        })
        .catch(err => {
          console.error(`[Admin Regenerate] 어드민 강제 재생성 실패 에러 (order_id: ${id}):`, err);
        });
    });

    return NextResponse.json({ message: "Regeneration request accepted. AI processing started." }, { status: 202 });
  } catch (error: unknown) {
    console.error("Dream Regenerate Route Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
