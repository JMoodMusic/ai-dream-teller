"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sparkles, Brain, Image as ImageIcon, BookOpen, Zap, ArrowRight } from "lucide-react";

/**
 * 메인 랜딩 페이지
 * - 전환율 최적화된 카피라이팅 적용 (PRD 기반)
 * - 유저 유입 → 결제 전환 퍼널: 공감 → 신뢰 → 가치 → 행동 → 소셜프루프
 */
export default function Home() {
  return (
    <div className="flex flex-col w-full bg-[#FDFBF7] text-slate-800 overflow-hidden selection:bg-purple-200">
      {/* Background Aurora Effects - 몽환적인 분위기 연출 */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-300/30 blur-[120px] mix-blend-multiply" />
        <div className="absolute top-[20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-200/40 blur-[120px] mix-blend-multiply" />
        <div className="absolute bottom-[-10%] left-[20%] w-[60%] h-[60%] rounded-full bg-pink-200/30 blur-[150px] mix-blend-multiply" />
      </div>

      <main className="flex-1 relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-32 flex flex-col gap-32">

        {/* ─── Hero Section ─── */}
        {/* 유저가 방문하는 순간(꿈을 꾼 직후)의 상황에 즉각 공감 → 이탈율 감소 */}
        <section className="flex flex-col items-center justify-center text-center pt-16 md:pt-24 pb-12 gap-8">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/60 border border-purple-100 shadow-sm text-sm font-medium text-purple-700 mb-4"
          >
            <Sparkles className="w-4 h-4" />
            <span>AI 기반 심층 꿈 해몽 서비스</span>
          </motion.div>

          {/* Headline - 구체적 상황 묘사로 즉각 공감 유도 */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-slate-900 leading-tight"
          >
            오늘 새벽 꿈,{" "}
            <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500">
              아직도 기억나세요?
            </span>
          </motion.h1>

          {/* Sub Copy - 과학적 권위 + 가격 앵커링 + 속도(3분) */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="text-lg sm:text-xl text-slate-600 max-w-2xl leading-relaxed"
          >
            프로이트의 정신분석, 칼 융의 원형 이론, 최신 신경과학 연구를 학습한 AI가
            꿈 속 상징과 감정을 분석합니다.
            <br />
            <span className="font-semibold text-slate-700">
              단 3분, 커피 한 잔 값으로 어젯밤 꿈의 진짜 의미를 알아보세요.
            </span>
          </motion.p>

          {/* CTA - 1인칭 소유격("내")으로 개인화 + 수동형("받기")으로 낮은 심리적 마찰 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
            className="flex items-center gap-4 mt-4"
          >
            <Link href="/dream-teller">
              <Button
                size="lg"
                className="rounded-full bg-purple-600 text-white hover:bg-purple-700 h-14 px-8 text-base font-semibold shadow-lg transition-all hover:shadow-xl hover:scale-105"
              >
                지금 내 꿈 해석받기
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </motion.div>

          {/* 가격 앵커 텍스트 - 불안 해소 */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="text-sm text-slate-400"
          >
            텍스트 해석 1,500원 · AI 이미지 포함 2,000원 · 3분 이내 결과 제공
          </motion.p>
        </section>

        {/* ─── Bento Grid Features Section ─── */}
        {/* 4가지 카드로 구체적 가치 제안 → 구매 전 납득 유도 */}
        <section className="flex flex-col gap-8">
          <div className="text-center mb-4">
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-3xl font-bold text-slate-900 mb-3"
            >
              꿈 해몽, 이제 이렇게 달라집니다
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-slate-500"
            >
              단순한 해몽을 넘어선 심층적 경험을 제공합니다.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto w-full">

            {/* 카드 1 (대형) - 핵심 USP: 3가지 학파 통합 분석 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="md:col-span-2 relative overflow-hidden rounded-3xl bg-white/60 border border-slate-200/60 shadow-sm p-8 flex flex-col justify-end min-h-[300px] group hover:bg-white/80 transition-colors backdrop-blur-sm"
            >
              {/* 배경 아이콘 */}
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                <Brain className="w-32 h-32 text-purple-600" />
              </div>
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-6">
                  <Brain className="w-6 h-6 text-purple-600" />
                </div>
                {/* 뱃지 */}
                <span className="inline-block text-xs font-semibold text-purple-600 bg-purple-50 border border-purple-100 rounded-full px-2.5 py-1 mb-3">
                  핵심 기능
                </span>
                <h3 className="text-2xl font-bold mb-2 text-slate-900">
                  3가지 시각으로 읽는 당신의 꿈
                </h3>
                <p className="text-slate-600 max-w-md">
                  프로이트 정신분석·칼 융의 원형 이론·현대 신경과학 데이터를 통합하여,
                  꿈 속 상징과 감정이 내포한 의미를 다층적으로 풀어냅니다.
                </p>
              </div>
            </motion.div>

            {/* 카드 2 - 속도/편의: 낮은 진입 장벽 강조 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="relative overflow-hidden rounded-3xl bg-white/60 border border-slate-200/60 shadow-sm p-8 flex flex-col justify-end min-h-[300px] group hover:bg-white/80 transition-colors backdrop-blur-sm"
            >
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mb-6">
                  <Zap className="w-6 h-6 text-amber-500" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-slate-900">
                  입력하고 3분이면 끝
                </h3>
                <p className="text-slate-600 text-sm">
                  꿈 내용을 자유롭게 적으면 AI가 상징·감정·패턴을 즉시 분석합니다.
                  복잡한 절차는 없습니다.
                </p>
              </div>
            </motion.div>

            {/* 카드 3 - AI 이미지: 업셀 자연스럽게 노출 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative overflow-hidden rounded-3xl bg-white/60 border border-slate-200/60 shadow-sm p-8 flex flex-col justify-end min-h-[300px] group hover:bg-white/80 transition-colors backdrop-blur-sm"
            >
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center mb-6">
                  <ImageIcon className="w-6 h-6 text-pink-500" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-slate-900">
                  꿈속 장면, 눈으로 확인하세요
                </h3>
                <p className="text-slate-600 text-sm">
                  텍스트 해석에 AI 생성 이미지를 더하면, 꿈의 감성을 시각적으로
                  간직할 수 있습니다.
                </p>
                {/* 업셀 가격 뱃지 */}
                <span className="inline-block mt-3 text-xs font-semibold text-pink-600 bg-pink-50 border border-pink-100 rounded-full px-2.5 py-1">
                  + 500원 옵션
                </span>
              </div>
            </motion.div>

            {/* 카드 4 - 아카이브: 재방문·재구매 유도 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="relative overflow-hidden rounded-3xl bg-white/60 border border-slate-200/60 shadow-sm p-8 flex flex-col justify-end min-h-[300px] group hover:bg-white/80 transition-colors backdrop-blur-sm"
            >
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-6">
                  <BookOpen className="w-6 h-6 text-blue-500" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-slate-900">
                  꿈 기록이 곧 나의 심리 일기
                </h3>
                <p className="text-slate-600 text-sm">
                  해석된 꿈들이 자동으로 저장되어, 시간이 지날수록 내 무의식의
                  패턴을 발견할 수 있습니다.
                </p>
              </div>
            </motion.div>

            {/* 인라인 CTA 카드 - Bento 섹션 내 재차 행동 유도 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.35 }}
              className="md:col-span-1 relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 border border-purple-200 p-8 flex flex-col justify-center items-center text-center min-h-[240px]"
            >
              <Sparkles className="w-8 h-8 text-purple-400 mb-4" />
              <h3 className="text-lg font-bold mb-3 text-slate-800">
                지금 바로 해석받기
              </h3>
              <Link href="/dream-teller">
                <Button
                  variant="outline"
                  className="rounded-full bg-white border-purple-200 hover:bg-purple-50 text-purple-700 transition-colors shadow-sm"
                >
                  시작하기 <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* ─── Social Proof / Feed Section ─── */}
        {/* 다른 유저의 실제 해석을 보여줌으로써 신뢰도 및 구매 전환율 제고 */}
        <section className="flex flex-col gap-8 mb-10">
          <div className="flex items-end justify-between border-b border-slate-200 pb-4">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-2">
                다른 사람들의 꿈 이야기
              </h2>
              <p className="text-slate-500 text-sm">
                AI가 해석한 실제 꿈들을 살펴보고, 내 꿈도 분석받아보세요.
              </p>
            </div>
            <Link
              href="/feeds"
              className="text-sm text-purple-600 hover:text-purple-500 font-medium flex items-center gap-1 shrink-0"
            >
              더보기 <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { id: 1, title: "하늘을 나는 고래", desc: "구름 위를 헤엄치는 거대한 고래를 탔습니다. 칼 융의 분석으로 내면의 자유를 향한 갈망이 드러났어요.", color: "from-blue-200" },
              { id: 2, title: "끝없는 미로", desc: "거울로 이루어진 방에서 길을 잃었어요. 프로이트 분석 결과 현실에서의 선택 압박이 반영된 꿈이었습니다.", color: "from-purple-200" },
              { id: 3, title: "빛나는 숲", desc: "모든 나무가 형광빛으로 빛나는 숲을 걸었습니다. 신경과학적 관점에서 창의적 에너지 상승 신호라고 하네요.", color: "from-pink-200" },
            ].map((feed, idx) => (
              <motion.div
                key={feed.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <Link href={`/dream-result/${feed.id}`} className="group block cursor-pointer">
                  <div className={`w-full aspect-[4/3] rounded-2xl bg-gradient-to-br ${feed.color} to-slate-100 border border-slate-200 mb-4 flex items-center justify-center overflow-hidden relative transition-all group-hover:border-purple-300 shadow-sm group-hover:shadow-md`}>
                    <div className="absolute inset-0 bg-white/10 group-hover:bg-transparent transition-colors duration-500" />
                    <ImageIcon className="w-12 h-12 text-slate-400 group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <h4 className="font-semibold text-lg mb-1 group-hover:text-purple-700 transition-colors text-slate-900">
                    {feed.title}
                  </h4>
                  <p className="text-slate-500 text-sm line-clamp-2">{feed.desc}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

      </main>
    </div>
  );
}
