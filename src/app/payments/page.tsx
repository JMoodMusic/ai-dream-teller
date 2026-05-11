"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { loadTossPayments, TossPaymentsWidgets } from "@tosspayments/tosspayments-sdk";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Receipt, Scissors } from "lucide-react";

// 토스페이먼츠 테스트용 클라이언트 키 (환경변수 우선, 없으면 공통 테스트 키 사용)
const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY || "test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm";

function PaymentsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const amountParam = searchParams.get("amount");
  const amount = amountParam ? parseInt(amountParam, 10) : 1500;

  const [widgets, setWidgets] = useState<TossPaymentsWidgets | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [customerKey, setCustomerKey] = useState<string>("");
  const [orderId, setOrderId] = useState<string>("");
  const [formattedDate, setFormattedDate] = useState<string>("");
  const [paymentError, setPaymentError] = useState<string | null>(null);

  useEffect(() => {
    // Hydration 에러 방지를 위해 클라이언트 마운트 후 랜덤 값 할당
    setCustomerKey("customer_" + Math.random().toString(36).substring(2, 10));
    // orderId는 결제 버튼 클릭 시 서버에서 발급받습니다.
    
    const today = new Date();
    setFormattedDate(`${today.getFullYear()}. ${today.getMonth() + 1}. ${today.getDate()}.`);
  }, []);

  useEffect(() => {
    async function fetchPaymentWidget() {
      if (!customerKey) return;
      try {
        const tossPayments = await loadTossPayments(clientKey);
        const widgets = tossPayments.widgets({ customerKey });
        setWidgets(widgets);
      } catch (error) {
        console.error("토스페이먼츠 위젯 로딩 실패:", error);
      }
    }
    fetchPaymentWidget();
  }, [customerKey]);

  useEffect(() => {
    async function renderPaymentWidgets() {
      if (!widgets) return;
      try {
        await widgets.setAmount({ currency: "KRW", value: amount });
        await Promise.all([
          widgets.renderPaymentMethods({
            selector: "#payment-method",
            variantKey: "DEFAULT",
          }),
          widgets.renderAgreement({
            selector: "#agreement",
            variantKey: "AGREEMENT",
          }),
        ]);
        
        setIsReady(true);
      } catch (error: any) {
        // React 18 StrictMode 렌더링 두번 실행으로 인한 '취소되었습니다' 에러 무시
        if (error.name === "UserCancelError" || error.message?.includes("취소")) {
          return;
        }
        console.error("위젯 렌더링 중 오류:", error);
      }
    }
    renderPaymentWidgets();
  }, [widgets, amount]);

  const handlePayment = async () => {
    try {
      setPaymentError(null);
      if (!widgets) return;

      // 1. 세션 스토리지에서 꿈 정보 가져오기
      const savedState = sessionStorage.getItem("dreamTellerState");
      if (!savedState) {
        setPaymentError("입력된 꿈 정보가 없습니다. 이전 페이지로 돌아가 다시 시도해주세요.");
        return;
      }

      const { selectedExpert, dreamContent, withImage, guestPhone, guestPassword } = JSON.parse(savedState);

      // 2. 서버에 가주문 생성 요청
      const orderRes = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          expertStyle: selectedExpert,
          dreamContent,
          includeImage: withImage,
          guestPhone,
          guestPassword
        })
      });

      if (!orderRes.ok) {
        const errorData = await orderRes.json();
        throw new Error(errorData.message || "주문 생성에 실패했습니다.");
      }

      const { orderId: serverOrderId, amount: serverAmount, orderName } = await orderRes.json();
      setOrderId(serverOrderId); // 로컬 상태 업데이트 (표시용)

      // 금액 변조 여부 더블체크 (프론트 표시 금액과 서버 산출 금액)
      if (serverAmount !== amount) {
        throw new Error("결제 금액이 일치하지 않습니다. 다시 시도해주세요.");
      }

      // 3. 토스페이먼츠 결제창 호출 (서버에서 발급한 orderId 사용)
      await widgets.requestPayment({
        orderId: serverOrderId,
        orderName: orderName,
        customerName: "테스트유저",
        customerEmail: "test@example.com",
        successUrl: window.location.origin + "/payments/success",
        failUrl: window.location.origin + "/payments/fail",
      });
    } catch (err: any) {
      console.error(err);
      if (err.name === "UserCancelError" || err.message?.includes("취소")) {
        return;
      }
      
      if (!window.navigator.onLine || err.name === "NetworkError" || err.message?.includes("Network")) {
        setPaymentError("인터넷 연결이 불안정합니다. 네트워크 상태를 확인하고 다시 시도해주세요.");
      } else {
        setPaymentError("결제 요청 중 오류가 발생했습니다: " + (err.message || "알 수 없는 오류"));
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center py-12 px-4 sm:px-6">
      <div className="w-full max-w-5xl flex items-center mb-8">
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white text-sm font-bold">AI</span>
          Dream Teller
        </h1>
      </div>

      <div className="w-full max-w-5xl flex flex-col md:flex-row gap-6 items-start">
        {/* Left: 영수증 UI */}
        <div className="w-full md:w-[400px] flex-shrink-0 flex flex-col gap-4">
          <div className="bg-white rounded-[24px] shadow-sm border border-slate-100 relative overflow-hidden pb-8">
            {/* 상단 장식용 원형 아이콘 */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <Receipt className="w-5 h-5 text-purple-600 mt-4" />
            </div>
            
            <div className="pt-10 px-8">
              <div className="text-center mb-8">
                <h2 className="text-xl font-bold text-slate-800 mb-1">주문 접수증</h2>
                <p className="text-sm text-slate-400 font-medium">{formattedDate}</p>
              </div>

              <div className="flex justify-between items-center mb-6">
                <span className="text-sm font-medium text-slate-500">주문 번호</span>
                <span className="text-xs font-mono font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md">{orderId}</span>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-700">전문 심층 해몽 (기본)</span>
                  <span className="text-sm font-semibold text-slate-800">1,500원</span>
                </div>
                {amount > 1500 && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-slate-700">AI 꿈 시각화 이미지 추가</span>
                    <span className="text-sm font-semibold text-slate-800">{(amount - 1500).toLocaleString()}원</span>
                  </div>
                )}
              </div>

              <div className="border-t border-dashed border-slate-200 pt-6 flex justify-between items-center">
                <span className="text-base font-bold text-slate-800">최종 결제 금액</span>
                <span className="text-2xl font-bold text-purple-600">{amount.toLocaleString()}원</span>
              </div>
            </div>

            {/* 절취선 디자인 */}
            <div className="absolute bottom-16 left-0 right-0 flex items-center px-4 overflow-hidden opacity-50">
              <Scissors className="w-4 h-4 text-slate-400 flex-shrink-0 -ml-1 mr-2" />
              <div className="flex-grow border-t-2 border-dashed border-slate-300"></div>
            </div>
          </div>
          
          <button 
            onClick={() => router.back()}
            className="flex items-center justify-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors py-2"
          >
            <ArrowLeft className="w-4 h-4" />
            선택 내역 수정하러 돌아가기
          </button>
        </div>

        {/* Right: 결제 위젯 */}
        <div className="w-full md:flex-grow bg-white rounded-[24px] shadow-sm border border-slate-100 p-8 min-h-[500px] relative">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-800 mb-1">결제 수단 선택</h2>
            <p className="text-sm text-slate-500">안전하고 간편하게 결제를 진행하세요.</p>
          </div>

          {!isReady && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-sm rounded-[24px] z-10">
              <div className="animate-pulse flex flex-col items-center">
                <div className="w-8 h-8 border-4 border-purple-400 border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-sm text-purple-600 font-medium">결제 모듈을 불러오는 중...</p>
              </div>
            </div>
          )}
          
          <div id="payment-method" className="w-full mb-2" />
          <div id="agreement" className="w-full mb-6" />

          {/* 에러 메시지 노출 */}
          {paymentError && (
            <div className="mb-4 p-4 bg-red-50/50 border border-red-200 rounded-xl text-red-600 text-sm font-medium flex items-start gap-2">
              <span className="w-5 h-5 flex items-center justify-center rounded-full bg-red-100 flex-shrink-0 mt-0.5">!</span>
              <p>{paymentError}</p>
            </div>
          )}

          <Button
            className="w-full h-14 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-lg border-0 shadow-sm transition-all"
            onClick={handlePayment}
            disabled={!isReady}
          >
            {amount.toLocaleString()}원 결제하기
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function PaymentsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">로딩중...</div>}>
      <PaymentsContent />
    </Suspense>
  );
}
