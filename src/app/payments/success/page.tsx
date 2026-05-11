"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const paymentKey = searchParams.get("paymentKey");
  const orderId = searchParams.get("orderId");
  const amount = searchParams.get("amount");

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [countdown, setCountdown] = useState(3);
  const [redirectPath, setRedirectPath] = useState<string>("/my-page");
  const [redirectText, setRedirectText] = useState<string>("마이페이지");

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        setRedirectPath("/guest-login");
        setRedirectText("비회원 주문조회");
      }
    });
  }, []);

  useEffect(() => {
    async function confirmPayment() {
      if (!paymentKey || !orderId || !amount) {
        setStatus("error");
        setErrorMessage("결제 정보가 올바르지 않습니다.");
        return;
      }

      try {
        const response = await fetch("/api/payments/toss/confirm", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            paymentKey,
            orderId,
            amount,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          setStatus("success");
        } else {
          setStatus("error");
          setErrorMessage(data.message || "결제 승인 중 오류가 발생했습니다.");
        }
      } catch (error) {
        setStatus("error");
        setErrorMessage("서버와 통신 중 오류가 발생했습니다.");
      }
    }

    confirmPayment();
  }, [paymentKey, orderId, amount]);

  useEffect(() => {
    if (status === "success") {
      const timer = setInterval(() => {
        setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);

      const redirectTimer = setTimeout(() => {
        router.push(redirectPath);
      }, 3000);

      return () => {
        clearInterval(timer);
        clearTimeout(redirectTimer);
      };
    }
  }, [status, router, redirectPath]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 border-4 border-purple-400 border-t-transparent rounded-full animate-spin mb-6" />
        <h2 className="text-xl font-bold text-slate-800 mb-2">결제 승인 중...</h2>
        <p className="text-slate-500">잠시만 기다려주세요.</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 max-w-md w-full text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-slate-800 mb-4">결제 승인 실패</h2>
          <p className="text-slate-600 mb-8">{errorMessage}</p>
          <Button 
            onClick={() => router.push("/payments")}
            className="w-full h-14 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-lg"
          >
            결제 다시 시도하기
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 sm:p-12 rounded-3xl shadow-sm border border-slate-100 max-w-md w-full text-center">
        <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-6" />
        <h2 className="text-2xl font-bold text-slate-800 mb-2">결제가 완료되었습니다!</h2>
        <p className="text-slate-500 mb-8">성공적으로 주문이 접수되었습니다.</p>
        
        <div className="bg-slate-50 rounded-xl p-4 mb-8 text-left">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-slate-500">주문 번호</span>
            <span className="text-sm font-medium text-slate-800">{orderId}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-500">결제 금액</span>
            <span className="text-sm font-medium text-purple-600">{Number(amount).toLocaleString()}원</span>
          </div>
        </div>

        <p className="text-xs text-slate-400 mt-4">
          {countdown}초 후 {redirectText}로 자동으로 이동합니다...
        </p>

        <div className="mt-6 flex flex-col gap-3">
          <Button 
            onClick={() => router.push(`/dream-result/${orderId}`)}
            className="w-full h-14 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white font-bold text-lg border-0 shadow-md hover:shadow-lg transition-all"
          >
            나의 꿈 해몽 결과 확인하기
          </Button>
          <Button 
            variant="outline"
            onClick={() => router.push(redirectPath)}
            className="w-full h-12 rounded-xl border-slate-200 text-slate-600 font-medium"
          >
            {redirectText}로 바로가기
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">로딩중...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
