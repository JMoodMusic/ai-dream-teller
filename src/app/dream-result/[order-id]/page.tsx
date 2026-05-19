"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Copy, Share2, Sparkles, Moon, ArrowLeft, Loader2, Lock, Globe } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface DreamData {
  orderId: string;
  expertStyle: string;
  createdAt: Date;
  dreamContent: string;
  aiAnalysis: string | null;
  imageUrl: string | null;
  status: "COMPLETED" | "PENDING" | "PROCESSING" | "FAILED";
  isPublic: boolean;
}

export default function DreamResultPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = params["order-id"] as string;

  const [data, setData] = useState<DreamData | null>(null);
  const [isOwner, setIsOwner] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [isUpdatingPublic, setIsUpdatingPublic] = useState(false);

  const handleTogglePublic = async (checked: boolean) => {
    if (!data) return;
    try {
      setIsUpdatingPublic(true);
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublic: checked })
      });
      if (!res.ok) {
        throw new Error("Failed to update status");
      }
      setData(prev => prev ? { ...prev, isPublic: checked } : null);
    } catch (err) {
      console.error(err);
      alert("상태 업데이트에 실패했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setIsUpdatingPublic(false);
    }
  };

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const fetchResult = async () => {
      try {
        const res = await fetch(`/api/orders/${orderId}`);
        if (!res.ok) {
          if (res.status === 403) throw new Error("접근 권한이 없습니다.");
          if (res.status === 404) throw new Error("해몽 결과를 찾을 수 없습니다.");
          throw new Error("데이터를 불러오는 중 오류가 발생했습니다.");
        }
        const { order, dream, isOwner: ownerFlag } = await res.json();
        
        setData({
          orderId: order.order_number,
          expertStyle: dream.expert_style,
          createdAt: new Date(dream.created_at),
          dreamContent: dream.dream_content,
          aiAnalysis: dream.ai_analysis,
          imageUrl: dream.image_url,
          status: dream.status,
          isPublic: dream.is_public,
        });
        setIsOwner(ownerFlag);

        // 폴링 로직: PENDING 또는 PROCESSING 상태이면 3초 후 다시 조회
        if (dream.status === "PENDING" || dream.status === "PROCESSING") {
          timeoutId = setTimeout(fetchResult, 3000);
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (orderId) fetchResult();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [orderId]);

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
    if (typeof window !== "undefined" && "Kakao" in window) {
      const Kakao = (window as unknown as { Kakao: { isInitialized: () => boolean, init: (key: string) => void, Share: { sendDefault: (params: object) => void } } }).Kakao;
      if (!Kakao.isInitialized()) {
        Kakao.init(process.env.NEXT_PUBLIC_KAKAO_APP_KEY || "");
      }
      
      Kakao.Share.sendDefault({
        objectType: "feed",
        content: {
          title: "AI Dream Teller 해몽 결과",
          description: "내 무의식이 건네는 특별한 메시지를 확인해보세요.",
          imageUrl: data?.imageUrl || "https://ai-dream-teller.vercel.app/og-image.png",
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
      alert("카카오톡 공유가 현재 지원되지 않습니다.");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FDFBF7]">
        <Loader2 className="w-10 h-10 text-purple-500 animate-spin mb-4" />
        <p className="text-slate-500 font-medium">해몽 결과를 불러오는 중...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FDFBF7] px-4 text-center">
        <h1 className="text-6xl font-serif text-purple-900 mb-4">Oops!</h1>
        <p className="text-slate-600 text-lg mb-8">{error || "알 수 없는 오류가 발생했습니다."}</p>
        <Button onClick={() => router.push("/")} className="rounded-full bg-purple-600 hover:bg-purple-700 text-white px-8 h-12">
          <ArrowLeft className="w-4 h-4 mr-2" />
          홈으로 돌아가기
        </Button>
      </div>
    );
  }

  // AI 분석 중인 경우
  if (data.status === "PENDING" || data.status === "PROCESSING") {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center px-4 pt-24 pb-20 relative overflow-hidden">
        {/* Background Aurora */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-300/20 blur-[100px] rounded-full animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-300/20 blur-[100px] rounded-full animate-pulse [animation-delay:1s]" />
        </div>

        <div className="relative z-10 max-w-2xl w-full text-center space-y-8">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-white shadow-xl border border-purple-100 relative mb-4">
             <Sparkles className="w-12 h-12 text-purple-500 animate-bounce" />
             <div className="absolute inset-0 rounded-full border-4 border-purple-500 border-t-transparent animate-spin" />
          </div>

          <div className="space-y-4">
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
              AI가 당신의 꿈을 <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">
                심층 분석 중입니다
              </span>
            </h1>
            <p className="text-slate-500 text-lg leading-relaxed">
              무의식의 조각들을 모아 특별한 메시지를 구성하고 있어요. <br />
              잠시만 기다려 주시면 곧 놀라운 결과를 보여드릴게요!
            </p>
          </div>

          <Card className="bg-white/60 backdrop-blur-sm border-slate-200/60 shadow-sm p-6 max-w-md mx-auto">
             <p className="text-sm text-slate-400 font-medium italic">
                &quot;{data.dreamContent.slice(0, 60)}...&quot;
             </p>
          </Card>

          <div className="pt-8">
            <Button 
              variant="outline" 
              onClick={() => router.refresh()}
              className="rounded-full border-purple-200 text-purple-600 hover:bg-purple-50 px-8 h-12 transition-all"
            >
              새로고침하여 결과 확인
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // 분석 완료된 경우
  return (
    <div className="min-h-screen bg-[#FDFBF7] text-slate-800 pb-24 relative overflow-hidden pt-24">
      {/* Background Aurora */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-pink-200/10 blur-[120px]" />
        <div className="absolute bottom-[10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-300/10 blur-[120px]" />
      </div>

      <div className="container max-w-3xl mx-auto px-4 relative z-10">
        {/* 상단 뒤로가기 */}
        <button 
          onClick={() => router.back()} 
          className="flex items-center text-slate-400 hover:text-slate-800 transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
          <span className="text-sm font-medium">뒤로 가기</span>
        </button>

        <header className="mb-12 text-center">
          <div className="inline-flex items-center justify-center space-x-2 bg-white/60 backdrop-blur-sm px-4 py-1.5 rounded-full border border-purple-100 mb-6 shadow-sm">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-purple-800 font-bold">{data.expertStyle}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 mb-4 leading-tight">
            당신의 무의식이 <br />
            건네는 메시지
          </h1>
          <p className="text-slate-400 text-sm font-medium">
            {format(data.createdAt, "yyyy년 M월 d일 (EEEE)", { locale: ko })}
          </p>
        </header>

        {/* AI 생성 이미지 (있는 경우) */}
        {data.imageUrl && (
          <section className="mb-12">
            <div className="relative w-full aspect-[4/3] rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white group">
              <Image
                src={data.imageUrl}
                alt="AI가 생성한 꿈 이미지"
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />
            </div>
          </section>
        )}

        {/* 꿈 내용 */}
        <section className="mb-8">
          <Card className="bg-white/70 backdrop-blur-md border-slate-200/60 shadow-sm overflow-hidden rounded-3xl">
            <CardContent className="p-8 md:p-10">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center">
                  <Moon className="w-5 h-5 text-blue-500" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 tracking-tight">나의 꿈 기록</h3>
              </div>
              <p className="text-slate-600 leading-relaxed text-lg italic break-keep">
                &quot;{data.dreamContent}&quot;
              </p>
            </CardContent>
          </Card>
        </section>

        {/* AI 꿈 해몽 결과 */}
        <section className="mb-12">
          <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-100 shadow-xl overflow-hidden rounded-[2rem] relative">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-purple-500 to-pink-500" />
            <CardContent className="p-8 md:p-12">
              <div className="flex items-center space-x-3 mb-8">
                <div className="w-10 h-10 rounded-2xl bg-purple-100 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-purple-900 tracking-tight">심층 해몽 분석</h3>
              </div>
              <div className="text-slate-700 leading-relaxed text-lg break-keep">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h1: ({ node, ...props }) => <h1 className="text-2xl font-extrabold mt-8 mb-4 text-slate-900" {...props} />,
                    h2: ({ node, ...props }) => <h2 className="text-xl font-bold mt-6 mb-3 text-purple-900 border-b border-purple-100 pb-2" {...props} />,
                    h3: ({ node, ...props }) => <h3 className="text-lg font-bold mt-5 mb-2 text-purple-800" {...props} />,
                    p: ({ node, ...props }) => <p className="mb-5 leading-relaxed text-slate-700" {...props} />,
                    ul: ({ node, ...props }) => <ul className="list-disc pl-6 mb-5 space-y-2 text-slate-700" {...props} />,
                    ol: ({ node, ...props }) => <ol className="list-decimal pl-6 mb-5 space-y-2 text-slate-700" {...props} />,
                    li: ({ node, ...props }) => <li className="pl-1" {...props} />,
                    strong: ({ node, ...props }) => <strong className="font-bold text-purple-900 bg-purple-50 px-1 rounded" {...props} />,
                    blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-purple-300 pl-4 py-1 italic my-5 text-slate-600 bg-slate-50 rounded-r-lg" {...props} />,
                    hr: ({ node, ...props }) => <hr className="my-8 border-slate-200" {...props} />,
                    a: ({ node, ...props }) => <a className="text-purple-600 hover:text-purple-800 underline decoration-purple-300 underline-offset-2" {...props} />,
                  }}
                >
                  {data.aiAnalysis || ""}
                </ReactMarkdown>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* 공개/비공개 토글 (소유자만 보임) */}
        {isOwner && (
          <section className="mb-12">
            <Card className="bg-white/60 backdrop-blur-sm border-purple-100 shadow-sm rounded-3xl overflow-hidden">
              <CardContent className="p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-start space-x-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-colors ${data.isPublic ? "bg-pink-50 text-pink-500" : "bg-slate-50 text-slate-400"}`}>
                    {data.isPublic ? <Globe className="w-6 h-6" /> : <Lock className="w-6 h-6" />}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 tracking-tight mb-1">
                      {data.isPublic ? "대중에게 공개된 해몽" : "나만 볼 수 있는 해몽"}
                    </h3>
                    <p className="text-slate-500 text-sm leading-relaxed">
                      {data.isPublic 
                        ? "현재 이 해몽은 피드에 공개되어 다른 사람들도 볼 수 있어요. 원치 않는다면 비공개로 변경할 수 있습니다." 
                        : "현재 이 해몽은 비공개 상태입니다. 다른 사람들과 신비로운 꿈 이야기를 공유하려면 공개로 변경해보세요."}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 shrink-0">
                  <Label htmlFor="public-toggle" className="text-sm font-medium text-slate-600 cursor-pointer">
                    {data.isPublic ? "공개 상태" : "비공개 상태"}
                  </Label>
                  <Switch
                    id="public-toggle"
                    checked={data.isPublic}
                    onCheckedChange={handleTogglePublic}
                    disabled={isUpdatingPublic}
                    className="data-[state=checked]:bg-pink-500"
                  />
                </div>
              </CardContent>
            </Card>
          </section>
        )}

        {/* 공유하기 버튼 */}
        <section className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Button 
            variant="outline" 
            className="w-full sm:w-auto rounded-full bg-white hover:bg-slate-50 border-slate-200 text-slate-700 h-14 px-8 font-bold shadow-sm transition-all"
            onClick={handleCopyLink}
          >
            <Copy className="w-4 h-4 mr-2" />
            {isCopied ? "링크 복사 완료!" : "결과 링크 복사"}
          </Button>
          <Button 
            className="w-full sm:w-auto rounded-full bg-[#FEE500] hover:bg-[#FEE500]/90 text-[#3C1E1E] h-14 px-8 font-bold shadow-md transition-all active:scale-95"
            onClick={handleKakaoShare}
          >
            <Share2 className="w-4 h-4 mr-2" />
            카카오톡 공유하기
          </Button>
        </section>

        {/* 메인 페이지 이동 */}
        <div className="text-center">
           <Button 
             variant="link" 
             onClick={() => router.push("/")}
             className="text-slate-400 hover:text-purple-600 font-medium"
           >
             새로운 꿈 해몽하기
           </Button>
        </div>
      </div>
    </div>
  );
}
