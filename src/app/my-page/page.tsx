import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import MyPageContent from "./my-page-content";

export const metadata: Metadata = {
  title: "마이페이지 | AI Dream Teller",
  description:
    "나의 꿈 해석 기록을 캘린더에서 확인하고, 구매 내역을 관리하세요.",
};

/**
 * 유저 마이페이지 (/my-page)
 * - 회원 가입된 유저만 접근 가능 (미인증 시 /auth로 리다이렉트)
 * - 서버에서 유저 정보를 가져와 클라이언트 컴포넌트에 전달
 * - demo 모드: searchParams에 demo=true & provider가 있으면 더미 데이터로 렌더링
 *   TODO: 백엔드 연동 완료 후 demo 모드 제거
 */
interface MyPageProps {
  searchParams: Promise<{ demo?: string; provider?: string }>;
}

const MyPage = async ({ searchParams }: MyPageProps) => {
  const params = await searchParams;

  // 데모 모드: Supabase 미연동 상태에서 UI를 미리 확인할 때 사용
  // TODO: 백엔드 연동 완료 후 데모 모드 제거
  if (params.demo === "true") {
    const demoProvider = (params.provider as "google" | "kakao") ?? "google";
    const demoData = {
      google: {
        nickname: "꿈꾸는 사람",
        email: "dreamer@gmail.com",
        avatarUrl: "",
      },
      kakao: {
        nickname: "몽환의 여행자",
        email: "traveler@kakao.com",
        avatarUrl: "",
      },
    };
    const demo = demoData[demoProvider];

    return (
      <MyPageContent
        userId="demo-user-id"
        email={demo.email}
        nickname={demo.nickname}
        avatarUrl={demo.avatarUrl}
        provider={demoProvider}
      />
    );
  }

  // Supabase 미연동 상태 방어
  let user = null;
  let shouldRedirect = false;
  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    user = data.user;
  } catch {
    // Supabase 환경변수 미설정 시 로그인 페이지로 리다이렉트
    shouldRedirect = true;
  }

  // 미인증 유저 또는 에러 발생 시 로그인 페이지로 리다이렉트
  if (shouldRedirect || !user) {
    redirect("/auth");
  }

  // 소셜 로그인 제공자 정보 추출
  const provider = user.app_metadata?.provider as "google" | "kakao" | undefined;
  const email = user.email ?? "";
  // 닉네임: user_metadata에서 가져오거나 이메일 앞부분 사용
  const nickname =
    (user.user_metadata?.nickname as string) ??
    (user.user_metadata?.full_name as string) ??
    (user.user_metadata?.name as string) ??
    email.split("@")[0];
  const avatarUrl = (user.user_metadata?.avatar_url as string) ?? "";

  return (
    <MyPageContent
      userId={user.id}
      email={email}
      nickname={nickname}
      avatarUrl={avatarUrl}
      provider={provider}
    />
  );
};

export default MyPage;
