import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sendTelegramMessage } from "@/lib/telegram";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const message = searchParams.get("message");
  const orderId = searchParams.get("orderId");

  if (orderId) {
    try {
      const supabase = await createClient();
      await supabase.rpc("update_order_status", {
        p_order_number: orderId,
        p_status: "FAILED"
      });

      // 실패 알림 전송
      const notifyMsg = `❌ [결제 실패]\n- 주문번호: ${orderId}\n- 에러 코드: ${code}\n- 에러 메시지: ${message || "알 수 없음"}`;
      await sendTelegramMessage(notifyMsg);
    } catch (err) {
      console.error("Failed to update order status on fail:", err);
    }
  }

  // 프론트엔드 결제 실패 페이지로 리다이렉트
  // 결제창 페이지로 되돌아가면서 에러 파라미터를 넘겨줌
  return NextResponse.redirect(
    new URL(`/payments?error_code=${code}&error_message=${encodeURIComponent(message || "결제에 실패했습니다")}`, request.url)
  );
}
