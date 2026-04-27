"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

function FailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const code = searchParams.get("code");
  const message = searchParams.get("message");

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 sm:p-12 rounded-3xl shadow-sm border border-slate-100 max-w-md w-full text-center">
        <AlertCircle className="w-20 h-20 text-red-500 mx-auto mb-6" />
        <h2 className="text-2xl font-bold text-slate-800 mb-2">결제를 실패했습니다</h2>
        <p className="text-slate-600 mb-6">{message || "알 수 없는 오류가 발생했습니다."}</p>
        
        {code && (
          <div className="bg-slate-50 rounded-xl p-4 mb-8 text-left">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-500">에러 코드</span>
              <span className="text-sm font-mono font-medium text-slate-800">{code}</span>
            </div>
          </div>
        )}

        <Button 
          onClick={() => router.push("/payments")}
          className="w-full h-14 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-lg transition-all"
        >
          결제 페이지로 돌아가기
        </Button>
      </div>
    </div>
  );
}

export default function FailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">로딩중...</div>}>
      <FailContent />
    </Suspense>
  );
}
