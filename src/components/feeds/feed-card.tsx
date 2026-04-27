"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Sparkles, ExternalLink } from "lucide-react";
import type { FeedItem } from "@/lib/types/feed";
import { EXPERT_STYLE_META } from "@/lib/types/feed";

interface FeedCardProps {
  feed: FeedItem;
  /** 애니메이션 지연 인덱스 */
  index: number;
}

/**
 * 피드 카드 컴포넌트
 * - 페이스북 스타일의 소셜 피드 카드
 * - 이미지가 있는 경우 이미지와 텍스트 함께 노출
 * - 이미지가 없는 경우 텍스트만 노출 (그라데이션 배경으로 시각적 보완)
 */
const FeedCard = ({ feed, index }: FeedCardProps) => {
  const styleMeta = EXPERT_STYLE_META[feed.expertStyle];

  /**
   * 상대 시간 포맷 (예: "3일 전", "2시간 전")
   */
  const formatRelativeTime = (date: Date): string => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) return `${minutes}분 전`;
    if (hours < 24) return `${hours}시간 전`;
    if (days < 7) return `${days}일 전`;
    return date.toLocaleDateString("ko-KR", {
      month: "long",
      day: "numeric",
    });
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.06, ease: "easeOut" }}
      className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden"
    >
      {/* ─── 카드 헤더: 프로필 영역 ─── */}
      <div className="flex items-center gap-3 px-5 pt-5 pb-3">
        {/* 아바타 */}
        <div className="relative w-11 h-11 rounded-full overflow-hidden ring-2 ring-purple-100 shrink-0">
          <Image
            src={feed.user.avatarUrl}
            alt={`${feed.user.nickname}의 프로필 이미지`}
            fill
            className="object-cover"
            sizes="44px"
            unoptimized
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-900 text-sm truncate">
              {feed.user.nickname}
            </span>
            {/* 전문가 스타일 뱃지 */}
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${styleMeta.bgColor} ${styleMeta.color} ${styleMeta.borderColor} border`}
            >
              <span>{styleMeta.icon}</span>
              {feed.expertStyle}
            </span>
          </div>
          <span className="text-xs text-slate-400">
            {formatRelativeTime(feed.createdAt)}
          </span>
        </div>

        {/* 결과 보기 링크 */}
        <Link
          href={`/dream-result/${feed.id}`}
          className="text-slate-400 hover:text-purple-500 transition-colors p-1.5 rounded-full hover:bg-purple-50"
          aria-label="해몽 결과 상세 보기"
        >
          <ExternalLink className="w-4 h-4" />
        </Link>
      </div>

      {/* ─── 꿈 내용 ─── */}
      <div className="px-5 pb-3">
        <p className="text-slate-700 text-sm leading-relaxed line-clamp-3">
          <span className="font-medium text-slate-500 mr-1">💭 나의 꿈:</span>
          {feed.dreamContent}
        </p>
      </div>

      {/* ─── 이미지 영역 (있는 경우만) ─── */}
      {feed.imageUrl ? (
        <Link href={`/dream-result/${feed.id}`} className="block group">
          <div className="relative w-full aspect-[3/2] overflow-hidden bg-slate-100">
            <Image
              src={feed.imageUrl}
              alt={`${feed.user.nickname}의 꿈 이미지`}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              sizes="(max-width: 640px) 100vw, 560px"
              unoptimized
            />
            {/* 이미지 위 그라데이션 오버레이 */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        </Link>
      ) : (
        /* ─── 이미지 없는 경우: 그라데이션 배경의 강조 인용 카드 ─── */
        <div className="mx-5 mb-3 rounded-xl bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 border border-purple-100/60 p-5">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
            <p className="text-sm text-slate-700 leading-relaxed italic">
              &ldquo;{feed.aiAnalysisSummary.slice(0, 120)}...&rdquo;
            </p>
          </div>
        </div>
      )}

      {/* ─── AI 분석 요약 (이미지가 있는 카드에서만 텍스트로 노출) ─── */}
      {feed.imageUrl && (
        <div className="px-5 py-3 pb-5">
          <div className="flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
            <p className="text-sm text-slate-600 leading-relaxed line-clamp-2">
              {feed.aiAnalysisSummary}
            </p>
          </div>
        </div>
      )}
    </motion.article>
  );
};

export { FeedCard };
