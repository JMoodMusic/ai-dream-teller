"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { useRouter } from "next/navigation";
import { ShoppingBag, Sparkles, FileText, ChevronRight, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PurchaseItem {
  id: string;
  orderId: string;
  date: Date;
  dreamTitle: string;
  type: "text" | "image";
  price: number;
  status: "COMPLETED" | "PENDING" | "PROCESSING" | "FAILED";
}

// DUMMY_PURCHASES 제거됨

export default function GuestCheckPage() {
  const router = useRouter();
  const [purchases, setPurchases] = useState<PurchaseItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/orders/me");
        if (!res.ok) throw new Error("Failed to fetch orders");
        const { orders } = await res.json();
        
        interface OrderResponse {
          id: string;
          order_number: string;
          created_at: string;
          total_amount: number;
          dreams: {
            status: "COMPLETED" | "PENDING" | "PROCESSING" | "FAILED";
            dream_content: string;
          }[];
        }

        const mapped: PurchaseItem[] = (orders as OrderResponse[]).map((o) => ({
          id: o.id,
          orderId: o.order_number,
          date: new Date(o.created_at),
          dreamTitle: o.dreams[0]?.dream_content?.slice(0, 20) + "..." || "제목 없음",
          type: o.total_amount > 1500 ? "image" : "text",
          price: o.total_amount,
          status: o.dreams[0]?.status || "PENDING",
        }));
        
        setPurchases(mapped);
      } catch (err) {
        console.error("Order fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await fetch("/api/auth/guest/logout", { method: "POST" });
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("로그아웃 실패:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const fadeUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh] bg-[#FDFBF7]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
          <p className="text-slate-500 font-medium animate-pulse">조회 내역을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-slate-800 pb-24 relative overflow-hidden">
      {/* Background Aurora Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-pink-200/20 blur-[120px] mix-blend-multiply" />
        <div className="absolute bottom-[10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-300/20 blur-[120px] mix-blend-multiply" />
      </div>

      <main className="relative z-10 w-full max-w-2xl mx-auto px-4 pt-16 sm:px-6 flex flex-col gap-8">
        <motion.div
          {...fadeUp}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              비회원{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500">
                주문조회
              </span>
            </h1>
            <p className="mt-2 text-slate-500 text-sm">입력하신 전화번호로 조회된 구매 내역입니다.</p>
          </div>
          <Button 
            variant="ghost" 
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="text-slate-400 hover:text-red-500 hover:bg-red-50"
          >
            <LogOut className="w-4 h-4 mr-2" />
            조회 종료
          </Button>
        </motion.div>

        <motion.div
          {...fadeUp}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white/60 backdrop-blur-sm rounded-3xl border border-slate-200/60 shadow-sm p-6 hover:bg-white/80 transition-colors"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-pink-500" />
              <h2 className="font-serif text-lg font-semibold text-slate-800">
                나의 구매 내역
              </h2>
            </div>
            <span className="text-xs text-slate-400 bg-slate-100/80 px-2.5 py-1 rounded-full">
              총 {purchases.length}건
            </span>
          </div>

          {purchases.length > 0 ? (
            <div className="flex flex-col gap-3">
              {purchases.map((purchase, idx) => (
                <motion.div
                  key={purchase.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.1 }}
                >
                  <Link
                    href={`/dream-result/${purchase.orderId}`}
                    className="group flex items-center gap-4 p-4 rounded-2xl border border-slate-100/80 bg-white/40 hover:bg-white/80 hover:border-purple-200/60 hover:shadow-md transition-all"
                  >
                    {/* 아이콘 */}
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        purchase.type === "image"
                          ? "bg-gradient-to-br from-purple-100 to-pink-100"
                          : "bg-gradient-to-br from-slate-100 to-blue-100"
                      }`}
                    >
                      {purchase.type === "image" ? (
                        <Sparkles className="w-5 h-5 text-pink-500" />
                      ) : (
                        <FileText className="w-5 h-5 text-blue-500" />
                      )}
                    </div>

                    {/* 내용 */}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-800 text-sm truncate group-hover:text-purple-700 transition-colors">
                        {purchase.dreamTitle}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-slate-400">
                          {format(purchase.date, "yyyy년 M월 d일", { locale: ko })}
                        </span>
                        <span
                          className={`text-xs px-1.5 py-0.5 rounded-md font-medium ${
                            purchase.type === "image"
                              ? "bg-pink-50 text-pink-500"
                              : "bg-blue-50 text-blue-500"
                          }`}
                        >
                          {purchase.type === "image"
                            ? "텍스트 + 이미지"
                            : "텍스트"}
                        </span>
                        <span
                          className={`text-xs px-1.5 py-0.5 rounded-md font-medium ${
                            purchase.status === "COMPLETED"
                              ? "bg-green-50 text-green-500"
                              : purchase.status === "FAILED"
                              ? "bg-red-50 text-red-500"
                              : "bg-amber-50 text-amber-500 animate-pulse"
                          }`}
                        >
                          {purchase.status === "COMPLETED" 
                            ? "분석 완료" 
                            : purchase.status === "FAILED"
                            ? "분석 실패"
                            : "AI 분석 중..."}
                        </span>
                      </div>
                    </div>

                    {/* 가격 + 화살표 */}
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-sm font-semibold text-slate-700">
                        {purchase.price.toLocaleString()}원
                      </span>
                      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-purple-400 group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-purple-400" />
              </div>
              <p className="text-slate-500 text-sm mb-1">
                아직 해몽 기록이 없어요
              </p>
            </div>
          )}
        </motion.div>

        {/* 회원가입 유도 섹션 */}
        <motion.div
          {...fadeUp}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-gradient-to-br from-purple-600 to-pink-500 rounded-3xl shadow-lg p-8 text-white relative overflow-hidden"
        >
          {/* 장식용 빛나는 배경 효과 */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-2xl translate-y-1/4 -translate-x-1/4 pointer-events-none" />

          <div className="relative z-10 flex flex-col gap-7">
            <div className="space-y-4">
              <h3 className="text-xl sm:text-2xl font-bold flex items-center gap-2 break-keep">
                <Sparkles className="w-6 h-6 text-yellow-300 shrink-0" />
                회원이 되시면 더 많은 혜택이 있어요!
              </h3>
              <ul className="space-y-2.5 text-sm sm:text-base text-white/90 font-medium ml-1">
                <li className="flex items-center gap-2 break-keep">
                  <div className="w-1.5 h-1.5 rounded-full bg-yellow-300 shrink-0" />
                  첫 구매 시 500원 할인 쿠폰 즉시 지급
                </li>
                <li className="flex items-center gap-2 break-keep">
                  <div className="w-1.5 h-1.5 rounded-full bg-yellow-300 shrink-0" />
                  꿈 해석 기록 영구 보존 및 심리 일기 캘린더 제공
                </li>
              </ul>
            </div>
            
            <div className="w-full pt-1">
              <Button
                onClick={() => router.push("/auth")}
                className="w-full h-14 rounded-full bg-white text-purple-600 hover:bg-slate-50 font-bold text-base shadow-md transition-transform hover:scale-105"
              >
                3초 만에 회원가입 하기
              </Button>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
