import { GoogleGenAI } from "@google/genai";
import { createClient } from "@supabase/supabase-js";
import { sendTelegramMessage } from "@/lib/telegram";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "dummy_key" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function processAIGeneration(orderId: string, dreamContent: string, includeImage: boolean) {
  try {
    const prompt = `다음은 사용자의 꿈 내용입니다. 이 꿈을 전문적이고 친절하게 해석해주세요.
결과에는 꿈의 의미, 상징, 그리고 앞으로의 조언이 포함되어야 합니다.

꿈 내용: ${dreamContent}`;
    let response;
    let retries = 3;
    let delay = 2000; // 초기 2초 대기

    while (retries > 0) {
      try {
        response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: prompt,
        });
        break; // 성공 시 루프 탈출
      } catch (err: unknown) {
        const error = err as Error;
        if (error.message && error.message.includes("503") && retries > 1) {
          console.warn(`[Gemini API] 503 High Demand 에러 발생. ${delay / 1000}초 후 재시도합니다... (남은 횟수: ${retries - 1})`);
          await new Promise((res) => setTimeout(res, delay));
          retries--;
          delay *= 2; // 지수 백오프 (2초 -> 4초)
        } else {
          throw err; // 503 이외의 에러나 재시도 횟수 소진 시 에러 던지기
        }
      }
    }

    const aiAnalysis = response?.text || "해몽 분석 결과를 생성하지 못했습니다.";
    
    // TODO: 이미지 생성 로직 (현재는 텍스트만 처리)
    const imageUrl = includeImage ? "https://picsum.photos/800/600" : null;

    // Supabase DB 업데이트
    const { error: updateError } = await supabase
      .from("dreams")
      .update({
        ai_analysis: aiAnalysis,
        image_url: imageUrl,
        status: "COMPLETED",
        updated_at: new Date().toISOString(),
      })
      .eq("order_id", orderId);

    if (updateError) {
      throw updateError;
    }

    // 텔레그램 성공 알림 전송
    await sendTelegramMessage(`✨ [AI 해몽 완료]\n- 주문번호: ${orderId}\n- 상태: COMPLETED`);

  } catch (error: unknown) {
    console.error("AI Generation Error:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    await sendTelegramMessage(`🚨 [AI 해몽 실패]\n- 주문번호: ${orderId}\n- 에러: ${errorMessage}`);
    
    // DB 상태 업데이트 시도
    await supabase
      .from("dreams")
      .update({
        status: "FAILED",
        updated_at: new Date().toISOString(),
      })
      .eq("order_id", orderId);
  }
}
