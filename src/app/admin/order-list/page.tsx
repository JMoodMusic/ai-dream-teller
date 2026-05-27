"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  RefreshCw, 
  SlidersHorizontal, 
  Eye, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  ArrowUpDown,
  ShoppingBag,
  TrendingUp,
  FileText,
  UserCheck
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

// 주문 내역 타입 및 인터페이스 정의
interface OrderItem {
  id: string;
  orderNumber: string;
  userType: "MEMBER" | "GUEST";
  buyerInfo: string; // 이메일 또는 마스킹된 전화번호
  expertStyle: string;
  dreamSnippet: string;
  totalAmount: number;
  status: "SUCCESS" | "PENDING" | "FAILED";
  createdAt: string;
  updatedAt: string;
}

type UserTypeFilter = "ALL" | "MEMBER" | "GUEST";
type StatusFilter = "ALL" | "SUCCESS" | "PENDING" | "FAILED";
type ProductFilter = "ALL" | "1500" | "2000";
type SortOption = "date_desc" | "date_asc" | "amount_desc" | "amount_asc";

const OrderListPage = () => {
  // 상태 변수
  const [searchTerm, setSearchTerm] = useState("");
  const [userType, setUserType] = useState<UserTypeFilter>("ALL");
  const [status, setStatus] = useState<StatusFilter>("ALL");
  const [productType, setProductType] = useState<ProductFilter>("ALL");
  const [sortBy, setSortBy] = useState<SortOption>("date_desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const itemsPerPage = 8;

  // 실제 백엔드 API로부터 다중 필터 및 범위 데이터 가져오기
  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const queryParams = new URLSearchParams({
        search: searchTerm,
        userType,
        status,
        productType,
        sortBy,
        page: currentPage.toString(),
        limit: itemsPerPage.toString()
      });

      const res = await fetch(`/api/admin/orders?${queryParams.toString()}`);
      if (!res.ok) throw new Error("Orders API fetch failed");
      const json = await res.json();

      setOrders(json.orders || []);
      setTotalCount(json.pagination?.totalCount || 0);
      setTotalPages(json.pagination?.totalPages || 1);
    } catch (err) {
      console.error("Orders load failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // 필터나 페이지 상태 변경 시 자동 갱신
  useEffect(() => {
    fetchOrders();
  }, [searchTerm, userType, status, productType, sortBy, currentPage]);

  // 필터링 필드 변경 시 페이지를 1페이지로 리셋
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, userType, status, productType, sortBy]);

  // 새로고침
  const handleRefresh = async () => {
    await fetchOrders();
  };

  // 필터 초기화
  const resetFilters = () => {
    setSearchTerm("");
    setUserType("ALL");
    setStatus("ALL");
    setProductType("ALL");
    setSortBy("date_desc");
    setCurrentPage(1);
  };

  // 핵심 지표 집계 계산
  const stats = useMemo(() => {
    const successOrders = orders.filter(o => o.status === "SUCCESS");
    const revenue = successOrders.reduce((sum, o) => sum + o.totalAmount, 0);
    const pendingCount = orders.filter(o => o.status === "PENDING").length;
    const failedCount = orders.filter(o => o.status === "FAILED").length;

    return {
      revenue: revenue || 0,
      successCount: successOrders.length,
      pendingCount,
      failedCount,
      totalCount: totalCount
    };
  }, [orders, totalCount]);

  return (
    <div className="space-y-8">
      {/* 상단 제목 및 컨트롤 */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">
            주문 및 결제 거래 내역
          </h3>
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider block mt-1">
            Real-time transaction auditing and platform sales history
          </p>
        </div>

        <button
          onClick={handleRefresh}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 h-10 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-colors shadow-sm disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
          실시간 동기화
        </button>
      </div>

      {/* 1. 상단 핵심 지표 요약 카드 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white/60 backdrop-blur-sm border-slate-200/60 shadow-sm rounded-3xl overflow-hidden hover:shadow-md transition-shadow">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                조회 기간 실매출
              </span>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                {stats.revenue.toLocaleString()}원
              </h3>
              <p className="text-[11px] text-green-500 font-semibold flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" />
                결제 승인 {stats.successCount}건 완료
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center shrink-0">
              <ShoppingBag className="w-5 h-5 text-emerald-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/60 backdrop-blur-sm border-slate-200/60 shadow-sm rounded-3xl overflow-hidden hover:shadow-md transition-shadow">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                대기 중인 주문
              </span>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                {stats.pendingCount}건
              </h3>
              <p className="text-[11px] text-amber-500 font-semibold flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                토스페이 결제창 이탈 대기
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5 text-amber-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/60 backdrop-blur-sm border-slate-200/60 shadow-sm rounded-3xl overflow-hidden hover:shadow-md transition-shadow">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                이탈 및 실패 건
              </span>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                {stats.failedCount}건
              </h3>
              <p className="text-[11px] text-red-500 font-semibold flex items-center gap-1">
                <XCircle className="w-3.5 h-3.5" />
                잔액 부족 또는 강제 취소
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-50 to-rose-50 flex items-center justify-center shrink-0">
              <XCircle className="w-5 h-5 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/60 backdrop-blur-sm border-slate-200/60 shadow-sm rounded-3xl overflow-hidden hover:shadow-md transition-shadow">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                총 필터링 주문 수
              </span>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                {stats.totalCount}건
              </h3>
              <p className="text-[11px] text-purple-500 font-semibold flex items-center gap-1">
                <UserCheck className="w-3.5 h-3.5" />
                전체 모집단 데이터 세트
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center shrink-0">
              <SlidersHorizontal className="w-5 h-5 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 2. 필터 및 탐색 컨트롤러 패널 */}
      <Card className="bg-white/60 backdrop-blur-sm border-slate-200/60 shadow-sm rounded-3xl p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-purple-600" />
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">주문 내역 상세 다중 필터</h4>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* 검색바 */}
            <div className="relative lg:col-span-2">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="주문번호, 바이어 연락처/이메일, 꿈 키워드..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
              />
            </div>

            {/* 구매자 유형 */}
            <div className="flex flex-col gap-1.5">
              <select
                value={userType}
                onChange={(e) => setUserType(e.target.value as UserTypeFilter)}
                className="w-full h-11 px-3.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
              >
                <option value="ALL">유저유형 (전체)</option>
                <option value="MEMBER">회원 유저</option>
                <option value="GUEST">비회원 게스트</option>
              </select>
            </div>

            {/* 결제 상태 */}
            <div className="flex flex-col gap-1.5">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as StatusFilter)}
                className="w-full h-11 px-3.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
              >
                <option value="ALL">결제상태 (전체)</option>
                <option value="SUCCESS">결제 완료</option>
                <option value="PENDING">결제 진행 중</option>
                <option value="FAILED">결제 실패/취소</option>
              </select>
            </div>

            {/* 상품별 단가 */}
            <div className="flex flex-col gap-1.5">
              <select
                value={productType}
                onChange={(e) => setProductType(e.target.value as ProductFilter)}
                className="w-full h-11 px-3.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
              >
                <option value="ALL">선택 상품 (전체)</option>
                <option value="1500">텍스트 해몽 (1,500원)</option>
                <option value="2000">텍스트 + 이미지 해몽 (2,000원)</option>
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
                <option value="date_desc">최신 결제 순</option>
                <option value="date_asc">오래된 결제 순</option>
                <option value="amount_desc">높은 결제금액 순</option>
                <option value="amount_asc">낮은 결제금액 순</option>
              </select>
            </div>

            {/* 필터 초기화 버튼 */}
            <button
              onClick={resetFilters}
              className="text-xs font-bold text-slate-400 hover:text-purple-600 transition-colors flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" />
              필터링 조건 초기화
            </button>
          </div>
        </div>
      </Card>

      {/* 3. 주문 거래 내역 리스트 표 영역 */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4">
          <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
          <p className="text-slate-500 font-medium animate-pulse">거래 내역 장부를 최신화하고 있습니다...</p>
        </div>
      ) : orders.length === 0 ? (
        <Card className="bg-white/60 backdrop-blur-sm border-slate-200/60 shadow-sm rounded-3xl p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
            <SlidersHorizontal className="w-7 h-7 text-slate-400" />
          </div>
          <h4 className="text-lg font-bold text-slate-800">일치하는 주문 내역이 없습니다</h4>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mt-2">
            검색어를 변경하거나 다른 결제 상태, 유저 분류 필터를 선택해 보시길 권장합니다.
          </p>
          <button
            onClick={resetFilters}
            className="mt-5 h-9 px-5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors shadow-sm"
          >
            모든 검색 필터 해제
          </button>
        </Card>
      ) : (
        <div className="space-y-6">
          <Card className="bg-white/60 backdrop-blur-sm border-slate-200/60 shadow-sm rounded-3xl overflow-hidden p-6">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-xs text-slate-400 font-bold uppercase tracking-wider h-12">
                    <th className="pb-3 pl-2">주문 일시 (정산 시각)</th>
                    <th className="pb-3">주문번호 (Toss ID)</th>
                    <th className="pb-3">구매자 분류</th>
                    <th className="pb-3">구매자 정보 (연락처/ID)</th>
                    <th className="pb-3">선택 스타일</th>
                    <th className="pb-3">꿈 무의식 내용</th>
                    <th className="pb-3">결제 금액</th>
                    <th className="pb-3">거래 상태</th>
                    <th className="pb-3 text-center">관리</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-sm">
                  {orders.map((order) => (
                    <tr key={order.id} className="h-16 hover:bg-slate-50/50 transition-colors">
                      <td className="text-slate-500 font-medium text-xs pl-2 shrink-0">
                        {format(new Date(order.createdAt), "yyyy-MM-dd HH:mm:ss", { locale: ko })}
                      </td>
                      <td className="font-mono text-xs font-bold text-purple-700 max-w-[170px] truncate pr-4">
                        <Link href={`/admin/order-list/${order.id}`} className="hover:underline">
                          {order.orderNumber}
                        </Link>
                      </td>
                      <td>
                        <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                          order.userType === "MEMBER" 
                            ? "bg-purple-50 text-purple-600" 
                            : "bg-blue-50 text-blue-600"
                        }`}>
                          {order.userType === "MEMBER" ? "회원" : "비회원"}
                        </span>
                      </td>
                      <td className="font-bold text-slate-700 max-w-[160px] truncate pr-4">
                        {order.buyerInfo}
                      </td>
                      <td className="font-semibold text-slate-600 text-xs">
                        {order.expertStyle}
                      </td>
                      <td className="font-medium text-slate-500 max-w-[220px] truncate pr-6" title={order.dreamSnippet}>
                        {order.dreamSnippet}
                      </td>
                      <td className="font-black text-slate-900 shrink-0">
                        {order.totalAmount.toLocaleString()}원
                        <span className="text-[9px] text-slate-400 font-semibold block leading-none mt-0.5">
                          {order.totalAmount === 1500 ? "텍스트 기본" : "텍스트 + 이미지"}
                        </span>
                      </td>
                      <td>
                        <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider inline-flex items-center gap-1 ${
                          order.status === "SUCCESS" 
                            ? "bg-green-50 text-green-600" 
                            : order.status === "PENDING"
                            ? "bg-amber-50 text-amber-600"
                            : "bg-red-50 text-red-600"
                        }`}>
                          {order.status === "SUCCESS" ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              결제 승인
                            </>
                          ) : order.status === "PENDING" ? (
                            <>
                              <AlertTriangle className="w-3.5 h-3.5" />
                              입금 대기
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3.5 h-3.5" />
                              결제 실패
                            </>
                          )}
                        </span>
                      </td>
                      <td className="text-center">
                        <Link
                          href={`/admin/order-list/${order.id}`}
                          className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 hover:bg-purple-100 text-slate-500 hover:text-purple-600 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* 4. 하단 페이지네이션 바 */}
          <div className="flex justify-between items-center bg-white/60 backdrop-blur-sm border border-slate-200/60 rounded-2xl px-6 py-4 shadow-sm">
            <span className="text-xs font-bold text-slate-500">
              총 {totalCount}건 중 {(currentPage - 1) * itemsPerPage + 1}-
              {Math.min(currentPage * itemsPerPage, totalCount)}건 표시
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
    </div>
  );
};

export default OrderListPage;
