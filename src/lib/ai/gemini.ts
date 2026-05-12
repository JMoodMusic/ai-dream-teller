import { GoogleGenAI } from "@google/genai";
import { createClient } from "@supabase/supabase-js";
import { sendTelegramMessage } from "@/lib/telegram";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "dummy_key" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function processAIGeneration(orderId: string, dreamContent: string, includeImage: boolean) {
  let aiAnalysis = "해몽 분석 결과를 생성하지 못했습니다.";
  let imageUrl: string | null = null;
  let imageGenerationFailed = false;

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

    aiAnalysis = response?.text || "해몽 분석 결과를 생성하지 못했습니다.";
    
    // 2. 이미지 생성 파이프라인
    if (includeImage) {
      try {
        // 2-1. 프롬프트 엔지니어링
        const imagePromptGen = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: `Create a highly descriptive, visually evocative English prompt for an AI image generator (like Midjourney or DALL-E) based on the following dream and its analysis. The prompt should capture the mood, atmosphere, and key symbols. Output ONLY the English prompt text, without any conversational filler or quotes.
          
Dream: ${dreamContent}
Analysis: ${aiAnalysis}`,
        });

        const imagePrompt = imagePromptGen.text?.trim() || "A surreal and dreamy landscape";

        // 2-2. 이미지 생성 API 호출
        const imageResponse = await ai.models.generateContent({
          model: 'gemini-2.5-flash-image',
          contents: imagePrompt,
        });

        const inlineData = imageResponse.candidates?.[0]?.content?.parts?.find(p => p.inlineData)?.inlineData;
        
        if (inlineData && inlineData.data) {
           const buffer = Buffer.from(inlineData.data, 'base64');
           
           // 2-3. Supabase 스토리지 업로드
           const fileName = `dream_${orderId}_${Date.now()}.png`;
           const { data: uploadData, error: uploadError } = await supabase
             .storage
             .from("dreams")
             .upload(fileName, buffer, {
               contentType: "image/png",
               upsert: false
             });

           if (uploadError) throw uploadError;

           // 퍼블릭 URL 가져오기
           const { data: publicUrlData } = supabase
             .storage
             .from("dreams")
             .getPublicUrl(fileName);

           imageUrl = publicUrlData.publicUrl;
        } else {
           throw new Error("No inlineData found in the generated image response");
        }
      } catch (imgErr) {
        console.error("Image generation failed:", imgErr);
        imageGenerationFailed = true;
        // 이미지 생성이 실패하더라도 전체 프로세스는 진행되도록 Fallback 처리
        imageUrl = "https://picsum.photos/800/600?random=" + Date.now();
        
        // Fallback 시에도 URL을 DB에 저장해야 하므로 진행
      }
    }

    // Supabase DB 업데이트
    const { error: updateError, data: updatedData } = await supabase
      .from("dreams")
      .update({
        ai_analysis: aiAnalysis,
        image_url: imageUrl,
        status: "COMPLETED",
        updated_at: new Date().toISOString(),
      })
      .eq("order_id", orderId)
      .select();

    if (updateError) {
      throw updateError;
    }

    if (!updatedData || updatedData.length === 0) {
      throw new Error(`DB 업데이트 실패: order_id(${orderId})에 해당하는 꿈 데이터가 없거나 RLS 권한 문제로 수정되지 않았습니다. (Service Role Key 필요)`);
    }

    // 텔레그램 성공 알림 전송
    const previewText = aiAnalysis.length > 50 ? aiAnalysis.slice(0, 50) + "..." : aiAnalysis;
    const imgStatus = includeImage ? (imageGenerationFailed ? "❌ (실패)" : "✅ (성공)") : "N/A";
    await sendTelegramMessage(`✨ [AI 해몽 완료]\n- 주문번호: ${orderId}\n- 상태: COMPLETED\n- 이미지 생성: ${imgStatus}\n- 해몽 결과 미리보기:\n${previewText}`);

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
