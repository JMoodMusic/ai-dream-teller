import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // 토스페이먼츠 웹훅 스펙 대응
    if (body.eventType === "PAYMENT_STATUS_CHANGED") {
      const { orderId, status } = body.data;
      
      const supabase = await createClient();
      
      let dbStatus = "PENDING";
      if (status === "DONE") dbStatus = "SUCCESS";
      else if (status === "CANCELED" || status === "ABORTED" || status === "EXPIRED") dbStatus = "FAILED";
      
      if (dbStatus !== "PENDING") {
         await supabase.rpc("update_order_status", {
           p_order_number: orderId,
           p_status: dbStatus
         });
      }
    }
    
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err) {
    console.error("Webhook processing error:", err);
    return NextResponse.json({ message: "Webhook processing failed" }, { status: 500 });
  }
}
