"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Copy, Share2, Sparkles, Moon, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

// 더미 데이터 (Hydration 에러 방지를 위해 고정된 날짜 사용)
const DUMMY_DATA = {
  orderId: "ord_123456",
  expertStyle: "융의 분석심리학",
  createdAt: new Date("2026-04-29T12:00:00Z"),
  dreamContent:
    "어젯밤 꿈에서 저는 끝없이 펼쳐진 보라색 바다 위를 걷고 있었습니다. 발밑에는 물결 대신 반짝이는 별가루들이 흩날렸고, 멀리서 저를 부르는 듯한 낯익은 목소리가 들렸어요. 목소리를 따라가보니 거대한 거울이 있었고, 거울 속의 저는 지금의 모습이 아니라 아주 어린 시절의 제 모습이었습니다.",
  aiAnalysis:
    "당신이 경험한 보라색 바다는 무의식의 심연과 직관을 상징합니다. 융의 분석심리학적 관점에서 물은 무의식을 의미하며, 보라색은 영적인 깨달음과 내면의 변화를 나타냅니다. 발밑의 별가루는 당신이 현재 걷고 있는 길이 현실적인 척도보다는 내면의 이상과 꿈에 이끌리고 있음을 암시합니다.\n\n거울 속 어린 시절의 모습은 '내면아이(Inner Child)'와의 조우를 의미합니다. 최근 당신의 삶에서 잊혀졌던 순수한 열정이나, 아직 해결되지 않은 유년기의 감정적 과제가 수면 위로 떠올랐을 가능성이 높습니다. 신경과학적으로 볼 때, 이러한 꿈은 뇌가 과거의 기억과 현재의 감정 상태를 통합하여 심리적 안정감을 찾으려는 시도로 해석할 수 있습니다.",
  imageUrl: "https://picsum.photos/seed/dream1/800/600",
  historyDates: [
    new Date("2026-04-29T12:00:00Z"),
    new Date("2026-04-26T12:00:00Z"),
    new Date("2026-04-22T12:00:00Z"),
  ],
};

export default function DreamResultPage({ params }: { params: { "order-id": string } }) {
  const router = useRouter();
  const orderId = params["order-id"];
  const isOwner = true; // 시연을 위해 true로 설정 (달력 노출)
  const [isCopied, setIsCopied] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Hydration 에러 방지 및 E2E 권한 시뮬레이션
  useEffect(() => {
    setMounted(true);
    
    // [E2E 테스트용 임시 로직] 권한 없는 접근 강제 시뮬레이션
    if (orderId === "unauthorized_123") {
      alert("해당 해몽 결과에 대한 접근 권한이 없습니다.");
      router.replace("/");
    }
  }, [orderId, router]);

  // 권한이 없는 경우 화면을 그리지 않음
  if (orderId === "unauthorized_123") return null;

  // [E2E 테스트용 임시 로직] 유효하지 않은 ID 접근 시 404 커스텀 페이지
  if (orderId !== "ord_123456") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-stone-50 px-4 text-center">
        <h1 className="text-6xl md:text-8xl font-serif text-purple-900 mb-4">404</h1>
        <p className="text-stone-600 text-lg mb-8">요청하신 해몽 결과를 찾을 수 없거나 유효하지 않은 링크입니다.</p>
        <Button onClick={() => router.push("/")} className="rounded-full bg-purple-600 hover:bg-purple-700 text-white px-8 h-12">
          <ArrowLeft className="w-4 h-4 mr-2" />
          홈으로 돌아가기
        </Button>
      </div>
    );
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link", err);
    }
  };

  const handleKakaoShare = () => {
    if (typeof window !== "undefined" && window.Kakao) {
      if (!window.Kakao.isInitialized()) {
        // 실제 프로덕션에서는 환경변수(process.env.NEXT_PUBLIC_KAKAO_APP_KEY)를 사용합니다.
        window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_APP_KEY || "YOUR_KAKAO_APP_KEY");
      }
      
      window.Kakao.Share.sendDefault({
        objectType: "feed",
        content: {
          title: "AI Dream Teller 해몽 결과",
          description: "내 무의식이 건네는 특별한 메시지를 확인해보세요.",
          imageUrl: DUMMY_DATA.imageUrl,
          link: {
            mobileWebUrl: window.location.href,
            webUrl: window.location.href,
          },
        },
        buttons: [
          {
            title: "결과 확인하기",
            link: {
              mobileWebUrl: window.location.href,
              webUrl: window.location.href,
            },
          },
        ],
      });
    } else {
      console.error("Kakao SDK not loaded.");
      alert("카카오톡 공유가 현재 지원되지 않습니다.");
    }
  };

  // 마운트되기 전에는 빈 화면(또는 스켈레톤)을 보여주어 서버와 클라이언트 렌더링 불일치를 방지
  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 via-purple-50/30 to-blue-50/20 pt-24 pb-20">
      <div className="container max-w-3xl mx-auto px-4">
        {/* 상단 뒤로가기 및 제목 */}
        <button 
          onClick={() => router.back()} 
          className="flex items-center text-stone-500 hover:text-stone-800 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          <span className="text-sm">뒤로 가기</span>
        </button>

        <header className="mb-10 text-center animate-fade-in-up">
          <div className="inline-flex items-center justify-center space-x-2 bg-white/60 backdrop-blur-sm px-4 py-1.5 rounded-full border border-purple-100 mb-4 shadow-sm">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-purple-800 font-medium">{DUMMY_DATA.expertStyle} 기반 해석</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-serif tracking-tight text-stone-800 mb-4">
            당신의 무의식이 <br className="md:hidden" />
            건네는 메시지
          </h1>
          <p className="text-stone-500 text-sm">
            {new Intl.DateTimeFormat('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' }).format(DUMMY_DATA.createdAt)}
          </p>
        </header>

        {/* AI 생성 이미지 (옵션) */}
        <section className="mb-10 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
          <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden shadow-lg border border-white/50 group">
            <Image
              src={DUMMY_DATA.imageUrl}
              alt="AI가 생성한 꿈 이미지"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>
        </section>

        {/* 유저가 입력한 꿈 내용 */}
        <section className="mb-8 animate-fade-in-up" style={{ animationDelay: "200ms" }}>
          <Card className="bg-white/70 backdrop-blur-md border-purple-100 shadow-sm overflow-hidden">
            <CardContent className="p-6 md:p-8">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <Moon className="w-4 h-4 text-blue-600" />
                </div>
                <h3 className="text-lg font-medium text-stone-800">나의 꿈 기록</h3>
              </div>
              <p className="text-stone-600 leading-relaxed text-base md:text-lg">
                &quot;{DUMMY_DATA.dreamContent}&quot;
              </p>
            </CardContent>
          </Card>
        </section>

        {/* AI 꿈 해몽 결과 */}
        <section className="mb-12 animate-fade-in-up" style={{ animationDelay: "300ms" }}>
          <Card className="bg-gradient-to-br from-purple-50/80 to-pink-50/80 backdrop-blur-md border-purple-200 shadow-md overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 to-pink-400" />
            <CardContent className="p-6 md:p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 rounded-full bg-purple-200 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-purple-700" />
                </div>
                <h3 className="text-xl font-medium text-purple-900">심층 해몽 결과</h3>
              </div>
              <div className="space-y-4 text-stone-700 leading-relaxed text-base md:text-lg whitespace-pre-wrap">
                {DUMMY_DATA.aiAnalysis}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* 공유하기 버튼 */}
        <section className="mb-16 flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: "400ms" }}>
          <Button 
            variant="outline" 
            className="w-full sm:w-auto rounded-full bg-white/80 hover:bg-stone-100 border-stone-200 text-stone-700 h-12 px-6"
            onClick={handleCopyLink}
          >
            <Copy className="w-4 h-4 mr-2" />
            {isCopied ? "링크가 복사되었습니다!" : "결과 링크 복사"}
          </Button>
          <Button 
            className="w-full sm:w-auto rounded-full bg-[#FEE500] hover:bg-[#FEE500]/90 text-black h-12 px-6 shadow-md shadow-yellow-100"
            onClick={handleKakaoShare}
          >
            <Share2 className="w-4 h-4 mr-2" />
            카카오톡 공유하기
          </Button>
        </section>

        {/* 캘린더 (회원 본인인 경우에만 노출) */}
        {isOwner && (
          <section className="animate-fade-in-up" style={{ animationDelay: "500ms" }}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-serif text-stone-800">나의 꿈 일기장</h3>
              <div className="flex items-center text-sm text-stone-500 bg-white/60 px-3 py-1 rounded-full">
                <span className="w-2 h-2 rounded-full bg-purple-400 mr-2"></span>
                해몽 기록이 있는 날
              </div>
            </div>
            <Card className="bg-white/80 backdrop-blur-md border-stone-200 shadow-sm overflow-hidden">
              <CardContent className="p-6 flex justify-center">
                <Calendar
                  mode="multiple"
                  selected={DUMMY_DATA.historyDates}
                  className="rounded-md"
                  modifiers={{
                    hasRecord: DUMMY_DATA.historyDates,
                  }}
                  modifiersStyles={{
                    hasRecord: {
                      backgroundColor: "var(--tw-colors-purple-100)",
                      color: "var(--tw-colors-purple-900)",
                      fontWeight: "bold",
                    }
                  }}
                />
              </CardContent>
            </Card>
          </section>
        )}
      </div>
    </div>
  );
}
