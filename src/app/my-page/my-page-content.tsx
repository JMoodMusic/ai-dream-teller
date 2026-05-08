"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { format, isSameDay } from "date-fns";
import { ko } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import {
  LogOut,
  Edit3,
  Check,
  X,
  ShoppingBag,
  CalendarDays,
  Sparkles,
  ChevronRight,
  ChevronDown,
  User,
  FileText,
} from "lucide-react";

/**
 * 마이페이지 Props 타입
 */
interface MyPageContentProps {
  userId: string;
  email: string;
  nickname: string;
  avatarUrl: string;
  provider: "google" | "kakao" | undefined;
}

/**
 * 더미 구매 내역 타입
 * TODO: Supabase DB 연동 후 실제 타입으로 교체
 */
interface PurchaseItem {
  id: string;
  orderId: string;
  date: Date;
  dreamTitle: string;
  type: "text" | "image";
  price: number;
  status: "completed" | "pending";
}

/**
 * 한 번에 표시할 구매 내역 개수
 */
const ITEMS_PER_PAGE = 3;

/**
 * 더미 구매 내역 데이터
 * - 텍스트 전용 / 텍스트 + 이미지 혼합
 * TODO: Supabase에서 실제 데이터를 가져오도록 교체
 */
const DUMMY_PURCHASES: PurchaseItem[] = [
  {
    id: "1",
    orderId: "dream-001",
    date: new Date(2026, 4, 1),
    dreamTitle: "하늘을 나는 고래",
    type: "image",
    price: 2000,
    status: "completed",
  },
  {
    id: "2",
    orderId: "dream-002",
    date: new Date(2026, 4, 3),
    dreamTitle: "끝없는 미로 속 거울방",
    type: "text",
    price: 1500,
    status: "completed",
  },
  {
    id: "3",
    orderId: "dream-003",
    date: new Date(2026, 3, 28),
    dreamTitle: "빛나는 숲에서의 산책",
    type: "image",
    price: 2000,
    status: "completed",
  },
  {
    id: "4",
    orderId: "dream-004",
    date: new Date(2026, 3, 15),
    dreamTitle: "깊은 바다 속 도시",
    type: "text",
    price: 1500,
    status: "completed",
  },
  {
    id: "5",
    orderId: "dream-005",
    date: new Date(2026, 4, 3),
    dreamTitle: "별이 쏟아지는 밤하늘",
    type: "image",
    price: 2000,
    status: "pending",
  },
  {
    id: "6",
    orderId: "dream-006",
    date: new Date(2026, 3, 20),
    dreamTitle: "잃어버린 열쇠를 찾는 꿈",
    type: "text",
    price: 1500,
    status: "completed",
  },
  {
    id: "7",
    orderId: "dream-007",
    date: new Date(2026, 3, 10),
    dreamTitle: "구름 위를 걷는 아이",
    type: "image",
    price: 2000,
    status: "completed",
  },
  {
    id: "8",
    orderId: "dream-008",
    date: new Date(2026, 3, 5),
    dreamTitle: "낯선 도시에서 길을 잃다",
    type: "text",
    price: 1500,
    status: "completed",
  },
  {
    id: "9",
    orderId: "dream-009",
    date: new Date(2026, 2, 25),
    dreamTitle: "이가 빠지는 꿈",
    type: "text",
    price: 1500,
    status: "completed",
  },
  {
    id: "10",
    orderId: "dream-010",
    date: new Date(2026, 2, 18),
    dreamTitle: "시험 시간에 늦는 꿈",
    type: "text",
    price: 1500,
    status: "completed",
  },
  {
    id: "11",
    orderId: "dream-011",
    date: new Date(2026, 2, 12),
    dreamTitle: "거대한 파도와 마주하다",
    type: "image",
    price: 2000,
    status: "completed",
  },
  {
    id: "12",
    orderId: "dream-012",
    date: new Date(2026, 2, 3),
    dreamTitle: "오래된 집을 다시 방문하는 꿈",
    type: "text",
    price: 1500,
    status: "completed",
  },
];

/**
 * 구글 공식 "G" 로고 SVG (소형)
 */
const GoogleLogo = () => (
  <svg width="16" height="16" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
  </svg>
);

/**
 * 카카오 공식 말풍선 심볼 SVG (소형)
 */
const KakaoLogo = () => (
  <svg width="16" height="16" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
    <path
      fill="#000000"
      d="M128 36C70.562 36 24 72.713 24 118c0 29.279 19.466 54.97 48.748 69.477-1.593 5.494-10.237 35.344-10.581 37.689 0 0-.207 1.762.934 2.434s2.483.15 2.483.15c3.272-.457 37.943-24.811 43.944-29.068 5.995.849 12.168 1.318 18.472 1.318 57.438 0 104-36.712 104-82 0-45.287-46.562-82-104-82z"
    />
  </svg>
);

/**
 * 마이페이지 클라이언트 컴포넌트
 * - 프로필 정보 (닉네임 수정, 소셜 로고, 이메일, 로그아웃)
 * - 캘린더 (해몽 날짜 하이라이트)
 * - 구매 내역 리스트
 */
const MyPageContent = ({
  email,
  nickname: initialNickname,
  avatarUrl,
  provider,
}: MyPageContentProps) => {
  const router = useRouter();
  // 캘린더에 현재 표시 중인 월 (월 이동 시 구매 내역 필터 기준)
  const [displayedMonth, setDisplayedMonth] = useState<Date>(new Date());
  // 특정 날짜 선택 (null이면 월 전체 표시)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [nickname, setNickname] = useState(initialNickname);
  const [isEditingNickname, setIsEditingNickname] = useState(false);
  const [nicknameInput, setNicknameInput] = useState(initialNickname);
  const [nicknameError, setNicknameError] = useState<string | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  // 더보기 페이지네이션: 초기 ITEMS_PER_PAGE개만 표시
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  // 해몽이 이뤄진 날짜 목록 (구매 내역에서 추출)
  const dreamDates = DUMMY_PURCHASES.map((p) => p.date);

  /**
   * 구매 내역 필터링 로직
   * - 특정 날짜가 선택된 경우: 해당 날짜의 내역만 표시
   * - 날짜 미선택 시: 현재 캘린더에 표시된 월의 전체 내역 표시
   */
  const filteredPurchases = selectedDate
    ? DUMMY_PURCHASES.filter((p) => isSameDay(p.date, selectedDate))
    : DUMMY_PURCHASES.filter(
        (p) =>
          p.date.getFullYear() === displayedMonth.getFullYear() &&
          p.date.getMonth() === displayedMonth.getMonth()
      );

  // 현재 보여줄 내역 (페이지네이션 적용)
  const visiblePurchases = filteredPurchases.slice(0, visibleCount);
  const hasMore = visibleCount < filteredPurchases.length;

  /**
   * 닉네임 저장 핸들러
   * TODO: Supabase user_metadata 업데이트 로직 연동
   */
  const handleSaveNickname = useCallback(async () => {
    const trimmed = nicknameInput.trim();
    if (trimmed === "") {
      setNicknameError("닉네임을 입력해주세요.");
      return;
    }

    const isValid = /^[가-힣a-zA-Z0-9\s]+$/.test(trimmed);
    if (!isValid) {
      setNicknameError("특수문자는 사용할 수 없어요.");
      return;
    }

    setNicknameError(null);
    // TODO: Supabase updateUser({ data: { nickname: trimmed } }) 연동
    setNickname(trimmed);
    setIsEditingNickname(false);
  }, [nicknameInput]);

  /**
   * 닉네임 수정 취소
   */
  const handleCancelEdit = useCallback(() => {
    setNicknameInput(nickname);
    setNicknameError(null);
    setIsEditingNickname(false);
  }, [nickname]);

  /**
   * 로그아웃 핸들러
   * - Supabase 연동 시 signOut 호출 후 메인 이동
   * - 미연동(데모 모드) 시 바로 메인 랜딩 페이지로 이동
   * TODO: 백엔드 연동 완료 후 데모 분기 제거
   */
  const handleLogout = useCallback(async () => {
    try {
      setIsLoggingOut(true);

      // Supabase 미연동 시 바로 메인 페이지로 이동
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
      if (!supabaseUrl || supabaseUrl.startsWith("your")) {
        router.push("/");
        return;
      }

      const supabase = createClient();
      await supabase.auth.signOut();
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("로그아웃 실패:", error);
      setIsLoggingOut(false);
    }
  }, [router]);

  /**
   * 소셜 서비스 로고 렌더링
   */
  const renderProviderBadge = () => {
    if (provider === "google") {
      return (
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-slate-200 text-xs text-slate-500">
          <GoogleLogo />
          Google
        </div>
      );
    }
    if (provider === "kakao") {
      return (
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FEE500]/30 border border-[#FEE500]/50 text-xs text-slate-700">
          <KakaoLogo />
          Kakao
        </div>
      );
    }
    return null;
  };

  // 애니메이션 variant
  const fadeUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
  };

  return (
    <div className="flex-1 relative bg-[#FDFBF7] overflow-hidden">
      {/* Background Aurora Effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-15%] left-[-10%] w-[45%] h-[45%] rounded-full bg-purple-300/20 blur-[120px] mix-blend-multiply" />
        <div className="absolute top-[30%] right-[-15%] w-[40%] h-[40%] rounded-full bg-blue-200/30 blur-[120px] mix-blend-multiply" />
        <div className="absolute bottom-[-15%] left-[30%] w-[50%] h-[50%] rounded-full bg-pink-200/20 blur-[150px] mix-blend-multiply" />
      </div>

      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16 flex flex-col gap-8">
        {/* 페이지 타이틀 */}
        <motion.div
          {...fadeUp}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            마이{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500">
              페이지
            </span>
          </h1>
          <p className="mt-2 text-slate-500 text-sm">나의 꿈 기록과 해몽 히스토리</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ─── 프로필 카드 ─── */}
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-1 bg-white/60 backdrop-blur-sm rounded-3xl border border-slate-200/60 shadow-sm p-6 flex flex-col items-center gap-5 hover:bg-white/80 transition-colors"
          >
            {/* 아바타 */}
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 border-2 border-white shadow-md flex items-center justify-center overflow-hidden">
                {avatarUrl ? (
                  <Image
                    src={avatarUrl}
                    alt="프로필 이미지"
                    width={80}
                    height={80}
                    className="object-cover rounded-full"
                  />
                ) : (
                  <User className="w-8 h-8 text-purple-400" />
                )}
              </div>
              {/* 소셜 뱃지 */}
              <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-white shadow-sm border border-slate-200 flex items-center justify-center">
                {provider === "google" && <GoogleLogo />}
                {provider === "kakao" && <KakaoLogo />}
              </div>
            </div>

            {/* 닉네임 (수정 가능) */}
            <div className="flex flex-col items-center gap-1 w-full justify-center">
              {isEditingNickname ? (
                <>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="text"
                      value={nicknameInput}
                      onChange={(e) => {
                        setNicknameInput(e.target.value);
                        if (nicknameError) setNicknameError(null);
                      }}
                      onKeyDown={(e) => e.key === "Enter" && handleSaveNickname()}
                      className={`w-36 text-center text-sm border rounded-lg px-2 py-1.5 bg-white/80 focus:outline-none focus:ring-2 transition-all ${
                        nicknameError ? "border-red-400 focus:ring-red-300/50" : "border-purple-300 focus:ring-purple-300/50"
                      }`}
                      autoFocus
                      maxLength={20}
                    />
                    <button
                      onClick={handleSaveNickname}
                      className="p-1 rounded-md hover:bg-green-50 text-green-500 transition-colors"
                      aria-label="닉네임 저장"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="p-1 rounded-md hover:bg-slate-100 text-slate-400 transition-colors"
                      aria-label="닉네임 수정 취소"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  {nicknameError && (
                    <span className="text-xs text-red-500 font-medium animate-in fade-in slide-in-from-top-1">
                      {nicknameError}
                    </span>
                  )}
                </>
              ) : (
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-slate-800 text-lg">
                    {nickname}
                  </span>
                  <button
                    onClick={() => setIsEditingNickname(true)}
                    className="p-1 rounded-md hover:bg-purple-50 text-slate-400 hover:text-purple-500 transition-colors"
                    aria-label="닉네임 수정"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            {/* 소셜 뱃지 + 이메일 */}
            <div className="flex flex-col items-center gap-2 w-full">
              {renderProviderBadge()}
              <span className="text-xs text-slate-400 truncate max-w-full">
                {email}
              </span>
            </div>

            {/* 구분선 */}
            <div className="w-full border-t border-slate-200/60" />

            {/* 통계 */}
            <div className="flex items-center justify-around w-full">
              <div className="text-center">
                <p className="text-xl font-bold text-slate-800">
                  {DUMMY_PURCHASES.length}
                </p>
                <p className="text-xs text-slate-400">총 해몽</p>
              </div>
              <div className="h-8 w-px bg-slate-200/60" />
              <div className="text-center">
                <p className="text-xl font-bold text-slate-800">
                  {DUMMY_PURCHASES.filter((p) => p.status === "completed").length}
                </p>
                <p className="text-xs text-slate-400">완료</p>
              </div>
              <div className="h-8 w-px bg-slate-200/60" />
              <div className="text-center">
                <p className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">
                  {DUMMY_PURCHASES.reduce((sum, p) => sum + p.price, 0).toLocaleString()}원
                </p>
                <p className="text-xs text-slate-400">총 결제</p>
              </div>
            </div>

            {/* 구분선 */}
            <div className="w-full border-t border-slate-200/60" />

            {/* 로그아웃 버튼 */}
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="flex items-center gap-2 text-sm text-slate-400 hover:text-red-400 transition-colors disabled:opacity-50"
            >
              <LogOut className="w-4 h-4" />
              {isLoggingOut ? "로그아웃 중..." : "로그아웃"}
            </button>
          </motion.div>

          {/* ─── 캘린더 + 구매 내역 영역 ─── */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* 캘린더 카드 */}
            <motion.div
              {...fadeUp}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white/60 backdrop-blur-sm rounded-3xl border border-slate-200/60 shadow-sm p-6 hover:bg-white/80 transition-colors"
            >
              <div className="flex items-center gap-2 mb-4">
                <CalendarDays className="w-5 h-5 text-purple-500" />
                <h2 className="font-serif text-lg font-semibold text-slate-800">
                  꿈 해몽 캘린더
                </h2>
              </div>

              <div className="flex justify-center">
                <Calendar
                  mode="single"
                  month={displayedMonth}
                  selected={selectedDate}
                  onSelect={(date) => {
                    // 이미 선택된 날짜를 다시 클릭하면 선택 해제 (월 전체 보기)
                    if (date && selectedDate && isSameDay(date, selectedDate)) {
                      setSelectedDate(undefined);
                    } else {
                      setSelectedDate(date);
                    }
                    // 날짜 변경 시 더보기 카운트 리셋
                    setVisibleCount(ITEMS_PER_PAGE);
                  }}
                  onMonthChange={(month) => {
                    // 월 이동 시: 표시 월 변경, 날짜 선택 해제, 더보기 리셋
                    setDisplayedMonth(month);
                    setSelectedDate(undefined);
                    setVisibleCount(ITEMS_PER_PAGE);
                  }}
                  locale={ko}
                  className="rounded-2xl"
                  modifiers={{
                    dream: dreamDates,
                  }}
                  modifiersClassNames={{
                    dream:
                      "relative after:absolute after:bottom-0.5 after:left-1/2 after:-translate-x-1/2 after:w-1.5 after:h-1.5 after:rounded-full after:bg-gradient-to-r after:from-purple-500 after:to-pink-500",
                  }}
                />
              </div>

              {/* 현재 필터 정보 표시 */}
              <div className="mt-4 pt-4 border-t border-slate-200/60 text-center">
                <p className="text-sm text-slate-500">
                  {selectedDate ? (
                    <>
                      <span className="font-medium text-slate-700">
                        {format(selectedDate, "yyyy년 M월 d일 (EEEE)", { locale: ko })}
                      </span>
                      {" · "}
                      {filteredPurchases.length > 0 ? (
                        <span className="text-purple-500 font-medium">
                          {filteredPurchases.length}건의 해몽
                        </span>
                      ) : (
                        <span className="text-slate-400">해몽 기록 없음</span>
                      )}
                    </>
                  ) : (
                    <>
                      <span className="font-medium text-slate-700">
                        {format(displayedMonth, "yyyy년 M월", { locale: ko })}
                      </span>
                      {" · "}
                      {filteredPurchases.length > 0 ? (
                        <span className="text-purple-500 font-medium">
                          총 {filteredPurchases.length}건의 해몽
                        </span>
                      ) : (
                        <span className="text-slate-400">해몽 기록 없음</span>
                      )}
                    </>
                  )}
                </p>
                {selectedDate && (
                  <button
                    onClick={() => {
                      setSelectedDate(undefined);
                      setVisibleCount(ITEMS_PER_PAGE);
                    }}
                    className="mt-1.5 text-xs text-purple-400 hover:text-purple-600 transition-colors"
                  >
                    {format(displayedMonth, "M월", { locale: ko })} 전체 보기
                  </button>
                )}
              </div>
            </motion.div>

            {/* 구매 내역 리스트 */}
            <motion.div
              {...fadeUp}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white/60 backdrop-blur-sm rounded-3xl border border-slate-200/60 shadow-sm p-6 hover:bg-white/80 transition-colors"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-pink-500" />
                  <h2 className="font-serif text-lg font-semibold text-slate-800">
                    구매 내역
                  </h2>
                </div>
                <span className="text-xs text-slate-400 bg-slate-100/80 px-2.5 py-1 rounded-full">
                  총 {filteredPurchases.length}건
                </span>
              </div>

              {filteredPurchases.length > 0 ? (
                <div className="flex flex-col gap-3">
                  {visiblePurchases.map((purchase, idx) => (
                    <motion.div
                      key={purchase.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: idx * 0.05 }}
                    >
                      <Link
                        href={`/dream-result/${purchase.orderId}`}
                        className="group flex items-center gap-4 p-4 rounded-2xl border border-slate-100/80 bg-white/40 hover:bg-white/80 hover:border-purple-200/60 hover:shadow-md transition-all"
                      >
                        {/* 아이콘: 이미지 포함은 Sparkles, 텍스트 전용은 FileText */}
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                            purchase.type === "image"
                              ? "bg-gradient-to-br from-purple-100 to-pink-100"
                              : "bg-gradient-to-br from-slate-100 to-blue-100"
                          }`}
                        >
                          {purchase.type === "image" ? (
                            <Sparkles className="w-5 h-5 text-pink-500" />
                          ) : (
                            <FileText className="w-5 h-5 text-blue-500" />
                          )}
                        </div>

                        {/* 내용 */}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-slate-800 text-sm truncate group-hover:text-purple-700 transition-colors">
                            {purchase.dreamTitle}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs text-slate-400">
                              {format(purchase.date, "M월 d일", { locale: ko })}
                            </span>
                            <span
                              className={`text-xs px-1.5 py-0.5 rounded-md font-medium ${
                                purchase.type === "image"
                                  ? "bg-pink-50 text-pink-500"
                                  : "bg-blue-50 text-blue-500"
                              }`}
                            >
                              {purchase.type === "image"
                                ? "텍스트 + 이미지"
                                : "텍스트"}
                            </span>
                            <span
                              className={`text-xs px-1.5 py-0.5 rounded-md font-medium ${
                                purchase.status === "completed"
                                  ? "bg-green-50 text-green-500"
                                  : "bg-amber-50 text-amber-500"
                              }`}
                            >
                              {purchase.status === "completed" ? "완료" : "진행 중"}
                            </span>
                          </div>
                        </div>

                        {/* 가격 + 화살표 */}
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-sm font-semibold text-slate-700">
                            {purchase.price.toLocaleString()}원
                          </span>
                          <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-purple-400 group-hover:translate-x-0.5 transition-all" />
                        </div>
                      </Link>
                    </motion.div>
                  ))}

                  {/* 더보기 버튼 */}
                  {hasMore && (
                    <motion.button
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.2 }}
                      onClick={() => setVisibleCount((prev) => prev + ITEMS_PER_PAGE)}
                      className="flex items-center justify-center gap-2 w-full py-3 mt-1 rounded-2xl border border-slate-200/60 bg-white/40 text-sm text-slate-500 hover:bg-white/80 hover:text-purple-500 hover:border-purple-200/60 transition-all group"
                    >
                      <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
                      더보기 ({filteredPurchases.length - visibleCount}건 남음)
                    </motion.button>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 flex items-center justify-center mb-4">
                    <Sparkles className="w-6 h-6 text-purple-400" />
                  </div>
                  <p className="text-slate-500 text-sm mb-1">
                    이 날짜에는 해몽 기록이 없어요
                  </p>
                  <p className="text-slate-400 text-xs">
                    캘린더에서 보라색 점이 있는 날짜를 선택해보세요
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyPageContent;
