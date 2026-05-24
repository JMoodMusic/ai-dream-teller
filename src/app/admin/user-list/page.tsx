"use client";

import React, { useState, useEffect, useMemo } from "react";
import { 
  Search, 
  Filter, 
  ChevronLeft, 
  ChevronRight, 
  RefreshCw, 
  SlidersHorizontal, 
  User, 
  UserCheck, 
  UserX,
  CreditCard,
  Mail,
  Smartphone,
  Eye,
  X,
  Sparkles,
  ArrowUpDown,
  History,
  TrendingUp,
  AlertCircle
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

// 유저 인터페이스 타입 정의
interface UserDreamHistory {
  date: string;
  expertStyle: string;
  snippet: string;
  amount: number;
  status: "SUCCESS" | "PENDING" | "FAILED";
}

interface UserItem {
  id: string;
  emailOrPhone: string;
  nickname: string;
  userType: "MEMBER" | "GUEST";
  provider: "google" | "kakao" | "email" | "guest_phone";
  createdAt: string;
  orderCount: number;
  totalAmount: number;
  hasPaid: boolean;
  dreamHistory: UserDreamHistory[];
}

// 다중 필터 타입 정의
type UserTypeFilter = "ALL" | "MEMBER" | "GUEST";
type PaymentFilter = "ALL" | "PAID" | "UNPAID";
type ProviderFilter = "ALL" | "GOOGLE" | "KAKAO" | "EMAIL" | "GUEST_PHONE";
type SortOption = "date_desc" | "date_asc" | "spending_desc" | "orders_desc" | "name_asc";

// 주문 목록 데이터와 정확히 매칭 및 무결성이 보장된 13인 유저 더미 원장 데이터
const MOCK_USERS: UserItem[] = [
  {
    id: "usr_101",
    emailOrPhone: "richdreamer@gmail.com",
    nickname: "황금빛항해자",
    userType: "MEMBER",
    provider: "google",
    createdAt: "2026-05-10T11:00:00.000Z",
    orderCount: 3,
    totalAmount: 5500,
    hasPaid: true,
    dreamHistory: [
      { date: "2026-05-24T07:17:21.913Z", expertStyle: "프로이트", snippet: "지그문트 프로이트를 봤어... 책을 건네줬지.", amount: 1500, status: "SUCCESS" },
      { date: "2026-05-21T11:22:09.112Z", expertStyle: "칼 융", snippet: "하늘을 휠휠 날면서 황금빛 태평양 바다를 내려다봤는데...", amount: 1500, status: "SUCCESS" },
      { date: "2026-05-18T10:05:12.900Z", expertStyle: "칼 융", snippet: "하얀 눈이 내리는 날 숲속 길을 잃었다가 오두막을...", amount: 2000, status: "PENDING" }
    ]
  },
  {
    id: "usr_102",
    emailOrPhone: "010-1234-5107",
    nickname: "비회원_5107",
    userType: "GUEST",
    provider: "guest_phone",
    createdAt: "2026-05-24T07:17:21.000Z",
    orderCount: 1,
    totalAmount: 1500,
    hasPaid: true,
    dreamHistory: [
      { date: "2026-05-24T07:17:21.913Z", expertStyle: "프로이트", snippet: "지그문트 프로이트를 봤어... 그가 꿈의 해석 책을...", amount: 1500, status: "SUCCESS" }
    ]
  },
  {
    id: "usr_103",
    emailOrPhone: "010-9876-5432",
    nickname: "비회원_5432",
    userType: "GUEST",
    provider: "guest_phone",
    createdAt: "2026-05-24T07:12:32.000Z",
    orderCount: 1,
    totalAmount: 2000,
    hasPaid: true,
    dreamHistory: [
      { date: "2026-05-24T07:12:32.807Z", expertStyle: "칼 융", snippet: "삼성전자 인버스에 전재산 박아서 한강 다리에 가 서있는데...", amount: 2000, status: "SUCCESS" }
    ]
  },
  {
    id: "usr_104",
    emailOrPhone: "user1@dreamer.com",
    nickname: "루시드드림",
    userType: "MEMBER",
    provider: "email",
    createdAt: "2026-05-12T03:00:00.000Z",
    orderCount: 2,
    totalAmount: 4000,
    hasPaid: true,
    dreamHistory: [
      { date: "2026-05-24T07:05:28.699Z", expertStyle: "아들러", snippet: "니어 프로토콜 코인 상승을 보고 신나게 사람들 틈에서...", amount: 2000, status: "SUCCESS" },
      { date: "2026-05-14T11:45:00.829Z", expertStyle: "칼 융", snippet: "거대 쓰나미가 덮쳐오는데 내 지휘에 홍해처럼 갈라졌어.", amount: 2000, status: "SUCCESS" }
    ]
  },
  {
    id: "usr_105",
    emailOrPhone: "nightmare@daum.net",
    nickname: "악몽수집가",
    userType: "MEMBER",
    provider: "kakao",
    createdAt: "2026-05-20T22:40:00.000Z",
    orderCount: 1,
    totalAmount: 2000,
    hasPaid: false, // 결제 실패했으므로 실구매 금액은 미반영 기준
    dreamHistory: [
      { date: "2026-05-20T22:45:11.890Z", expertStyle: "프로이트", snippet: "어둠 속에서 괴물이 나를 쫓아오는데 다리가 굳어버렸어.", amount: 2000, status: "FAILED" }
    ]
  },
  {
    id: "usr_106",
    emailOrPhone: "010-8888-9999",
    nickname: "비회원_9999",
    userType: "GUEST",
    provider: "guest_phone",
    createdAt: "2026-05-19T14:15:00.000Z",
    orderCount: 1,
    totalAmount: 1500,
    hasPaid: true,
    dreamHistory: [
      { date: "2026-05-19T14:15:30.412Z", expertStyle: "아들러", snippet: "우주선을 타고 화성에 내렸는데 외계인이 대접해줬어.", amount: 1500, status: "SUCCESS" }
    ]
  },
  {
    id: "usr_107",
    emailOrPhone: "snowy@naver.com",
    nickname: "겨울왕국",
    userType: "MEMBER",
    provider: "kakao",
    createdAt: "2026-05-18T10:00:00.000Z",
    orderCount: 1,
    totalAmount: 2000,
    hasPaid: false,
    dreamHistory: [
      { date: "2026-05-18T10:05:12.900Z", expertStyle: "칼 융", snippet: "눈 오는 날 숲속에서 길을 잃었다가 따뜻한 오두막...", amount: 2000, status: "PENDING" }
    ]
  },
  {
    id: "usr_108",
    emailOrPhone: "010-5555-4444",
    nickname: "비회원_4444",
    userType: "GUEST",
    provider: "guest_phone",
    createdAt: "2026-05-17T09:12:00.000Z",
    orderCount: 1,
    totalAmount: 1500,
    hasPaid: true,
    dreamHistory: [
      { date: "2026-05-17T09:12:45.312Z", expertStyle: "프로이트", snippet: "시험장에 들어갔는데 연필과 지우개가 모래처럼 부러져...", amount: 1500, status: "SUCCESS" }
    ]
  },
  {
    id: "usr_109",
    emailOrPhone: "jumper@dream.com",
    nickname: "스카이폴",
    userType: "MEMBER",
    provider: "google",
    createdAt: "2026-05-16T18:30:00.000Z",
    orderCount: 1,
    totalAmount: 2000,
    hasPaid: true,
    dreamHistory: [
      { date: "2026-05-16T18:34:20.198Z", expertStyle: "아들러", snippet: "100층 꼭대기에서 번지점프를 하는데 쾌감을 느꼈어.", amount: 2000, status: "SUCCESS" }
    ]
  },
  {
    id: "usr_110",
    emailOrPhone: "010-2222-3333",
    nickname: "비회원_3333",
    userType: "GUEST",
    provider: "guest_phone",
    createdAt: "2026-05-15T15:20:00.000Z",
    orderCount: 1,
    totalAmount: 1500,
    hasPaid: false,
    dreamHistory: [
      { date: "2026-05-15T15:20:10.512Z", expertStyle: "프로이트", snippet: "명품 가방을 버스 짐칸에 두고 내려서 필사적으로...", amount: 1500, status: "FAILED" }
    ]
  },
  {
    id: "usr_111",
    emailOrPhone: "teeth_lost@gmail.com",
    nickname: "치과무서워",
    userType: "MEMBER",
    provider: "email",
    createdAt: "2026-05-12T05:30:00.000Z",
    orderCount: 1,
    totalAmount: 2000,
    hasPaid: true,
    dreamHistory: [
      { date: "2026-05-12T05:34:11.900Z", expertStyle: "프로이트", snippet: "앞니와 어금니가 몽땅 빠지며 입안이 선혈로 가득...", amount: 2000, status: "SUCCESS" }
    ]
  },
  {
    id: "usr_112",
    emailOrPhone: "lucky_lotto@naver.com",
    nickname: "인생역전로또",
    userType: "MEMBER",
    provider: "google",
    createdAt: "2026-05-11T23:50:00.000Z",
    orderCount: 2,
    totalAmount: 3500,
    hasPaid: true,
    dreamHistory: [
      { date: "2026-05-11T23:56:00.298Z", expertStyle: "칼 융", snippet: "돌아가신 할머니가 오만원 돈뭉치 보따리를 주셨어.", amount: 1500, status: "SUCCESS" },
      { date: "2026-05-22T03:16:06.839Z", expertStyle: "프로이트", snippet: "돼지랑 같이 앉아서 돼지갈비를 맛있게 구워 먹었어.", amount: 2000, status: "SUCCESS" }
    ]
  },
  {
    id: "usr_113",
    emailOrPhone: "clean_slate@gmail.com",
    nickname: "신규새출발",
    userType: "MEMBER",
    provider: "google",
    createdAt: "2026-05-24T06:00:00.000Z",
    orderCount: 0,
    totalAmount: 0,
    hasPaid: false,
    dreamHistory: []
  }
];

// TODO: 추후 관리자용 전체 유저 조회 API(/api/admin/users) 연동 시 SWR 캐싱 및 RLS 보안 필터 적용 (FIX: 비회원 전화번호 노출 시 마스킹 정책 규정 준수)
const UserListPage = () => {
  // 상태 제어
  const [searchTerm, setSearchTerm] = useState("");
  const [userType, setUserType] = useState<UserTypeFilter>("ALL");
  const [paymentStatus, setPaymentStatus] = useState<PaymentFilter>("ALL");
  const [provider, setProvider] = useState<ProviderFilter>("ALL");
  const [sortBy, setSortBy] = useState<SortOption>("date_desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState<UserItem[]>(MOCK_USERS);
  
  // 상세 사이드 오버/드로어 상태
  const [selectedUser, setSelectedUser] = useState<UserItem | null>(null);

  const itemsPerPage = 8;

  // 다중 필터 & 정렬 & 검색 로직 적용 (useMemo)
  const filteredAndSortedUsers = useMemo(() => {
    let result = [...users];

    // 1. 통합 텍스트 검색 (이메일, 휴대폰 번호, 닉네임)
    if (searchTerm.trim() !== "") {
      const lowerSearch = searchTerm.toLowerCase();
      result = result.filter(u => 
        u.emailOrPhone.toLowerCase().includes(lowerSearch) ||
        u.nickname.toLowerCase().includes(lowerSearch) ||
        u.id.toLowerCase().includes(lowerSearch)
      );
    }

    // 2. 회원/비회원 유저 유형 필터링
    if (userType !== "ALL") {
      result = result.filter(u => u.userType === userType);
    }

    // 3. 결제 이력 보유 여부 필터링
    if (paymentStatus !== "ALL") {
      if (paymentStatus === "PAID") {
        result = result.filter(u => u.hasPaid === true);
      } else {
        result = result.filter(u => u.hasPaid === false);
      }
    }

    // 4. 가입 제공자(소셜) 필터링
    if (provider !== "ALL") {
      result = result.filter(u => u.provider.toUpperCase() === provider);
    }

    // 5. 정렬 제어
    if (sortBy === "date_desc") {
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortBy === "date_asc") {
      result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    } else if (sortBy === "spending_desc") {
      result.sort((a, b) => b.totalAmount - a.totalAmount);
    } else if (sortBy === "orders_desc") {
      result.sort((a, b) => b.orderCount - a.orderCount);
    } else if (sortBy === "name_asc") {
      result.sort((a, b) => a.nickname.localeCompare(b.nickname, "ko"));
    }

    return result;
  }, [users, searchTerm, userType, paymentStatus, provider, sortBy]);

  // 페이지네이션 처리
  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedUsers.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedUsers, currentPage]);

  const totalPages = Math.max(Math.ceil(filteredAndSortedUsers.length / itemsPerPage), 1);

  // 조건 탐색 변경 시 1페이지 원복
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, userType, paymentStatus, provider, sortBy]);

  // 목록 새로고침 시뮬레이터
  const handleRefresh = async () => {
    try {
      setIsLoading(true);
      // TODO: 실제 백엔드 연동 시 `fetch('/api/admin/users')`
      await new Promise(resolve => setTimeout(resolve, 500));
      setUsers(MOCK_USERS);
      setCurrentPage(1);
    } catch (error) {
      console.error("유저 대장을 갱신하는 중 오류 발생:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 필터 초기화
  const resetFilters = () => {
    setSearchTerm("");
    setUserType("ALL");
    setPaymentStatus("ALL");
    setProvider("ALL");
    setSortBy("date_desc");
  };

  // 회원 기본 메트릭 통계 집계
  const stats = useMemo(() => {
    const members = users.filter(u => u.userType === "MEMBER");
    const guests = users.filter(u => u.userType === "GUEST");
    const payingUsers = users.filter(u => u.hasPaid);
    
    return {
      totalUsers: users.length,
      memberCount: members.length,
      guestCount: guests.length,
      payingCount: payingUsers.length,
      conversionRate: Math.round((payingUsers.length / users.length) * 100)
    };
  }, [users]);

  return (
    <div className="space-y-8 relative">
      {/* 상단 제목 및 동기화 콘솔 */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">
            플랫폼 유저 및 계정 감사
          </h3>
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider block mt-1">
            Audit register profiles, trace non-member guests, and analyze conversion indexes
          </p>
        </div>

        <button
          onClick={handleRefresh}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 h-10 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-colors shadow-sm disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
          유저 DB 동기화
        </button>
      </div>

      {/* 1. 상단 유저 특화 메트릭 대시보드 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white/60 backdrop-blur-sm border-slate-200/60 shadow-sm rounded-3xl overflow-hidden hover:shadow-md transition-shadow">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                전체 관리 유저 수
              </span>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                {stats.totalUsers.toLocaleString()}명
              </h3>
              <p className="text-[11px] text-purple-500 font-semibold flex items-center gap-1">
                <UserCheck className="w-3.5 h-3.5" />
                회원 {stats.memberCount}명 / 게스트 {stats.guestCount}명
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-50 to-indigo-50 flex items-center justify-center shrink-0">
              <User className="w-5 h-5 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/60 backdrop-blur-sm border-slate-200/60 shadow-sm rounded-3xl overflow-hidden hover:shadow-md transition-shadow">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                누적 결제 완료 유저
              </span>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                {stats.payingCount}명
              </h3>
              <p className="text-[11px] text-green-500 font-semibold flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" />
                해몽 서비스 유료 결제 경험
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center shrink-0">
              <CreditCard className="w-5 h-5 text-emerald-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/60 backdrop-blur-sm border-slate-200/60 shadow-sm rounded-3xl overflow-hidden hover:shadow-md transition-shadow">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                구매 전환 성숙도
              </span>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                {stats.conversionRate}%
              </h3>
              <p className="text-[11px] text-indigo-500 font-semibold flex items-center gap-1">
                <UserCheck className="w-3.5 h-3.5" />
                방문 대비 매출 전환 비율
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-50 to-blue-50 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-indigo-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/60 backdrop-blur-sm border-slate-200/60 shadow-sm rounded-3xl overflow-hidden hover:shadow-md transition-shadow">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                비활성 가입 회원
              </span>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                {users.filter(u => u.userType === "MEMBER" && u.orderCount === 0).length}명
              </h3>
              <p className="text-[11px] text-slate-400 font-semibold flex items-center gap-1">
                <UserX className="w-3.5 h-3.5" />
                가입 후 결제 이력 미보유 회원
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center shrink-0">
              <UserX className="w-5 h-5 text-slate-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 2. 다중 필터 서치 패널 */}
      <Card className="bg-white/60 backdrop-blur-sm border-slate-200/60 shadow-sm rounded-3xl p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-purple-600" />
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">유저 원장 다중 필터 필드</h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* 검색어 입력바 */}
            <div className="relative lg:col-span-2">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="이메일, 연락처, 닉네임, 유저 UUID 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
              />
            </div>

            {/* 회원 유형 */}
            <div className="flex flex-col gap-1.5">
              <select
                value={userType}
                onChange={(e) => setUserType(e.target.value as UserTypeFilter)}
                className="w-full h-11 px-3.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
              >
                <option value="ALL">유저분류 (전체)</option>
                <option value="MEMBER">회원 유저</option>
                <option value="GUEST">비회원 게스트</option>
              </select>
            </div>

            {/* 결제 이력 */}
            <div className="flex flex-col gap-1.5">
              <select
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value as PaymentFilter)}
                className="w-full h-11 px-3.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
              >
                <option value="ALL">결제여부 (전체)</option>
                <option value="PAID">결제 이력 보유 유저</option>
                <option value="UNPAID">미결제 가입 유저</option>
              </select>
            </div>

            {/* 인증 공급처 */}
            <div className="flex flex-col gap-1.5">
              <select
                value={provider}
                onChange={(e) => setProvider(e.target.value as ProviderFilter)}
                className="w-full h-11 px-3.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
              >
                <option value="ALL">인증경로 (전체)</option>
                <option value="GOOGLE">구글 소셜 연동</option>
                <option value="KAKAO">카카오 소셜 연동</option>
                <option value="EMAIL">이메일 자체 회원가입</option>
                <option value="GUEST_PHONE">비회원 번호 인증</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-3 border-t border-slate-100">
            {/* 정렬 셀렉터 */}
            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-xs font-bold text-slate-500">정렬 기준:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="h-8 border-none bg-transparent text-xs font-bold text-purple-600 focus:outline-none cursor-pointer"
              >
                <option value="date_desc">최근 가입/유입 순</option>
                <option value="date_asc">가장 오래된 가입 순</option>
                <option value="spending_desc">누적 결제금액 높은 순</option>
                <option value="orders_desc">누적 결제건수 많은 순</option>
                <option value="name_asc">닉네임 가나다 순</option>
              </select>
            </div>

            {/* 필터 초기화 버튼 */}
            <button
              onClick={resetFilters}
              className="text-xs font-bold text-slate-400 hover:text-purple-600 transition-colors flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" />
              필터 초기화
            </button>
          </div>
        </div>
      </Card>

      {/* 3. 유저 테이블 데이터 뷰 */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4">
          <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
          <p className="text-slate-500 font-medium animate-pulse">유저 정보 원장을 동기화하고 있습니다...</p>
        </div>
      ) : filteredAndSortedUsers.length === 0 ? (
        <Card className="bg-white/60 backdrop-blur-sm border-slate-200/60 shadow-sm rounded-3xl p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
            <UserX className="w-7 h-7 text-slate-400" />
          </div>
          <h4 className="text-lg font-bold text-slate-800">일치하는 유저 데이터가 없습니다</h4>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mt-2">
            검색 필드를 조정하거나 검색 키워드를 교체하여 주십시오.
          </p>
          <button
            onClick={resetFilters}
            className="mt-5 h-9 px-5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors shadow-sm"
          >
            필터 필드 전면 초기화
          </button>
        </Card>
      ) : (
        <div className="space-y-6">
          <Card className="bg-white/60 backdrop-blur-sm border-slate-200/60 shadow-sm rounded-3xl overflow-hidden p-6">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-xs text-slate-400 font-bold uppercase tracking-wider h-12">
                    <th className="pb-3 pl-2">가입/유입일시</th>
                    <th className="pb-3">유저 ID (UUID)</th>
                    <th className="pb-3">구분</th>
                    <th className="pb-3">닉네임</th>
                    <th className="pb-3">계정 정보 (연락처)</th>
                    <th className="pb-3">가입 경로</th>
                    <th className="pb-3">누적 결제건수</th>
                    <th className="pb-3">누적 결제금액</th>
                    <th className="pb-3">결제 상태</th>
                    <th className="pb-3 text-center">동적관리</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-sm">
                  {paginatedUsers.map((user) => (
                    <tr key={user.id} className="h-16 hover:bg-slate-50/50 transition-colors">
                      <td className="text-slate-500 font-medium text-xs pl-2 shrink-0">
                        {format(new Date(user.createdAt), "yyyy-MM-dd HH:mm", { locale: ko })}
                      </td>
                      <td className="font-mono text-xs text-slate-400 max-w-[120px] truncate">
                        {user.id}
                      </td>
                      <td>
                        <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                          user.userType === "MEMBER" 
                            ? "bg-purple-50 text-purple-600 border border-purple-200/35" 
                            : "bg-blue-50 text-blue-600 border border-blue-200/35"
                        }`}>
                          {user.userType === "MEMBER" ? "회원" : "비회원"}
                        </span>
                      </td>
                      <td className="font-bold text-slate-800">
                        {user.nickname}
                      </td>
                      <td className="font-mono text-xs font-bold text-slate-700">
                        <div className="flex items-center gap-1.5">
                          {user.userType === "MEMBER" ? <Mail className="w-3 h-3 text-slate-400" /> : <Smartphone className="w-3 h-3 text-slate-400" />}
                          {user.emailOrPhone}
                        </div>
                      </td>
                      <td>
                        <span className={`text-[10px] font-bold uppercase ${
                          user.provider === "google" 
                            ? "text-blue-500" 
                            : user.provider === "kakao"
                            ? "text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded-lg"
                            : user.provider === "email"
                            ? "text-slate-600 bg-slate-100 px-2 py-0.5 rounded-lg"
                            : "text-purple-600"
                        }`}>
                          {user.provider === "guest_phone" ? "비회원 인증" : user.provider}
                        </span>
                      </td>
                      <td className="font-bold text-slate-800 text-center pr-6">
                        {user.orderCount}건
                      </td>
                      <td className="font-black text-slate-900">
                        {user.totalAmount.toLocaleString()}원
                      </td>
                      <td>
                        <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                          user.hasPaid 
                            ? "bg-green-50 text-green-600" 
                            : "bg-slate-100 text-slate-400"
                        }`}>
                          {user.hasPaid ? "결제 활성" : "미결제 유저"}
                        </span>
                      </td>
                      <td className="text-center">
                        <button
                          onClick={() => setSelectedUser(user)}
                          className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 hover:bg-purple-100 text-slate-500 hover:text-purple-600 transition-colors"
                          title="구매 내역 감사"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* 4. 하단 페이지네이션 컨트롤바 */}
          <div className="flex justify-between items-center bg-white/60 backdrop-blur-sm border border-slate-200/60 rounded-2xl px-6 py-4 shadow-sm">
            <span className="text-xs font-bold text-slate-500">
              총 {filteredAndSortedUsers.length}명 중 {(currentPage - 1) * itemsPerPage + 1}-
              {Math.min(currentPage * itemsPerPage, filteredAndSortedUsers.length)}명 표출
            </span>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="w-9 h-9 rounded-xl border border-slate-200 bg-white flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:hover:bg-white"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${
                    currentPage === page
                      ? "bg-slate-900 text-white shadow-sm"
                      : "border border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="w-9 h-9 rounded-xl border border-slate-200 bg-white flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:hover:bg-white"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. 프리미엄 동적 드로어 (Slide-over Panel): 선택 유저 해몽 이력서 모니터링 */}
      {selectedUser && (
        <div className="fixed inset-0 z-[100] overflow-hidden flex justify-end">
          {/* 아웃사이드 터치 배경 딤처리 */}
          <div 
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-300"
            onClick={() => setSelectedUser(null)}
          />

          {/* 우측 슬라이드 오버 본문 */}
          <div className="relative w-full max-w-lg bg-white/95 backdrop-blur-md shadow-2xl h-screen flex flex-col z-10 border-l border-slate-200 animate-slideIn">
            
            {/* 드로어 상단부 */}
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-900 text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white animate-pulse" />
                </div>
                <div>
                  <h4 className="text-sm font-black tracking-tight">{selectedUser.nickname}</h4>
                  <span className="text-[10px] text-slate-300 font-semibold uppercase tracking-wider">User History & Dream Resume</span>
                </div>
              </div>
              <button 
                onClick={() => setSelectedUser(null)}
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 드로어 내용부 */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              
              {/* 가. 기본 계정 요약 프로필 */}
              <div className="space-y-4">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block border-b border-slate-100 pb-1.5">
                  1. 계정 및 라이프타임 요약
                </span>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="text-[9px] text-slate-400 font-bold block">유저 유형</span>
                    <span className="text-xs font-black text-purple-600 block mt-1">
                      {selectedUser.userType === "MEMBER" ? "정식 가입 회원" : "비회원 게스트"}
                    </span>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="text-[9px] text-slate-400 font-bold block">총 구매 금액</span>
                    <span className="text-xs font-black text-slate-800 block mt-1">
                      {selectedUser.totalAmount.toLocaleString()}원 ({selectedUser.orderCount}건)
                    </span>
                  </div>
                </div>
              </div>

              {/* 나. 소셜 인증 상세 */}
              <div className="space-y-3.5 text-xs font-medium">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block border-b border-slate-100 pb-1.5">
                  2. 계정 식별 상세 정보
                </span>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">데이터베이스 ID (UUID)</span>
                  <code className="text-[10px] font-mono text-slate-500">{selectedUser.id}</code>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">계정 / 전화번호</span>
                  <span className="font-bold text-slate-800">{selectedUser.emailOrPhone}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">최초 생성 시각</span>
                  <span className="font-bold text-slate-600">
                    {format(new Date(selectedUser.createdAt), "yyyy-MM-dd HH:mm:ss", { locale: ko })}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">인증 연동 소스</span>
                  <span className="font-bold text-purple-600 uppercase text-[10px]">{selectedUser.provider}</span>
                </div>
              </div>

              {/* 다. 해몽 구매 이력서 */}
              <div className="space-y-4">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block border-b border-slate-100 pb-1.5 flex items-center gap-1">
                  <History className="w-3.5 h-3.5 text-purple-500" />
                  3. 해몽 의뢰 히스토리 ({selectedUser.dreamHistory.length}건)
                </span>

                {selectedUser.dreamHistory.length === 0 ? (
                  <div className="p-6 text-center border border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                    <AlertCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-xs font-bold text-slate-400">가입 후 구매 이력이 존재하지 않습니다.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {selectedUser.dreamHistory.map((item, idx) => (
                      <div key={idx} className="p-4 rounded-2xl border border-slate-200/80 bg-white shadow-xs space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] text-slate-400 font-mono">
                            {format(new Date(item.date), "yyyy-MM-dd HH:mm", { locale: ko })}
                          </span>
                          <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${
                            item.status === "SUCCESS" 
                              ? "bg-green-50 text-green-600" 
                              : item.status === "PENDING"
                              ? "bg-amber-50 text-amber-600"
                              : "bg-red-50 text-red-600"
                          }`}>
                            {item.status === "SUCCESS" ? "결제 승인" : item.status === "PENDING" ? "대기" : "실패"}
                          </span>
                        </div>
                        <p className="text-xs font-bold text-slate-800 truncate">
                          &ldquo; {item.snippet} &rdquo;
                        </p>
                        <div className="flex justify-between items-center text-[10px] pt-1.5 border-t border-slate-50 font-semibold text-slate-500">
                          <span>선택 해몽가: {item.expertStyle}</span>
                          <span className="font-black text-slate-800">{item.amount.toLocaleString()}원</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserListPage;
