import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { processAIGeneration } from "@/lib/ai/gemini";
import { after } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { orderId } = body;

    if (!orderId) {
      return NextResponse.json({ message: "Missing orderId" }, { status: 400 });
    }

    const supabase = await createClient();

    // 주문 및 꿈 내용 조회
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("*, dreams(dream_content, status)")
      .eq("id", orderId)
      .single();

    if (orderError || !order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    if (order.status !== "SUCCESS") {
      return NextResponse.json({ message: "Payment not completed" }, { status: 400 });
    }

    const dreamStatus = order.dreams?.[0]?.status;
    if (dreamStatus !== "PENDING") {
      return NextResponse.json({ message: "AI processing already started or completed" }, { status: 409 });
    }

    const dreamContent = order.dreams?.[0]?.dream_content;
    const includeImage = order.total_amount > 1500;

    // AI 처리 백그라운드 트리거
    after(() => {
      processAIGeneration(orderId, dreamContent || "", includeImage).catch(err => {
        console.error("Manual AI trigger error:", err);
      });
    });

    return NextResponse.json({ message: "AI processing triggered" }, { status: 202 });
  } catch (error: unknown) {
    console.error("AI trigger route error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
