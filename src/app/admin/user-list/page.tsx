"use client";

import React, { useState, useEffect, useMemo } from "react";
import { 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  RefreshCw, 
  SlidersHorizontal, 
  User as UserIcon, 
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
  TrendingUp
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

type UserTypeFilter = "ALL" | "MEMBER" | "GUEST";
type PaymentFilter = "ALL" | "PAID" | "UNPAID";
type ProviderFilter = "ALL" | "GOOGLE" | "KAKAO" | "EMAIL" | "GUEST_PHONE";
type SortOption = "date_desc" | "date_asc" | "spending_desc" | "orders_desc" | "name_asc";

const UserListPage = () => {
  // 상태 제어
  const [searchTerm, setSearchTerm] = useState("");
  const [userType, setUserType] = useState<UserTypeFilter>("ALL");
  const [paymentStatus, setPaymentStatus] = useState<PaymentFilter>("ALL");
  const [provider, setProvider] = useState<ProviderFilter>("ALL");
  const [sortBy, setSortBy] = useState<SortOption>("date_desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<UserItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  
  // 상세 사이드 오버/드로어 상태
  const [selectedUser, setSelectedUser] = useState<UserItem | null>(null);

  const itemsPerPage = 8;

  // 실제 백엔드 API로부터 통합 가입 유저 목록 가져오기
  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const queryParams = new URLSearchParams({
        search: searchTerm,
        userType,
        paymentStatus,
        provider,
        sortBy,
        page: currentPage.toString(),
        limit: itemsPerPage.toString()
      });

      const res = await fetch(`/api/admin/users?${queryParams.toString()}`);
      if (!res.ok) throw new Error("Users API fetch failed");
      const json = await res.json();

      setUsers(json.users || []);
      setTotalCount(json.pagination?.totalCount || 0);
      setTotalPages(json.pagination?.totalPages || 1);
    } catch (err) {
      console.error("Users list load failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // 필터 및 페이지 상태 변화에 따른 자동 패치
  useEffect(() => {
    fetchUsers();
  }, [searchTerm, userType, paymentStatus, provider, sortBy, currentPage]);

  // 필터 조건 변경 시 페이지 리셋
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, userType, paymentStatus, provider, sortBy]);

  // 유저 DB 동기화
  const handleRefresh = async () => {
    await fetchUsers();
  };

  // 필터 초기화
  const resetFilters = () => {
    setSearchTerm("");
    setUserType("ALL");
    setPaymentStatus("ALL");
    setProvider("ALL");
    setSortBy("date_desc");
    setCurrentPage(1);
  };

  // 회원 기본 메트릭 통계 집계 (현재 로딩된 페이지와 집계 데이터 기준)
  const stats = useMemo(() => {
    const members = users.filter(u => u.userType === "MEMBER");
    const guests = users.filter(u => u.userType === "GUEST");
    const payingUsers = users.filter(u => u.hasPaid);
    
    return {
      totalUsers: totalCount,
      memberCount: members.length,
      guestCount: guests.length,
      payingCount: payingUsers.length,
      conversionRate: totalCount > 0 ? Math.round((payingUsers.length / users.length) * 100) : 0
    };
  }, [users, totalCount]);

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
                정식 회원 및 비회원 통합 대장
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-50 to-indigo-50 flex items-center justify-center shrink-0">
              <UserIcon className="w-5 h-5 text-purple-500" />
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
      ) : users.length === 0 ? (
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
                  {users.map((user) => (
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
              총 {totalCount}명 중 {(currentPage - 1) * itemsPerPage + 1}-
              {Math.min(currentPage * itemsPerPage, totalCount)}명 표출
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
                  <div className="p-6 border border-dashed border-slate-200 rounded-2xl text-center bg-slate-50/50">
                    <UserX className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-xs font-bold text-slate-500">해몽 거래 원장이 존재하지 않습니다</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {selectedUser.dreamHistory.map((item, idx) => (
                      <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] text-slate-400 font-bold">
                            {format(new Date(item.date), "yyyy-MM-dd HH:mm", { locale: ko })}
                          </span>
                          <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${
                            item.status === "SUCCESS" ? "bg-green-50 text-green-600" : item.status === "PENDING" ? "bg-amber-50 text-amber-600" : "bg-red-50 text-red-600"
                          }`}>
                            {item.status === "SUCCESS" ? "결제성공" : item.status === "PENDING" ? "입금대기" : "결제실패"}
                          </span>
                        </div>
                        <p className="text-xs font-bold text-slate-700 italic">
                          &ldquo; {item.snippet} &rdquo;
                        </p>
                        <div className="flex justify-between items-center text-[10px] pt-1.5 border-t border-slate-200/50">
                          <span className="font-semibold text-slate-400">선택 스타일: <b className="text-purple-600 font-bold">{item.expertStyle}</b></span>
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
