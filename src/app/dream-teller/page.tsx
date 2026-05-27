"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Brain, Network, Infinity as InfinityIcon, Sparkles, Image as ImageIcon, Info, ArrowLeft, ArrowRight, Maximize2, Minimize2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

/**
 * 프로덕트 상세 페이지 (/dream-teller)
 * 유저의 꿈을 입력받고 해몽 전문가 스타일을 선택하는 페이지.
 */
export default function DreamTellerPage() {
  const router = useRouter();
  const [selectedExpert, setSelectedExpert] = useState<string | null>(null);
  const [dreamContent, setDreamContent] = useState("");
  const [withImage, setWithImage] = useState(true);
  const [accordionValue, setAccordionValue] = useState<string[]>(["step-1"]);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [guestPhone, setGuestPhone] = useState("");
  const [guestPassword, setGuestPassword] = useState("");
  const [guestPrivacyConsent, setGuestPrivacyConsent] = useState(false);
  const [aiServiceConsent, setAiServiceConsent] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        setIsAuthenticated(!!user);
      } catch (error) {
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, []);

  // Load state from sessionStorage on mount (to persist state when navigating back)
  useEffect(() => {
    const savedState = sessionStorage.getItem("dreamTellerState");
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        setTimeout(() => {
          if (parsed.selectedExpert) setSelectedExpert(parsed.selectedExpert);
          if (parsed.dreamContent) setDreamContent(parsed.dreamContent);
          if (parsed.withImage !== undefined) setWithImage(parsed.withImage);
          if (parsed.accordionValue) setAccordionValue(parsed.accordionValue);
          if (parsed.guestPhone) setGuestPhone(parsed.guestPhone);
          if (parsed.guestPassword) setGuestPassword(parsed.guestPassword);
        }, 0);
      } catch (e) {
        console.error("Failed to parse saved state", e);
      }
    }
  }, []);

  // Save state to sessionStorage whenever it changes
  useEffect(() => {
    const stateToSave = {
      selectedExpert,
      dreamContent,
      withImage,
      accordionValue,
      guestPhone,
      guestPassword
    };
    sessionStorage.setItem("dreamTellerState", JSON.stringify(stateToSave));
  }, [selectedExpert, dreamContent, withImage, accordionValue, guestPhone, guestPassword]);

  const EXPERTS = [
    {
      id: "freud",
      name: "지그문트 프로이트",
      description: "무의식의 억압된 욕망과 감정을 정신분석학적으로 접근합니다.",
      icon: <Brain className="w-8 h-8 text-pink-500" />,
      color: "hover:border-pink-300 hover:bg-pink-50/50",
      activeColor: "border-pink-500 bg-pink-50/50 ring-2 ring-pink-200",
    },
    {
      id: "jung",
      name: "칼 융",
      description: "집단 무의식과 원형(Archetype)을 통해 상징의 의미를 찾습니다.",
      icon: <InfinityIcon className="w-8 h-8 text-purple-500" />,
      color: "hover:border-purple-300 hover:bg-purple-50/50",
      activeColor: "border-purple-500 bg-purple-50/50 ring-2 ring-purple-200",
    },
    {
      id: "neuro",
      name: "신경과학",
      description: "수면 중 뇌의 정보 처리 및 기억 재구성 관점에서 해석합니다.",
      icon: <Network className="w-8 h-8 text-blue-500" />,
      color: "hover:border-blue-300 hover:bg-blue-50/50",
      activeColor: "border-blue-500 bg-blue-50/50 ring-2 ring-blue-200",
    },
    {
      id: "gestalt",
      name: "게슈탈트",
      description: "꿈의 모든 요소를 현재 나의 파편으로 보고 전체적인 통합을 돕습니다.",
      icon: <Sparkles className="w-8 h-8 text-amber-500" />,
      color: "hover:border-amber-300 hover:bg-amber-50/50",
      activeColor: "border-amber-500 bg-amber-50/50 ring-2 ring-amber-200",
    },
  ];

  const calculateTotal = () => {
    let base = 1500;
    if (withImage) base += 500;
    return base;
  };

  const handleExpertSelect = (expertId: string) => {
    setSelectedExpert(expertId);
    if (!accordionValue.includes("step-2")) {
      setAccordionValue((prev) => [...prev, "step-2"]);
      setTimeout(() => {
        document.getElementById("step-2")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    } else {
      document.getElementById("step-2")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleNextToStep3 = () => {
    if (dreamContent.trim().length >= 5 && !accordionValue.includes("step-3")) {
      setAccordionValue((prev) => [...prev, "step-3"]);
      setTimeout(() => {
        document.getElementById("step-3")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    } else {
      document.getElementById("step-3")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const isAllExpanded = accordionValue.length === (isAuthenticated === false ? 4 : 3);
  
  const toggleExpandAll = () => {
    if (isAllExpanded) {
      setAccordionValue([]);
    } else {
      setAccordionValue(isAuthenticated === false ? ["step-1", "step-2", "step-3", "step-4"] : ["step-1", "step-2", "step-3"]);
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^0-9]/g, "");
    let formatted = rawValue;
    
    if (rawValue.length < 4) {
      formatted = rawValue;
    } else if (rawValue.length < 8) {
      formatted = rawValue.replace(/(\d{3})(\d{1,4})/, "$1-$2");
    } else if (rawValue.length === 10) {
      formatted = rawValue.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
    } else {
      formatted = rawValue.replace(/(\d{3})(\d{4})(\d{1,4})/, "$1-$2-$3").slice(0, 13);
    }
    
    setGuestPhone(formatted);
  };

  const isFormValid = selectedExpert && 
                      dreamContent.trim().length >= 5 && 
                      aiServiceConsent && // 필수: AI 생성물 한계 및 저작권 동의
                      (isAuthenticated || (guestPhone.length >= 12 && guestPassword.length >= 4 && guestPrivacyConsent)); // 필수: 비회원 개인정보 동의

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-slate-800 pb-24 selection:bg-purple-200 relative overflow-hidden">
      {/* Background Aurora Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-pink-200/20 blur-[120px] mix-blend-multiply" />
        <div className="absolute bottom-[10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-300/20 blur-[120px] mix-blend-multiply" />
      </div>

      <main className="relative z-10 w-full max-w-3xl mx-auto px-4 pt-10 sm:px-6">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6"
        >
          <Link href="/">
            <Button
              variant="ghost"
              size="sm"
              className="group text-slate-500 hover:text-slate-900 hover:bg-white/50 backdrop-blur-sm rounded-full pl-2 pr-4 transition-all"
            >
              <ArrowLeft className="w-5 h-5 mr-1 group-hover:-translate-x-1 transition-transform" />
              메인으로 돌아가기
            </Button>
          </Link>
        </motion.div>


        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 mb-4">
            어젯밤 꿈,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500">
              어떻게 해석해 드릴까요?
            </span>
          </h1>
          <p className="text-slate-600 text-lg">
            분석을 원하는 관점을 선택하고, 기억나는 대로 꿈 이야기를 들려주세요.
          </p>
        </motion.div>

        {/* Expand All / Collapse All Toggle */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex justify-end mb-4"
        >
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={toggleExpandAll}
            className="text-slate-500 hover:text-slate-900 hover:bg-slate-100/50 rounded-full"
          >
            {isAllExpanded ? (
              <><Minimize2 className="w-4 h-4 mr-2" /> 전체 접기</>
            ) : (
              <><Maximize2 className="w-4 h-4 mr-2" /> 전체 펼치기</>
            )}
          </Button>
        </motion.div>

        {/* Accordion Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-10"
        >
          <Accordion 
            multiple 
            value={accordionValue} 
            onValueChange={setAccordionValue}
            className="w-full space-y-6"
          >
            {/* 1. 전문가 스타일 선택 */}
            <AccordionItem value="step-1" id="step-1" className="border-none bg-white/40 backdrop-blur-sm rounded-3xl px-6 py-2 shadow-sm scroll-mt-24">
              <AccordionTrigger className="hover:no-underline py-4">
                <div className="flex items-center gap-3 text-left">
                  <span className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold transition-colors shrink-0 ${
                    selectedExpert ? 'bg-purple-600 text-white' : 'bg-slate-900 text-white'
                  }`}>
                    1
                  </span>
                  <div className="flex flex-col">
                    <span className="text-xl font-bold text-slate-800">
                      어떤 관점으로 분석할까요?
                    </span>
                    {!accordionValue.includes("step-1") && selectedExpert && (
                      <span className="text-sm font-medium text-purple-600 mt-1">
                        * {EXPERTS.find(e => e.id === selectedExpert)?.name} 선택
                      </span>
                    )}
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4 pb-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {EXPERTS.map((expert) => {
                    const isActive = selectedExpert === expert.id;
                    return (
                      <Card
                        key={expert.id}
                        className={`cursor-pointer transition-all duration-300 border bg-white/70 backdrop-blur-md ${
                          isActive ? expert.activeColor : `border-slate-200 ${expert.color}`
                        }`}
                        onClick={() => handleExpertSelect(expert.id)}
                      >
                        <CardContent className="p-5 flex flex-col items-start gap-3">
                          <div className="flex items-center justify-between w-full">
                            {expert.icon}
                            {isActive && (
                              <div className="w-3 h-3 rounded-full bg-current text-inherit animate-pulse" />
                            )}
                          </div>
                          <div>
                            <h3 className="font-bold text-lg text-slate-900">{expert.name}</h3>
                            <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                              {expert.description}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* 2. 꿈 입력란 */}
            <AccordionItem id="step-2" value="step-2" className="border-none bg-white/40 backdrop-blur-sm rounded-3xl px-6 py-2 shadow-sm scroll-mt-24">
              <AccordionTrigger className="hover:no-underline py-4">
                <div className="flex items-center gap-3 text-left">
                  <span className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold transition-colors shrink-0 ${
                    dreamContent.trim().length > 5 ? 'bg-purple-600 text-white' : 'bg-slate-900 text-white'
                  }`}>
                    2
                  </span>
                  <div className="flex flex-col">
                    <span className="text-xl font-bold text-slate-800">
                      꿈의 내용을 적어주세요
                    </span>
                    {!accordionValue.includes("step-2") && dreamContent.trim().length > 0 && (
                      <span className="text-sm font-medium text-purple-600 mt-1">
                        * 작성 완료({dreamContent.trim().length}자)
                      </span>
                    )}
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4 pb-6">
                <div className="relative group">
                  <Textarea
                    placeholder="누구와 있었나요? 어떤 감정을 느꼈나요? 기억나는 파편적인 조각들이라도 좋습니다."
                    className="min-h-[200px] resize-y bg-white/70 backdrop-blur-md border-slate-200 focus-visible:ring-purple-400 text-base p-5 rounded-2xl shadow-sm transition-all group-hover:shadow-md"
                    value={dreamContent}
                    maxLength={1000}
                    onChange={(e) => setDreamContent(e.target.value)}
                  />
                  {/* 글자수 카운터: 900자 이상 시 경고색 표시 */}
                  <div className={`absolute bottom-4 right-4 text-xs transition-colors ${
                    dreamContent.length >= 1000
                      ? "text-red-500 font-semibold"
                      : dreamContent.length >= 900
                        ? "text-amber-500"
                        : "text-slate-400"
                  }`}>
                    {dreamContent.length} / 1000자
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2 mt-4">
                  {dreamContent.length > 0 && dreamContent.trim().length < 5 && (
                    <span className="text-xs text-amber-500 font-medium px-2 animate-in fade-in slide-in-from-bottom-1">
                      정확한 해몽을 위해 최소 5자 이상 입력해주세요.
                    </span>
                  )}
                  <Button
                    variant="outline"
                    className="rounded-full px-6 border-slate-200 hover:bg-slate-50 shadow-sm transition-all"
                    onClick={handleNextToStep3}
                    disabled={dreamContent.trim().length < 5}
                  >
                    다음 단계로 넘어가기 <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* 3. 옵션 선택 */}
            <AccordionItem id="step-3" value="step-3" className="border-none bg-white/40 backdrop-blur-sm rounded-3xl px-6 py-2 shadow-sm scroll-mt-24">
              <AccordionTrigger className="hover:no-underline py-4">
                <div className="flex items-center gap-3 text-left">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-900 text-white text-sm font-bold">
                    3
                  </span>
                  <span className="text-xl font-bold text-slate-800">
                    결제 옵션 선택
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4 pb-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-2xl bg-gradient-to-r from-pink-50 to-purple-50 border border-purple-100 shadow-sm">
                  <div className="flex items-center gap-4 mb-4 sm:mb-0">
                    <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm">
                      <ImageIcon className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 flex items-center gap-2">
                        꿈의 한 장면을 이미지로 그려드릴까요?
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-pink-100 text-pink-600">추천</span>
                      </h3>
                      <p className="text-sm text-slate-500 mt-1">
                        AI가 텍스트 분석 결과와 어울리는 예술적인 이미지를 1장 생성합니다.<br className="hidden sm:block" />
                        <span className="inline-block mt-0.5 sm:mt-1">(+500원)</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center sm:justify-end">
                    <label className="flex items-center gap-2 cursor-pointer bg-white px-4 py-2 rounded-xl border border-purple-200 shadow-sm hover:bg-purple-50 transition-colors">
                      <Checkbox 
                        checked={withImage}
                        onCheckedChange={(checked) => setWithImage(checked === true)}
                        className="data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                      />
                      <span className="font-medium text-slate-700 select-none whitespace-nowrap">추가할게요</span>
                    </label>
                  </div>
                </div>
                {isAuthenticated === false && (
                  <div className="flex justify-end mt-4">
                    <Button
                      variant="outline"
                      className="rounded-full px-6 border-slate-200 hover:bg-slate-50 shadow-sm"
                      onClick={() => {
                        if (!accordionValue.includes("step-4")) {
                          setAccordionValue((prev) => [...prev, "step-4"]);
                        }
                        setTimeout(() => {
                          document.getElementById("step-4")?.scrollIntoView({ behavior: "smooth", block: "start" });
                        }, 100);
                      }}
                    >
                      다음 단계로 넘어가기 <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>

            {/* 4. 비회원 정보 입력 (결제 조회용) */}
            {isAuthenticated === false && (
              <AccordionItem id="step-4" value="step-4" className="border-none bg-white/40 backdrop-blur-sm rounded-3xl px-6 py-2 shadow-sm scroll-mt-24">
                <AccordionTrigger className="hover:no-underline py-4">
                  <div className="flex items-center gap-3 text-left">
                    <span className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold transition-colors shrink-0 ${
                      guestPhone.length >= 12 && guestPassword.length >= 4 ? 'bg-purple-600 text-white' : 'bg-slate-900 text-white'
                    }`}>
                      4
                    </span>
                    <div className="flex flex-col">
                      <span className="text-xl font-bold text-slate-800">
                        비회원 정보 입력 (결제 조회용)
                      </span>
                      {!accordionValue.includes("step-4") && guestPhone.length > 0 && (
                        <span className="text-sm font-medium text-purple-600 mt-1">
                          * 입력 완료
                        </span>
                      )}
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-4 pb-6">
                  <div className="p-5 rounded-2xl bg-white/70 border border-slate-200/60 shadow-sm space-y-4">
                    <p className="text-sm text-slate-500 mb-2">
                      결제 후 해몽 결과를 확인하기 위해 사용할 전화번호와 비밀번호를 입력해주세요.
                    </p>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="guestPhone" className="text-slate-600 font-medium">전화번호</Label>
                        <Input
                          id="guestPhone"
                          type="tel"
                          placeholder="010-0000-0000"
                          value={guestPhone}
                          onChange={handlePhoneChange}
                          maxLength={13}
                          className="h-12 bg-white/80 focus:border-purple-400 focus:ring-purple-400/20"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="guestPassword" className="text-slate-600 font-medium">비밀번호 (4자리 이상)</Label>
                        <Input
                          id="guestPassword"
                          type="password"
                          placeholder="비밀번호 입력"
                          value={guestPassword}
                          onChange={(e) => setGuestPassword(e.target.value)}
                          className="h-12 bg-white/80 focus:border-purple-400 focus:ring-purple-400/20"
                        />
                      </div>

                      {/* 대한민국 개인정보보호법 준수: 비회원 개인정보 최소 수집 동의 */}
                      <div className="pt-4 border-t border-slate-100 flex items-start gap-3">
                        <Checkbox
                          id="guest-privacy-consent"
                          checked={guestPrivacyConsent}
                          onCheckedChange={(checked) => setGuestPrivacyConsent(checked === true)}
                          className="mt-1 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                        />
                        <div className="grid gap-1.5 leading-none">
                          <label
                            htmlFor="guest-privacy-consent"
                            className="text-xs font-bold text-slate-700 leading-normal cursor-pointer select-none"
                          >
                            [필수] 비회원 개인정보 수집 및 이용 동의
                          </label>
                          <p className="text-[10px] text-slate-500 leading-normal">
                            * 수집 항목: 전화번호, 조회 비밀번호<br />
                            * 수집 목적: 비회원 주문 식별, 결제 거래 원장 매핑 및 의뢰 결과 조회 서비스 제공<br />
                            * <strong>보유 기간: 전자상거래법에 의거 5년 보존 후 지체 없이 영구 파기</strong>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}
          </Accordion>
        </motion.div>

        {/* 4. 주의 사항 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-10"
        >
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/60">
            <h4 className="flex items-center gap-2 font-semibold text-slate-700 mb-3">
              <Info className="w-4 h-4" />
              안내 및 주의사항
            </h4>
            <ul className="text-sm text-slate-500 space-y-2 list-disc list-inside">
              <li>보통 3분 이내에 생성이 완료됩니다.</li>
              <li>꿈 해석은 AI를 통해 정신분석, 신화, 상징학 데이터를 기반으로 생성됩니다.</li>
              <li>이 해석은 자기 이해를 돕기 위한 참고 자료이며, 의학적/심리학적 진단을 대체하지 않습니다.</li>
            </ul>
          </div>
        </motion.section>

        {/* 5. 제출 및 결제 앵커링 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="sticky bottom-6 z-20 space-y-3"
        >
          {/* 대한민국 표시광고법 및 콘텐츠산업진흥법 준수: AI 서비스 한계 및 저작권 필수 동의 */}
          <div className="mx-auto max-w-xl bg-white/90 backdrop-blur-md border border-purple-100 shadow-lg rounded-2xl p-4 flex items-start gap-3">
            <Checkbox
              id="ai-service-consent"
              checked={aiServiceConsent}
              onCheckedChange={(checked) => setAiServiceConsent(checked === true)}
              className="mt-0.5 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600 shrink-0"
            />
            <div className="grid gap-1">
              <label
                htmlFor="ai-service-consent"
                className="text-xs font-bold text-slate-800 leading-normal cursor-pointer select-none"
              >
                [필수] AI 분석 한계 고지 및 저작권 귀속 동의
              </label>
              <p className="text-[10px] text-slate-500 leading-relaxed">
                생성형 AI 모델(Gemini, Imagen)이 출력하는 해몽 분석과 이미지는 <strong>비과학적 신비학 및 상징을 토대로 한 주관적인 결과물로 환각(Hallucination) 등의 기술적 오류</strong>가 존재할 수 있습니다. 또한, AI 생성 저작물 특성상 <strong>저작권 귀속 및 비독점적 상업 사용 권리 한계</strong>가 서비스 이용약관 조항에 따름에 동의합니다.
              </p>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-xl border border-slate-200 shadow-xl rounded-full p-2 flex items-center justify-between pl-6 transition-all">
            <div className="flex flex-col">
              <span className="text-xs text-slate-500 font-medium">총 결제 금액</span>
              <span className="text-xl font-bold text-slate-900">
                {calculateTotal().toLocaleString()}원
              </span>
            </div>
            <Button
              size="lg"
              className="rounded-full bg-purple-600 text-white hover:bg-purple-700 h-14 px-8 text-base font-semibold shadow-md transition-transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
              disabled={!isFormValid}
              onClick={() => {
                // TODO: 입력한 데이터(전문가, 꿈내용 등)를 상태관리나 세션스토리지 등에 저장 후 결제 페이지로 넘겨야 함
                router.push(`/payments?amount=${calculateTotal()}`);
              }}
            >
              꿈 풀이 요청하기
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </motion.section>

      </main>
    </div>
  );
}
