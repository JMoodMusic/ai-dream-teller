"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sparkles, Brain, Image as ImageIcon, BookOpen, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col w-full bg-[#FDFBF7] text-slate-800 overflow-hidden selection:bg-purple-200">
      {/* Background Aurora Effects (Light version) */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-300/30 blur-[120px] mix-blend-multiply" />
        <div className="absolute top-[20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-200/40 blur-[120px] mix-blend-multiply" />
        <div className="absolute bottom-[-10%] left-[20%] w-[60%] h-[60%] rounded-full bg-pink-200/30 blur-[150px] mix-blend-multiply" />
      </div>

      <main className="flex-1 relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-32 flex flex-col gap-32">
        
        {/* Hero Section */}
        <section className="flex flex-col items-center justify-center text-center pt-16 md:pt-24 pb-12 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/60 border border-purple-100 shadow-sm text-sm font-medium text-purple-700 mb-4"
          >
            <Sparkles className="w-4 h-4" />
            <span>AI 기반 심층 꿈 해몽 서비스</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-slate-900 leading-tight"
          >
            당신의 꿈 속에 숨겨진 <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500">
              무의식의 메시지
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="text-lg sm:text-xl text-slate-600 max-w-2xl leading-relaxed"
          >
            프로이트, 칼 융, 신경과학 등 다양한 관점에서 당신의 꿈을 분석하고, 
            텍스트뿐만 아니라 몽환적인 AI 이미지로 꿈을 생생하게 기록하세요.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
            className="flex items-center gap-4 mt-4"
          >
            <Link href="/dream-teller">
              <Button size="lg" className="rounded-full bg-purple-600 text-white hover:bg-purple-700 h-14 px-8 text-base font-semibold shadow-lg transition-all hover:shadow-xl hover:scale-105">
                꿈 해몽 시작하기
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </section>

        {/* Bento Grid Features Section */}
        <section className="flex flex-col gap-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">다양한 차원의 분석</h2>
            <p className="text-slate-600">단순한 해몽을 넘어선 심층적 경험을 제공합니다.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto w-full">
            {/* Bento Item 1 - Large */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="md:col-span-2 relative overflow-hidden rounded-3xl bg-white/60 border border-slate-200/60 shadow-sm p-8 flex flex-col justify-end min-h-[300px] group hover:bg-white/80 transition-colors backdrop-blur-sm"
            >
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                <Brain className="w-32 h-32 text-purple-600" />
              </div>
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-6">
                  <Brain className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold mb-2 text-slate-900">전문적인 심리학 기반 분석</h3>
                <p className="text-slate-600 max-w-md">프로이트의 정신분석학, 칼 융의 분석심리학 등 원하는 관점을 선택하여 깊이 있는 해석을 받아보세요.</p>
              </div>
            </motion.div>

            {/* Bento Item 2 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="relative overflow-hidden rounded-3xl bg-white/60 border border-slate-200/60 shadow-sm p-8 flex flex-col justify-end min-h-[300px] group hover:bg-white/80 transition-colors backdrop-blur-sm"
            >
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center mb-6">
                  <ImageIcon className="w-6 h-6 text-pink-600" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-slate-900">AI 꿈 이미지 생성</h3>
                <p className="text-slate-600 text-sm">텍스트를 넘어 당신의 꿈을 몽환적인 이미지로 시각화해 드립니다.</p>
              </div>
            </motion.div>

            {/* Bento Item 3 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative overflow-hidden rounded-3xl bg-white/60 border border-slate-200/60 shadow-sm p-8 flex flex-col justify-end min-h-[300px] group hover:bg-white/80 transition-colors backdrop-blur-sm"
            >
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-6">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-slate-900">꿈 기록 아카이빙</h3>
                <p className="text-slate-600 text-sm">달력을 통해 과거의 꿈들을 한눈에 모아보고 패턴을 발견하세요.</p>
              </div>
            </motion.div>

            {/* Bento Item 4 - Large */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="md:col-span-2 relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-100 to-blue-100 border border-purple-200 p-8 flex flex-col justify-center items-center text-center min-h-[300px]"
            >
              <h3 className="text-2xl font-bold mb-4 text-slate-900">지금 바로 당신의 꿈을 이야기해주세요</h3>
              <Link href="/dream-teller">
                <Button variant="outline" className="rounded-full bg-white border-purple-200 hover:bg-purple-50 text-purple-700 transition-colors shadow-sm">
                  해몽 시작하기 <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Example Feeds Section */}
        <section className="flex flex-col gap-8 mb-10">
          <div className="flex items-end justify-between border-b border-slate-200 pb-4">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-2">다른 사람들의 꿈 이야기</h2>
              <p className="text-slate-600 text-sm">최근 해석된 흥미로운 꿈들을 둘러보세요.</p>
            </div>
            <Link href="/feeds" className="text-sm text-purple-600 hover:text-purple-500 font-medium flex items-center gap-1">
              더보기 <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Dummy Feed Items */}
            {[
              { id: 1, title: "하늘을 나는 고래", desc: "구름 위를 헤엄치는 거대한 고래를 탔습니다.", color: "from-blue-200" },
              { id: 2, title: "끝없는 미로", desc: "거울로 이루어진 방에서 길을 잃었어요.", color: "from-purple-200" },
              { id: 3, title: "빛나는 숲", desc: "모든 나무가 형광빛으로 빛나는 숲을 걸었습니다.", color: "from-pink-200" },
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
                  <h4 className="font-semibold text-lg mb-1 group-hover:text-purple-700 transition-colors text-slate-900">{feed.title}</h4>
                  <p className="text-slate-600 text-sm line-clamp-2">{feed.desc}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

      </main>
    </div>
  );
}
