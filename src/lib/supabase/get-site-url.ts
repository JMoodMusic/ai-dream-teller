/**
 * 환경별 사이트 URL 반환 유틸리티
 * - 개발 환경: localhost
 * - 프로덕션 환경: NEXT_PUBLIC_SITE_URL 또는 Vercel 자동 URL
 */
export const getSiteUrl = (): string => {
  // 1순위: 환경변수로 명시적으로 지정된 URL
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }

  // 2순위: Vercel 배포 환경의 자동 URL
  if (process.env.NEXT_PUBLIC_VERCEL_URL) {
    return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
  }

  // 3순위: 개발 환경 기본값
  return "http://localhost:3000";
};
