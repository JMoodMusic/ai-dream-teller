"use client";

import { useState } from "react";
import { HelpCircle, Mail, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function ContactPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLoading) return;

    setIsLoading(true);

    // 가상의 폼 전송 대기 시간 (1.5초)
    await new Promise((resolve) => setTimeout(resolve, 1500));

    alert("문의가 접수되었습니다. 영업일 기준 1~2일 내에 답변드리겠습니다.");
    
    // 폼 초기화
    (e.target as HTMLFormElement).reset();
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-slate-800 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
        
        {/* 왼쪽: FAQ 및 직접 문의 안내 */}
        <div className="flex flex-col gap-10">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <HelpCircle className="w-8 h-8 text-purple-600" />
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">자주 묻는 질문</h1>
            </div>
            
            <Accordion className="w-full">
              <AccordionItem value="item-1" className="border-b-slate-200">
                <AccordionTrigger className="text-base sm:text-lg font-medium text-slate-800 hover:text-purple-600 hover:no-underline text-left">
                  AI 꿈 분석은 얼마나 걸리나요?
                </AccordionTrigger>
                <AccordionContent className="text-slate-600 leading-relaxed text-sm sm:text-base">
                  꿈의 길이나 복잡도에 따라 다르지만, 일반적으로 결제 후 1분에서 3분 이내에 심층적인 분석 결과가 제공됩니다.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-2" className="border-b-slate-200">
                <AccordionTrigger className="text-base sm:text-lg font-medium text-slate-800 hover:text-purple-600 hover:no-underline text-left">
                  결제 후 환불이 가능한가요?
                </AccordionTrigger>
                <AccordionContent className="text-slate-600 leading-relaxed text-sm sm:text-base">
                  AI 서비스 특성상 분석이 시작된 이후에는 환불이 불가능합니다. 다만, 시스템 오류로 인해 결과물이 생성되지 않은 경우에는 100% 환불해 드립니다.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-3" className="border-b-slate-200">
                <AccordionTrigger className="text-base sm:text-lg font-medium text-slate-800 hover:text-purple-600 hover:no-underline text-left">
                  회원과 비회원의 차이가 무엇인가요?
                </AccordionTrigger>
                <AccordionContent className="text-slate-600 leading-relaxed text-sm sm:text-base">
                  회원가입 시 분석된 꿈 결과가 개인 캘린더에 영구적으로 보존되며, 추후 다양한 프로모션 및 기능(예: 무의식 패턴 분석 등)의 혜택을 받으실 수 있습니다.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-4" className="border-b-slate-200">
                <AccordionTrigger className="text-base sm:text-lg font-medium text-slate-800 hover:text-purple-600 hover:no-underline text-left">
                  분석 결과가 마음에 들지 않으면 어떻게 하나요?
                </AccordionTrigger>
                <AccordionContent className="text-slate-600 leading-relaxed text-sm sm:text-base">
                  AI의 해석은 심리학과 신경과학 데이터를 기반으로 한 참고용 자료입니다. 본인의 상황에 맞춰 의미를 재해석해보시는 것을 권장해 드립니다.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          <div className="bg-white/60 backdrop-blur-sm border border-slate-200/60 rounded-3xl p-8 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-3">직접 문의하기</h2>
            <p className="text-slate-600 mb-6 text-sm sm:text-base leading-relaxed break-keep">
              답변은 영업일 기준 1~2일 내에 기재하신 이메일로 발송됩니다. 
              직접 메일 발송을 원하시면 아래 주소를 이용해 주세요.
            </p>
            <div className="flex items-center gap-2 text-purple-600 font-medium bg-purple-50 px-4 py-3 rounded-xl w-fit">
              <Mail className="w-5 h-5" />
              <a href="mailto:support@aidreamteller.com" className="hover:underline">
                support@aidreamteller.com
              </a>
            </div>
          </div>
        </div>

        {/* 오른쪽: 문의하기 폼 */}
        <div className="bg-white/60 backdrop-blur-sm border border-slate-200/60 rounded-3xl p-8 sm:p-10 shadow-sm flex flex-col justify-between h-full">
          <form onSubmit={handleFormSubmit} className="flex flex-col gap-6 h-full">
            <div className="space-y-2">
              <label htmlFor="subject" className="text-sm font-semibold text-slate-700">
                문의 제목
              </label>
              <Input 
                id="subject"
                placeholder="제목을 입력하세요" 
                required 
                className="bg-white/80 border-slate-200 focus-visible:ring-purple-500 rounded-xl h-12"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-semibold text-slate-700">
                회신 받을 이메일
              </label>
              <Input 
                id="email"
                type="email" 
                placeholder="example@email.com" 
                required 
                className="bg-white/80 border-slate-200 focus-visible:ring-purple-500 rounded-xl h-12"
              />
            </div>

            <div className="space-y-2 flex-1 flex flex-col">
              <label htmlFor="message" className="text-sm font-semibold text-slate-700">
                문의 내용
              </label>
              <Textarea 
                id="message"
                placeholder="궁금하신 내용을 자세히 적어주세요." 
                required 
                className="bg-white/80 border-slate-200 focus-visible:ring-purple-500 rounded-xl min-h-[200px] flex-1 resize-none"
              />
            </div>

            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-[#3B12D0] hover:bg-[#2c0da0] text-white h-14 rounded-xl font-bold text-lg mt-4 shadow-md transition-all hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  전송 중...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5 mr-2" />
                  문의 보내기
                </>
              )}
            </Button>
          </form>
        </div>
        
      </div>
    </div>
  );
}
