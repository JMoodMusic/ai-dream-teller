"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Filter, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FeedCard } from "@/components/feeds/feed-card";
import { DUMMY_FEEDS } from "@/lib/data/dummy-feeds";
import type { ExpertStyle } from "@/lib/types/feed";
import { EXPERT_STYLE_META } from "@/lib/types/feed";

/**
 * 피드 페이지 클라이언트 컴포넌트
 * - 페이스북 형태의 피드 레이아웃
 * - 전문가 스타일별 필터링 기능
 * - 이미지가 있는 해몽 결과는 이미지와 텍스트 함께 노출
 * - 텍스트만 있는 해몽 결과는 텍스트만 노출
 */
const FeedsClient = () => {
  const [selectedStyle, setSelectedStyle] = useState<ExpertStyle | "전체">("전체");

  /** 필터링된 피드 목록 */
  const filteredFeeds = useMemo(() => {
    if (selectedStyle === "전체") return DUMMY_FEEDS;
    return DUMMY_FEEDS.filter((feed) => feed.expertStyle === selectedStyle);
  }, [selectedStyle]);

  /** 전문가 스타일 필터 옵션 */
  const filterOptions: (ExpertStyle | "전체")[] = [
    "전체",
    "프로이트",
    "칼 융",
    "신경과학",
    "게슈탈트",
  ];

  return (
    <div className="flex flex-col w-full bg-[#FDFBF7] text-slate-800 min-h-screen selection:bg-purple-200">
      {/* ─── 배경 Aurora Effects ─── */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[35%] h-[35%] rounded-full bg-purple-300/20 blur-[120px] mix-blend-multiply" />
        <div className="absolute top-[30%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-200/30 blur-[120px] mix-blend-multiply" />
        <div className="absolute bottom-[-10%] left-[20%] w-[50%] h-[50%] rounded-full bg-pink-200/20 blur-[150px] mix-blend-multiply" />
      </div>

      <div className="relative z-10 w-full max-w-2xl mx-auto px-4 sm:px-6 pt-8 pb-20">
        {/* ─── 페이지 헤더 ─── */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-purple-600 transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            메인으로 돌아가기
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center shadow-md">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                  꿈 해몽 피드
                </h1>
                <p className="text-sm text-slate-500 mt-0.5">
                  다른 사람들의 꿈 이야기와 AI 해석을 둘러보세요
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ─── 필터 바 ─── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mb-6"
        >
          <div className="flex items-center gap-2 mb-3">
            <Filter className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              해몽 스타일
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {filterOptions.map((style) => {
              const isActive = selectedStyle === style;
              const meta =
                style === "전체"
                  ? null
                  : EXPERT_STYLE_META[style as ExpertStyle];

              return (
                <Button
                  key={style}
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedStyle(style)}
                  className={`rounded-full text-xs font-medium transition-all border ${
                    isActive
                      ? "bg-purple-600 text-white border-purple-600 hover:bg-purple-700 shadow-sm"
                      : "bg-white/70 text-slate-600 border-slate-200 hover:border-purple-300 hover:text-purple-600 hover:bg-purple-50"
                  }`}
                >
                  {meta && <span className="mr-1">{meta.icon}</span>}
                  {style}
                </Button>
              );
            })}
          </div>
        </motion.div>

        {/* ─── 피드 통계 ─── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="flex items-center justify-between mb-6 px-1"
        >
          <span className="text-sm text-slate-400">
            총 <span className="font-semibold text-slate-600">{filteredFeeds.length}</span>개의 해몽
          </span>
          <span className="text-xs text-slate-400">최신순</span>
        </motion.div>

        {/* ─── 피드 리스트 ─── */}
        <div className="flex flex-col gap-5">
          {filteredFeeds.map((feed, index) => (
            <FeedCard key={feed.id} feed={feed} index={index} />
          ))}
        </div>

        {/* ─── 피드 하단 CTA ─── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-12 text-center"
        >
          <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 rounded-2xl border border-purple-100/60 p-8">
            <Sparkles className="w-8 h-8 text-purple-400 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-800 mb-2">
              나도 꿈을 해석받고 싶다면?
            </h3>
            <p className="text-sm text-slate-500 mb-5">
              AI가 당신의 꿈 속 숨겨진 메시지를 분석해 드립니다
            </p>
            <Link href="/dream-teller">
              <Button className="rounded-full bg-purple-600 text-white hover:bg-purple-700 px-8 h-12 text-sm font-semibold shadow-md hover:shadow-lg transition-all">
                지금 내 꿈 해석받기 →
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export { FeedsClient };
