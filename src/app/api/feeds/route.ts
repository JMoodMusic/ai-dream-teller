import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();

    const { data: dreams, error } = await supabase
      .from("dreams")
      .select(`
        expert_style,
        dream_content,
        ai_analysis,
        image_url,
        created_at,
        orders (
          order_number,
          profile_id,
          profiles (
            nickname,
            avatar_url
          )
        )
      `)
      .eq("is_public", true)
      .eq("status", "COMPLETED")
      .order("created_at", { ascending: false })
      .limit(50); // limit to recent 50 for feeds

    if (error) throw error;

    // Map to FeedItem format
    const feeds = dreams.map((dream: any) => {
      // Handle array or object returns depending on supabase schema setup
      const order = Array.isArray(dream.orders) ? dream.orders[0] : dream.orders;
      const profile = order?.profiles;
      const isGuest = !order?.profile_id;

      return {
        id: order?.order_number || crypto.randomUUID(),
        user: {
          nickname: isGuest ? "비회원 여행자" : (profile?.nickname || "꿈꾸는 사람"),
          avatarUrl: profile?.avatar_url || "",
        },
        expertStyle: dream.expert_style,
        dreamContent: dream.dream_content,
        aiAnalysisSummary: dream.ai_analysis || "",
        imageUrl: dream.image_url,
        createdAt: dream.created_at,
      };
    });

    return NextResponse.json({ feeds }, { status: 200 });
  } catch (error: unknown) {
    console.error("Public feeds fetch error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
