import type { Metadata } from "next";
import { FeedsClient } from "@/components/feeds/feeds-client";

/**
 * 피드 페이지 SEO 메타데이터
 * - 공개 해몽 결과 리스트 페이지
 */
export const metadata: Metadata = {
  title: "꿈 해몽 피드 | AI Dream Teller",
  description:
    "다른 사람들의 꿈 이야기와 AI 해몽 결과를 살펴보세요. 프로이트, 칼 융, 신경과학, 게슈탈트 등 다양한 전문가 스타일의 심층 분석을 확인할 수 있습니다.",
};

/**
 * 피드 페이지 (Server Component)
 * - 이전 유저들의 과거 풀이 내역 리스트
 * - 페이스북 형태의 피드 UI
 * - 이미지가 있는 해몽 결과는 이미지와 텍스트 함께 노출
 * - 텍스트만 있는 해몽 결과는 텍스트만 노출
 */
const FeedsPage = () => {
  return <FeedsClient />;
};

export default FeedsPage;
