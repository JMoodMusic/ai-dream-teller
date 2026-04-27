/**
 * 피드 아이템 인터페이스
 * - PRD dreams 테이블 기반 공개 피드 데이터 구조
 * - 프로필 정보는 유저 또는 비회원 닉네임 마스킹 형태로 노출
 */
export interface FeedItem {
  id: string;
  /** 유저 프로필 정보 (닉네임, 아바타) */
  user: {
    nickname: string;
    avatarUrl: string;
  };
  /** 선택한 해몽 전문가 스타일 (프로이트, 융 등) */
  expertStyle: ExpertStyle;
  /** 유저가 입력한 꿈 내용 (공개 피드용으로 일부 노출) */
  dreamContent: string;
  /** LLM이 생성한 심층 해몽 텍스트 요약 */
  aiAnalysisSummary: string;
  /** 생성된 꿈 이미지 URL (옵션 결제 시에만 존재) */
  imageUrl: string | null;
  /** 레코드 생성 일시 */
  createdAt: Date;
}

/** 해몽 전문가 스타일 타입 */
export type ExpertStyle = "프로이트" | "칼 융" | "신경과학" | "게슈탈트";

/** 전문가 스타일별 메타데이터 */
export interface ExpertStyleMeta {
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
  icon: string;
}

/** 전문가 스타일별 메타데이터 매핑 */
export const EXPERT_STYLE_META: Record<ExpertStyle, ExpertStyleMeta> = {
  프로이트: {
    label: "프로이트 정신분석",
    color: "text-purple-700",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    icon: "🧠",
  },
  "칼 융": {
    label: "칼 융 원형 이론",
    color: "text-blue-700",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    icon: "🌙",
  },
  신경과학: {
    label: "신경과학 분석",
    color: "text-emerald-700",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
    icon: "🔬",
  },
  게슈탈트: {
    label: "게슈탈트 심리학",
    color: "text-amber-700",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    icon: "🎭",
  },
};
