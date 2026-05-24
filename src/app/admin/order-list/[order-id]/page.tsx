"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Calendar, 
  User, 
  CreditCard, 
  Sparkles, 
  Image as ImageIcon, 
  RefreshCw, 
  AlertCircle, 
  CheckCircle2, 
  XCircle,
  Clock,
  Terminal,
  Send,
  Download,
  AlertTriangle
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

// 상세 주문 내역 인터페이스 정의
interface DetailedOrder {
  id: string;
  orderNumber: string;
  userType: "MEMBER" | "GUEST";
  buyerInfo: string;
  expertStyle: string;
  dreamContent: string;
  aiAnalysis: {
    symbolism: string;
    advice: string;
    prediction: string;
    fullText: string;
  };
  imageUrl: string | null;
  totalAmount: number;
  status: "SUCCESS" | "PENDING" | "FAILED";
  paymentKey: string | null;
  createdAt: string;
  updatedAt: string;
  systemLogs: {
    timestamp: string;
    level: "INFO" | "WARN" | "ERROR";
    message: string;
  }[];
}

// 15개 주문 내역에 매칭되는 정밀 상세 데이터 맵 (인터랙션 데이터 일치성 보장)
const MOCK_DETAILS: Record<string, DetailedOrder> = {
  "ord_1": {
    id: "ord_1",
    orderNumber: "ord_1779607041724_ofn81gc",
    userType: "GUEST",
    buyerInfo: "010-1234-5107",
    expertStyle: "프로이트 (무의식의 억압된 성적/성장 본능 탐구)",
    dreamContent: "지그문트 프로이트를 봤어... 그가 나에게 꿈의 해석 책을 건네주며 조용히 미소를 지었지.",
    aiAnalysis: {
      symbolism: "프로이트 인물이 직접 등장하고 책을 건네주는 행위는, 꿈꾸는 이가 내면에 억압하고 있던 무의식적 비밀이나 자아(Ego)의 검열 상태에서 벗어나 지적 탐구 및 내적 진실을 마주하고자 하는 강력한 심리적 동기를 상징합니다. 책은 감춰져 있던 정신분석학적 앎과 봉인 해제를 뜻합니다.",
      advice: "현재 삶에서 스스로 외면하고 있거나 이성적으로 억누르고 있는 도덕적 자책감, 혹은 본능적인 욕망이 없는지 진지하게 서술해 보십시오. 무의식은 이미 진실을 밝힐 준비가 되었습니다.",
      prediction: "가까운 시일 내에 자신의 과거 상처나 콤플렉스를 극적으로 직시하고 극복하게 될 내적 성장 계기가 생길 것입니다.",
      fullText: "자아의 방어기제를 허물고 무의식의 가장 깊은 영토로 나아가라는 강력한 초자아(Superego)의 신호입니다. 프로이트 박사가 직접 미소를 지으며 건넨 책은 타인의 시선에서 벗어나 온전한 나만의 본능과 직면할 용기를 대변합니다."
    },
    imageUrl: null, // 1500원 텍스트 기본 상품
    totalAmount: 1500,
    status: "SUCCESS",
    paymentKey: "pay_toss_confirm_key_9281a819",
    createdAt: "2026-05-24T07:17:21.913Z",
    updatedAt: "2026-05-24T07:17:25.102Z",
    systemLogs: [
      { timestamp: "16:17:21.913", level: "INFO", message: "가주문서 생성 완료 (guest_id: 5462f5a6-d486-4caf-ad93-44bb61b2a41f)" },
      { timestamp: "16:17:24.402", level: "INFO", message: "Toss Payments 결제 승인 요청 수신 (paymentKey: pay_toss_confirm_key_9281a819)" },
      { timestamp: "16:17:25.011", level: "INFO", message: "금액 교차 검증 성공 (주문 금액 1,500원 === 결제 요청 금액 1,500원)" },
      { timestamp: "16:17:25.102", level: "INFO", message: "DB 상태 변경 완료: PENDING -> SUCCESS" },
      { timestamp: "16:17:25.590", level: "INFO", message: "Telegram Notification Bot 알림 전송 성공: [SUCCESS] 1,500원 게스트 주문" }
    ]
  },
  "ord_2": {
    id: "ord_2",
    orderNumber: "ord_1779606750325_y119yld",
    userType: "GUEST",
    buyerInfo: "010-9876-5432",
    expertStyle: "칼 융 (원형과 집단 무의식 및 자기 실현 분석)",
    dreamContent: "삼성전자 인버스에 전재산 박아서 돈을 다 잃고 한강 다리에 가 있었어. 근데 거대한 황금 물고기가 물속에서 나타나...",
    aiAnalysis: {
      symbolism: "돈을 잃고 한강 다리에 선 것은 페르소나(사회적 가면)의 몰락과 자아의 죽음 상태를 나타내며, 집단 무의식의 깊은 바다(한강)에서 떠오른 거대한 황금 물고기는 융 학파에서 말하는 '자기(Self)' 원형의 발현입니다. 이는 생명력의 원천이자 절망의 한가운데서 피어나는 새로운 창조적 가능성을 뜻합니다.",
      advice: "사회적 지위나 물질적 재화에 투영했던 자신의 리비도(정신적 에너지)를 내면으로 돌리십시오. 현 위기는 자아의 팽창이 꺾이고, 진정한 자기 실현(Individuation)으로 나아가는 과정입니다.",
      prediction: "기존에 매달리던 물질적 집착에서 완전히 탈피하여, 정신적으로 가치 있는 진로의 전환이나 깨달음을 얻게 될 것입니다.",
      fullText: "자아의 죽음과 황금 물고기로 대변되는 심층 정신의 부활을 알리는 전형적인 자기실현의 꿈입니다. 돈의 상실은 역설적으로 내적 에너지의 통제권을 진정한 '자기(Self)'에게 양도하는 위대한 첫걸음이 됩니다."
    },
    imageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1000&auto=format&fit=crop", // 이미지 포함 상품
    totalAmount: 2000,
    status: "SUCCESS",
    paymentKey: "pay_toss_confirm_key_119yld_8a12",
    createdAt: "2026-05-24T07:12:32.807Z",
    updatedAt: "2026-05-24T07:13:02.409Z",
    systemLogs: [
      { timestamp: "16:12:32.807", level: "INFO", message: "가주문서 생성 완료 (guest_id: a829x1la-129a-4c22-b921-12a9128aa1a2)" },
      { timestamp: "16:12:59.800", level: "INFO", message: "Toss Payments 결제 승인 요청 수신 (paymentKey: pay_toss_confirm_key_119yld_8a12)" },
      { timestamp: "16:13:01.002", level: "INFO", message: "금액 교차 검증 성공 (주문 금액 2,000원 === 결제 요청 금액 2,000원)" },
      { timestamp: "16:13:02.409", level: "INFO", message: "DB 상태 변경 완료: PENDING -> SUCCESS" },
      { timestamp: "16:13:05.112", level: "INFO", message: "AI Dream Image Generator API 호출: Prompt 송신 성공" },
      { timestamp: "16:13:12.890", level: "INFO", message: "AI Dream Image 생성 완료 & Supabase Storage 업로드 성공" },
      { timestamp: "16:13:13.001", level: "INFO", message: "Telegram Notification Bot 알림 전송 성공: [SUCCESS] 2,000원 게스트 주문" }
    ]
  },
  "ord_3": {
    id: "ord_3",
    orderNumber: "ord_1779606328311_5b7bjjv",
    userType: "MEMBER",
    buyerInfo: "user1@dreamer.com",
    expertStyle: "개인심리학의 거장 아들러 (열등감 극복과 공동체 감각)",
    dreamContent: "니어 프로토콜 코인이 15000원 가는 걸 꿈에서 보고 영차영차 외치면서 사람들 틈에서 신나게 춤을 췄어.",
    aiAnalysis: {
      symbolism: "코인의 급격한 상승을 보며 사람들 틈에서 춤을 추는 것은, 현재 현실 생활에서 겪고 있는 재정적 불안이나 사회적 열등감을 가상적으로 보상받고자 하는 강한 '우월성 추구(Striving for Superiority)'의 무의식적 시도입니다. 공동체(사람들 틈)와의 연결을 원하는 심리도 존재합니다.",
      advice: "미래에 대한 불안감을 투기적인 일확천금의 기대감으로 은폐하려는 경향을 조심하십시오. 용기(Courage)를 내어 현실의 당면 과제를 정면으로 해결해 나갈 구체적인 계획을 세우는 것이 중요합니다.",
      prediction: "타인과의 협력이나 건전한 소통을 통해 현실적인 공동체 안에서 소속감과 정서적 안정을 확인하게 될 것입니다.",
      fullText: "아들러 이론에 입각할 때, 이 꿈은 열등감을 숨기고 과도한 우월감의 가상적 목표에 에너지를 쏟는 심리 기제를 투영합니다. 사람들 틈에서 함께 춤추는 행위는 타인과 연대하려는 긍정적인 사회적 관심(Social Interest)의 맹아를 내포하고 있습니다."
    },
    imageUrl: "https://images.unsplash.com/photo-1464802686167-b939a6910659?q=80&w=1000&auto=format&fit=crop", // 이미지 포함 상품
    totalAmount: 2000,
    status: "SUCCESS",
    paymentKey: "pay_toss_confirm_key_5b7bjjv_0219",
    createdAt: "2026-05-24T07:05:28.699Z",
    updatedAt: "2026-05-24T07:05:59.112Z",
    systemLogs: [
      { timestamp: "16:05:28.699", level: "INFO", message: "가주문서 생성 완료 (profile_id: 112f45ea-281b-46fa-ad81-fa810294da11)" },
      { timestamp: "16:05:58.200", level: "INFO", message: "Toss Payments 결제 승인 요청 수신" },
      { timestamp: "16:05:59.001", level: "INFO", message: "금액 교차 검증 성공" },
      { timestamp: "16:05:59.112", level: "INFO", message: "DB 상태 변경 완료: PENDING -> SUCCESS" },
      { timestamp: "16:06:01.882", level: "INFO", message: "AI Dream Image 생성 완료 & 업로드 성공" }
    ]
  }
};

// 4번부터 15번까지의 기본 동적 매칭 생성용 제네릭 폴백 함수 (데이터 안정성 확보)
const getFallbackDetail = (orderId: string): DetailedOrder => {
  return {
    id: orderId,
    orderNumber: `ord_simulated_${orderId}`,
    userType: "MEMBER",
    buyerInfo: "test_admin_viewer@dream.com",
    expertStyle: "지그문트 프로이트",
    dreamContent: "깊은 밤, 돌아가신 조상님이 나타나 나에게 보물상자가 묻힌 지도를 보여주는 꿈을 생생하게 꾸었다.",
    aiAnalysis: {
      symbolism: "조상님은 내면에 내재화된 도덕적 검열관(Superego)이자 과거의 지혜를 상징합니다. 보물상자는 당신이 억압하고 있는 잠재적인 정신적 자원과 잃어버린 열정을 회복하고 싶은 강력한 욕망의 시각적 형상화입니다.",
      advice: "외부적인 성공에 집착하기보다 본인이 진정으로 소중히 여기는 인생의 가치와 내적 자산이 무엇인지 심도 깊게 복기해 보시기 바랍니다.",
      prediction: "조만간 직감적인 영감이 떠올라 오랫동안 해결하지 못했던 난제를 해결하는 결정적인 실마리를 얻을 것입니다.",
      fullText: "조상이 매개하는 꿈은 무의식이 자아에게 전하는 무겁고 성스러운 힌트입니다. 보물은 물질적 행운이라기보다 정신적인 통합을 대변하는 융/프로이트의 공통적인 상징물에 가깝습니다."
    },
    imageUrl: "https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=1000&auto=format&fit=crop",
    totalAmount: 2000,
    status: "SUCCESS",
    paymentKey: "pay_toss_simulated_key_11029",
    createdAt: "2026-05-23T12:00:00.000Z",
    updatedAt: "2026-05-23T12:00:30.000Z",
    systemLogs: [
      { timestamp: "21:00:00.000", level: "INFO", message: "시뮬레이션 상세 정보 로드 완료" },
      { timestamp: "21:00:02.100", level: "INFO", message: "안정적인 더미 데이터 셋 복원 성공" }
    ]
  };
};

// TODO: 추후 특정 주문 상세 조회 API(/api/admin/orders/[id]) 및 재생성 API(/api/admin/orders/[id]/regenerate) 연동 (FIX: LLM 응답 지연 타임아웃 10초 예외 대응)
const AdminOrderDetailPage = ({ params }: { params: Promise<{ "order-id": string }> }) => {
  const router = useRouter();
  
  // React.use()를 활용해 비동기 params의 프로퍼티를 안전하게 언랩합니다. (Next.js 15+ 동적 API 대응)
  const unwrappedParams = React.use(params);
  const orderId = unwrappedParams["order-id"];

  // 상태 관리
  const [order, setOrder] = useState<DetailedOrder | null>(null);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [statusOverride, setStatusOverride] = useState<"SUCCESS" | "PENDING" | "FAILED">("SUCCESS");
  const [showOverrideWarning, setShowOverrideWarning] = useState(false);

  // 데이터 로드
  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        setLoading(true);
        // TODO: 실제 백엔드 연동 시: const res = await fetch(`/api/admin/orders/${orderId}`);
        await new Promise(resolve => setTimeout(resolve, 400));
        
        const matchedOrder = MOCK_DETAILS[orderId] || getFallbackDetail(orderId);
        setOrder(matchedOrder);
        setStatusOverride(matchedOrder.status);
      } catch (err) {
        console.error("주문 상세조회 로딩 에러:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetail();
  }, [orderId]);

  // 해몽 재생성 시뮬레이션 로직
  const handleRegenerateAnalysis = async () => {
    if (!order) return;

    try {
      setIsRegenerating(true);
      // TODO: 실제 백엔드 API 연동 시: const res = await fetch(`/api/admin/orders/${orderId}/regenerate`, { method: "POST" });
      await new Promise(resolve => setTimeout(resolve, 2000));

      setOrder(prev => {
        if (!prev) return null;
        return {
          ...prev,
          aiAnalysis: {
            symbolism: "무의식이 완전히 새로운 방향성으로 튜닝되어 해독되었습니다. 꿈속에 나타난 디테일 요소들은 억제되었던 자아의 그림자(Shadow)를 고스란히 반영하고 있으며, 긍정적인 삶의 리비도 충동이 새로운 돌파구를 열고자 애쓰는 역동입니다.",
            advice: "현재 삶의 불만족 요소를 회피하려는 충동이 잠재해 있으니, 현실의 소소한 일상에서 작은 성취감을 누리도록 라이프스타일을 조정해 보십시오.",
            prediction: "당장 큰 횡재수보다는, 인간관계의 해묵은 오해가 풀려 심리적인 체증이 시원하게 풀리는 변화를 맞게 됩니다.",
            fullText: "재생성 필터링 분석 완료: 본 해석은 관리자의 품질 모니터링 감사 정책에 따라 LLM 엔진을 통해 즉각 최신화 및 재연산된 전문 해몽 분석서입니다."
          },
          updatedAt: new Date().toISOString(),
          systemLogs: [
            ...prev.systemLogs,
            { 
              timestamp: format(new Date(), "HH:mm:ss"), 
              level: "WARN", 
              message: "어드민 콘솔에 의해 AI 해몽 텍스트 재생성 요청 접수 및 성공적으로 재빌드 완료." 
            }
          ]
        };
      });

      alert("LLM 꿈 해몽 텍스트가 품질 정책에 맞게 새롭게 재생성되었습니다.");
    } catch (err) {
      console.error("해몽 재생성 실패:", err);
      alert("재생성 처리 중 에러가 발생했습니다.");
    } finally {
      setIsRegenerating(false);
    }
  };

  // 거래 상태 강제 강등/승격 Override 시뮬레이션
  const handleStatusOverride = () => {
    if (!order) return;
    
    setOrder(prev => {
      if (!prev) return null;
      return {
        ...prev,
        status: statusOverride,
        updatedAt: new Date().toISOString(),
        systemLogs: [
          ...prev.systemLogs,
          {
            timestamp: format(new Date(), "HH:mm:ss"),
            level: "WARN",
            message: `관리자 강제 제어로 결제 상태 오버라이드 갱신: ${prev.status} -> ${statusOverride}`
          }
        ]
      };
    });
    
    setShowOverrideWarning(false);
    alert(`주문 상태가 [${statusOverride === "SUCCESS" ? "결제 완료" : statusOverride === "PENDING" ? "입금 대기" : "결제 실패"}] 상태로 강제 변경되었습니다.`);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
        <p className="text-slate-500 font-medium animate-pulse">거래 원장 및 무의식 빅데이터를 검색하고 있습니다...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <Card className="p-12 text-center max-w-lg mx-auto mt-12 bg-white border border-slate-200 rounded-3xl">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h4 className="text-lg font-bold text-slate-800">해당 주문 건을 찾을 수 없습니다</h4>
        <p className="text-xs text-slate-400 mt-2">삭제되었거나 시스템 원장에 존재하지 않는 주문 식별자입니다.</p>
        <Link
          href="/admin/order-list"
          className="mt-6 inline-flex items-center gap-2 h-10 px-5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          주문 목록으로 돌아가기
        </Link>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      {/* 1. 상단 브레드크럼 및 뒤로가기 */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <Link 
            href="/admin/order-list"
            className="text-xs font-bold text-purple-600 hover:text-purple-700 flex items-center gap-1 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            주문 거래 원장 리스트로 돌아가기
          </Link>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            주문 상세 정보 감사
            <span className="text-sm font-semibold text-slate-400 font-mono tracking-normal">
              #{order.id}
            </span>
          </h3>
        </div>

        {/* 결제 상태별 시각적 배지 */}
        <span className={`text-xs px-3.5 py-1.5 rounded-full font-bold uppercase tracking-wider inline-flex items-center gap-1.5 shadow-sm ${
          order.status === "SUCCESS" 
            ? "bg-green-50 text-green-600 border border-green-200/50" 
            : order.status === "PENDING"
            ? "bg-amber-50 text-amber-600 border border-amber-200/50"
            : "bg-red-50 text-red-600 border border-red-200/50"
        }`}>
          {order.status === "SUCCESS" ? <CheckCircle2 className="w-3.5 h-3.5" /> : order.status === "PENDING" ? <Clock className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
          {order.status === "SUCCESS" ? "결제 승인 완료" : order.status === "PENDING" ? "가상계좌 입금 대기" : "결제 실패 / 취소"}
        </span>
      </div>

      {/* 2. 2단 분할 레이아웃 배치 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* 좌측 2단 영역: 꿈 입력 + LLM 해몽 + 이미지 결과 */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* 가. 꿈 내용 원본 */}
          <Card className="bg-white/60 backdrop-blur-sm border-slate-200/60 shadow-sm rounded-3xl overflow-hidden p-6 relative">
            <div className="absolute top-0 right-0 w-16 h-16 bg-purple-500/5 rounded-bl-full flex items-center justify-center pointer-events-none">
              <Sparkles className="w-5 h-5 text-purple-400/50 translate-x-2 -translate-y-2" />
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">유저 원본 무의식 (Dream Input)</span>
              </div>
              <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100 font-medium text-slate-700 italic leading-relaxed text-sm">
                &ldquo; {order.dreamContent} &rdquo;
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-500">선택 전문가 해몽 유형:</span>
                <span className="font-black text-purple-600 bg-purple-50 px-3 py-1 rounded-lg">{order.expertStyle}</span>
              </div>
            </div>
          </Card>

          {/* 나. LLM 해몽 결과서 */}
          <Card className="bg-white/60 backdrop-blur-sm border-slate-200/60 shadow-sm rounded-3xl overflow-hidden p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h4 className="text-base font-black text-slate-800">AI 심층 꿈 해몽 분석 보고서</h4>
                <p className="text-[10px] text-slate-400 font-semibold uppercase mt-0.5">Advanced LLM Dream Interpretation Quality Check</p>
              </div>

              {/* 해몽 재생성 버튼 */}
              <button
                onClick={handleRegenerateAnalysis}
                disabled={isRegenerating}
                className="flex items-center justify-center gap-1.5 h-9 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors shadow-sm disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRegenerating ? "animate-spin" : ""}`} />
                {isRegenerating ? "AI 재연산 중..." : "해몽 보고서 재생성"}
              </button>
            </div>

            {isRegenerating ? (
              <div className="py-12 flex flex-col items-center justify-center gap-4">
                <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
                <p className="text-xs text-slate-500 font-medium animate-pulse">LLM이 전문가 분석 기법에 기반해 해몽을 재생성 중입니다...</p>
              </div>
            ) : (
              <div className="space-y-6 text-sm">
                <div className="space-y-2">
                  <span className="text-[10px] text-purple-500 font-black uppercase tracking-wider block">1. 상징물 분석 (Symbolism)</span>
                  <p className="text-slate-700 font-medium leading-relaxed bg-purple-50/20 p-4 rounded-2xl border border-purple-100/30">
                    {order.aiAnalysis.symbolism}
                  </p>
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] text-purple-500 font-black uppercase tracking-wider block">2. 내면 심리적 조언 (Advice)</span>
                  <p className="text-slate-700 font-medium leading-relaxed bg-purple-50/20 p-4 rounded-2xl border border-purple-100/30">
                    {order.aiAnalysis.advice}
                  </p>
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] text-purple-500 font-black uppercase tracking-wider block">3. 미래 추세 예측 (Prediction)</span>
                  <p className="text-slate-700 font-medium leading-relaxed bg-purple-50/20 p-4 rounded-2xl border border-purple-100/30">
                    {order.aiAnalysis.prediction}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 space-y-2">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">총평 및 인공지능 요약 전문</span>
                  <p className="text-xs font-semibold text-slate-500 bg-slate-50 p-4 rounded-xl border border-slate-100 leading-relaxed">
                    {order.aiAnalysis.fullText}
                  </p>
                </div>
              </div>
            )}
          </Card>

          {/* 다. AI 꿈 심상 이미지 */}
          <Card className="bg-white/60 backdrop-blur-sm border-slate-200/60 shadow-sm rounded-3xl overflow-hidden p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
                  <ImageIcon className="w-3.5 h-3.5 text-purple-500" />
                  AI가 시각화한 꿈의 심상 (AI Generated Dream Visualization)
                </span>
                
                {order.imageUrl && (
                  <a
                    href={order.imageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-slate-500 hover:text-purple-600 transition-colors flex items-center gap-1"
                  >
                    <Download className="w-3.5 h-3.5" />
                    원본 이미지 다운로드
                  </a>
                )}
              </div>

              {order.imageUrl ? (
                <div className="relative rounded-2xl overflow-hidden group shadow-inner border border-slate-100 bg-slate-900 max-h-[420px] flex items-center justify-center">
                  <img 
                    src={order.imageUrl} 
                    alt="AI Dream Render" 
                    className="object-contain w-full max-h-[420px] transition-transform duration-500 group-hover:scale-102"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <p className="text-xs text-white/95 font-semibold">Toss Payments 결제완료 후 자동 렌더링된 인공지능 정밀 심상 렌더러 모델</p>
                  </div>
                </div>
              ) : (
                <div className="p-8 border border-dashed border-slate-200 rounded-2xl text-center bg-slate-50/50">
                  <ImageIcon className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs font-bold text-slate-500">텍스트 전용(1,500원) 결제 건입니다</p>
                  <p className="text-[10px] text-slate-400 mt-1">
                    사용자가 이미지 추가 옵션을 선택하지 않고 기본 텍스트 해몽만 결제하여 꿈 이미지 생성 데이터가 존재하지 않습니다.
                  </p>
                </div>
              )}
            </div>
          </Card>

        </div>

        {/* 우측 1단 영역: 주문자 정보 + 결제 정보 + 개발용 원격 제어 로그 시뮬레이터 */}
        <div className="space-y-8">
          
          {/* 가. 주문자 및 결제 상세 정보 카드 */}
          <Card className="bg-white/60 backdrop-blur-sm border-slate-200/60 shadow-sm rounded-3xl overflow-hidden p-6">
            <div className="space-y-6">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <CreditCard className="w-4 h-4 text-purple-600" />
                결제 원장 감사 리포트
              </h4>

              <div className="space-y-4 text-xs font-medium">
                {/* 주문자 분류 */}
                <div className="flex justify-between items-center py-2.5 border-b border-slate-100">
                  <span className="text-slate-400">구매 유저 유형</span>
                  <span className={`px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                    order.userType === "MEMBER" ? "bg-purple-50 text-purple-600" : "bg-blue-50 text-blue-600"
                  }`}>
                    {order.userType === "MEMBER" ? "회원 유저" : "비회원 게스트"}
                  </span>
                </div>

                {/* 구매자 연락 정보 */}
                <div className="flex justify-between items-center py-2.5 border-b border-slate-100">
                  <span className="text-slate-400">
                    {order.userType === "MEMBER" ? "회원 이메일 계정" : "비회원 연락처 (조회용)"}
                  </span>
                  <span className="font-bold text-slate-800 font-mono">{order.buyerInfo}</span>
                </div>

                {/* 주문 일시 */}
                <div className="flex justify-between items-center py-2.5 border-b border-slate-100">
                  <span className="text-slate-400">가주문 생성 시점</span>
                  <span className="font-bold text-slate-600">
                    {format(new Date(order.createdAt), "yyyy-MM-dd HH:mm:ss", { locale: ko })}
                  </span>
                </div>

                {/* 결제 승인 시점 */}
                <div className="flex justify-between items-center py-2.5 border-b border-slate-100">
                  <span className="text-slate-400">결제 완료/실패 갱신</span>
                  <span className="font-bold text-slate-600">
                    {format(new Date(order.updatedAt), "yyyy-MM-dd HH:mm:ss", { locale: ko })}
                  </span>
                </div>

                {/* 총 결제 가격 */}
                <div className="flex justify-between items-center py-2.5 border-b border-slate-100">
                  <span className="text-slate-400">최종 청구 결제 금액</span>
                  <span className="text-sm font-black text-slate-900">
                    {order.totalAmount.toLocaleString()}원
                    <span className="text-[9px] text-slate-400 block font-semibold text-right leading-none mt-0.5">
                      {order.totalAmount === 1500 ? "텍스트 전용 상품" : "텍스트 + AI 이미지 상품"}
                    </span>
                  </span>
                </div>

                {/* 토스 결제키 */}
                <div className="space-y-1.5 py-2.5">
                  <span className="text-slate-400 block">Toss Payments 식별 키 (paymentKey)</span>
                  <code className="block p-2.5 bg-slate-900 rounded-xl text-[10px] text-emerald-400 font-mono truncate select-all">
                    {order.paymentKey || "N/A (결제 미완료 건)"}
                  </code>
                </div>
              </div>
            </div>
          </Card>

          {/* 나. 어드민 비상 강제 원장 제어 툴 (Status Overrider) */}
          <Card className="bg-white/60 backdrop-blur-sm border-slate-200/60 shadow-sm rounded-3xl overflow-hidden p-6 border-amber-200/50">
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5 text-amber-600">
                <AlertTriangle className="w-4 h-4" />
                관리자 비상 강제 제어 툴
              </h4>
              <p className="text-[10px] text-slate-400 leading-normal">
                결제 승인 누락, PG사 비동기 통신 실패 등으로 원장 보정이 시급할 시, 관리자 초월 권한으로 거래 상태를 강제 갱신합니다.
              </p>

              <div className="space-y-3">
                <select
                  value={statusOverride}
                  onChange={(e) => setStatusOverride(e.target.value as any)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 focus:outline-none"
                >
                  <option value="SUCCESS">결제 완료 상태 (SUCCESS)</option>
                  <option value="PENDING">입금 대기 상태 (PENDING)</option>
                  <option value="FAILED">결제 실패/취소 상태 (FAILED)</option>
                </select>

                <button
                  onClick={() => setShowOverrideWarning(true)}
                  className="w-full h-9 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs transition-colors shadow-sm"
                >
                  거래 상태 강제 갱신 적용
                </button>
              </div>

              {/* 오버라이드 경고 모달/경고 상태 박스 */}
              {showOverrideWarning && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl space-y-2.5 animate-fadeIn">
                  <p className="text-[10px] text-red-600 font-bold leading-normal">
                    주의: 강제 갱신 시 Toss 결제 승인 API와 DB 불일치가 나타날 수 있으며 해당 감사 로그가 어드민 시스템에 기록됩니다. 진행하시겠습니까?
                  </p>
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => setShowOverrideWarning(false)}
                      className="h-7 px-3 rounded-lg border border-slate-200 bg-white text-[10px] font-bold text-slate-500"
                    >
                      취소
                    </button>
                    <button
                      onClick={handleStatusOverride}
                      className="h-7 px-3 rounded-lg bg-red-600 text-white text-[10px] font-bold"
                    >
                      강제 적용 승인
                    </button>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* 다. 서버 원격 제어 실시간 감사 로그 (System/API Audit Logs) */}
          <Card className="bg-slate-950 shadow-lg rounded-3xl overflow-hidden p-6 text-slate-200">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Terminal className="w-4 h-4 text-emerald-400" />
                  실시간 서버 트랜잭션 로그
                </h4>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              </div>

              <div className="font-mono text-[10px] space-y-3 max-h-[220px] overflow-y-auto pr-1">
                {order.systemLogs.map((log, index) => (
                  <div key={index} className="space-y-0.5">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">[{log.timestamp}]</span>
                      <span className={`font-black ${
                        log.level === "ERROR" 
                          ? "text-red-500" 
                          : log.level === "WARN" 
                          ? "text-amber-500" 
                          : "text-emerald-500"
                      }`}>
                        {log.level}
                      </span>
                    </div>
                    <p className="text-slate-300 leading-normal pl-2 border-l border-slate-800">
                      {log.message}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Card>

        </div>

      </div>
    </div>
  );
};

export default AdminOrderDetailPage;
