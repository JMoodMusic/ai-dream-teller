"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { 
  Search, 
  Filter, 
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

// 주문 내역 타입 및 인터페이스 명확히 정의
interface OrderItem {
  id: string;
  orderNumber: string;
  userType: "MEMBER" | "GUEST";
  buyerInfo: string; // 이메일 또는 전화번호
  expertStyle: string;
  dreamSnippet: string;
  totalAmount: number;
  status: "SUCCESS" | "PENDING" | "FAILED";
  createdAt: string;
  updatedAt: string;
}

// 기간 및 필터 타입 정의
type UserTypeFilter = "ALL" | "MEMBER" | "GUEST";
type StatusFilter = "ALL" | "SUCCESS" | "PENDING" | "FAILED";
type ProductFilter = "ALL" | "1500" | "2000";
type SortOption = "date_desc" | "date_asc" | "amount_desc" | "amount_asc";

// 고해상도 더미 데이터 (비즈니스 거래 감사 모니터링 시뮬레이션용)
const MOCK_ORDERS: OrderItem[] = [
  {
    id: "ord_1",
    orderNumber: "ord_1779607041724_ofn81gc",
    userType: "GUEST",
    buyerInfo: "010-1234-5107",
    expertStyle: "프로이트",
    dreamSnippet: "지그문트 프로이트를 봤어... 그가 나에게 꿈의 해석 책을 건네주며 조용히 미소를 지었지.",
    totalAmount: 1500,
    status: "SUCCESS",
    createdAt: "2026-05-24T07:17:21.913Z",
    updatedAt: "2026-05-24T07:17:25.102Z"
  },
  {
    id: "ord_2",
    orderNumber: "ord_1779606750325_y119yld",
    userType: "GUEST",
    buyerInfo: "010-9876-5432",
    expertStyle: "칼 융",
    dreamSnippet: "삼성전자 인버스에 전재산 박아서 돈을 다 잃고 한강 다리에 가 있었어. 근데 거대한 황금 물고기가 물속에서 나타나...",
    totalAmount: 2000,
    status: "SUCCESS",
    createdAt: "2026-05-24T07:12:32.807Z",
    updatedAt: "2026-05-24T07:13:02.409Z"
  },
  {
    id: "ord_3",
    orderNumber: "ord_1779606328311_5b7bjjv",
    userType: "MEMBER",
    buyerInfo: "user1@dreamer.com",
    expertStyle: "아들러",
    dreamSnippet: "니어 프로토콜 코인이 15000원 가는 걸 꿈에서 보고 영차영차 외치면서 사람들 틈에서 신나게 춤을 췄어.",
    totalAmount: 2000,
    status: "SUCCESS",
    createdAt: "2026-05-24T07:05:28.699Z",
    updatedAt: "2026-05-24T07:05:59.112Z"
  },
  {
    id: "ord_4",
    orderNumber: "ord_1779419766168_afbj0cr",
    userType: "GUEST",
    buyerInfo: "010-4321-8765",
    expertStyle: "프로이트",
    dreamSnippet: "돼지랑 같이 안방에 나란히 앉아서 돼지갈비를 아주 맛있게 구워 먹는 꿈을 꿨어. 근데 돼지가 나를 보며 자꾸 우는거야.",
    totalAmount: 2000,
    status: "SUCCESS",
    createdAt: "2026-05-22T03:16:06.839Z",
    updatedAt: "2026-05-22T03:16:45.922Z"
  },
  {
    id: "ord_5",
    orderNumber: "ord_1779311029482_dk18vja",
    userType: "MEMBER",
    buyerInfo: "richdreamer@gmail.com",
    expertStyle: "칼 융",
    dreamSnippet: "하늘을 휠휠 날면서 끝없는 태평양 바다를 내려다봤는데 바다가 온통 번쩍이는 황금빛 액체로 가득 차 있어서 황홀했어.",
    totalAmount: 1500,
    status: "SUCCESS",
    createdAt: "2026-05-21T11:22:09.112Z",
    updatedAt: "2026-05-21T11:22:30.400Z"
  },
  {
    id: "ord_6",
    orderNumber: "ord_1779218294819_al921jx",
    userType: "MEMBER",
    buyerInfo: "nightmare@daum.net",
    expertStyle: "프로이트",
    dreamSnippet: "칠흑 같은 어둠 속에서 정체불명의 괴물이 나를 쫓아와서 필사적으로 달렸는데 다리가 진흙 속에 갇힌 것처럼 움직이지 않았어.",
    totalAmount: 2000,
    status: "FAILED",
    createdAt: "2026-05-20T22:45:11.890Z",
    updatedAt: "2026-05-20T22:46:00.129Z"
  },
  {
    id: "ord_7",
    orderNumber: "ord_1779109283921_pq294mx",
    userType: "GUEST",
    buyerInfo: "010-8888-9999",
    expertStyle: "아들러",
    dreamSnippet: "은색 우주선을 타고 화성에 내렸는데 이상한 외계인들이 나에게 꽃다발을 주며 환영 인사를 하고 성대한 뷔페를 열어줬어.",
    totalAmount: 1500,
    status: "SUCCESS",
    createdAt: "2026-05-19T14:15:30.412Z",
    updatedAt: "2026-05-19T14:16:01.881Z"
  },
  {
    id: "ord_8",
    orderNumber: "ord_1779018293021_zk9281a",
    userType: "MEMBER",
    buyerInfo: "snowy@naver.com",
    expertStyle: "칼 융",
    dreamSnippet: "하얀 눈이 온 세상에 소복하게 펑펑 내리는 날, 숲속에서 길을 잃었는데 저 멀리서 아늑한 모닥불과 따뜻한 오두막 불빛이 보였어.",
    totalAmount: 2000,
    status: "PENDING",
    createdAt: "2026-05-18T10:05:12.900Z",
    updatedAt: "2026-05-18T10:05:12.900Z"
  },
  {
    id: "ord_9",
    orderNumber: "ord_1778902839481_sk9284j",
    userType: "GUEST",
    buyerInfo: "010-5555-4444",
    expertStyle: "프로이트",
    dreamSnippet: "중요한 대입 시험장에 들어갔는데 연필과 지우개가 모두 모래처럼 부러져 있어서 당황하다가 식은땀을 흘리며 잠에서 깼어.",
    totalAmount: 1500,
    status: "SUCCESS",
    createdAt: "2026-05-17T09:12:45.312Z",
    updatedAt: "2026-05-17T09:13:20.192Z"
  },
  {
    id: "ord_10",
    orderNumber: "ord_1778819283948_dk928jx",
    userType: "MEMBER",
    buyerInfo: "jumper@dream.com",
    expertStyle: "아들러",
    dreamSnippet: "서울의 100층 높이 빌딩 꼭대기에서 와이어도 없이 번지점프를 하는데 전혀 두렵지 않고 넓은 하늘을 완전히 정복한 기분이었어.",
    totalAmount: 2000,
    status: "SUCCESS",
    createdAt: "2026-05-16T18:34:20.198Z",
    updatedAt: "2026-05-16T18:35:01.002Z"
  },
  {
    id: "ord_11",
    orderNumber: "ord_1778729381928_xk291la",
    userType: "GUEST",
    buyerInfo: "010-2222-3333",
    expertStyle: "프로이트",
    dreamSnippet: "가장 아끼는 명품 가방을 고속버스 짐칸에 버려두고 내려서 버스를 찾기 위해 미친듯이 뒤쫓아 뛰어가는 고통스러운 꿈.",
    totalAmount: 1500,
    status: "FAILED",
    createdAt: "2026-05-15T15:20:10.512Z",
    updatedAt: "2026-05-15T15:21:00.320Z"
  },
  {
    id: "ord_12",
    orderNumber: "ord_1778619283918_sk921jx",
    userType: "MEMBER",
    buyerInfo: "moses@dreamer.net",
    expertStyle: "칼 융",
    dreamSnippet: "엄청나게 거대한 초대형 쓰나미가 덮쳐오는데 내가 손을 내밀며 지휘하자 바닷물이 쩍 갈라지며 양쪽으로 솟구치는 기적을 맛봤어.",
    totalAmount: 2000,
    status: "SUCCESS",
    createdAt: "2026-05-14T11:45:00.829Z",
    updatedAt: "2026-05-14T11:45:45.109Z"
  },
  {
    id: "ord_13",
    orderNumber: "ord_1778509283921_lk9231a",
    userType: "GUEST",
    buyerInfo: "010-7777-7777",
    expertStyle: "아들러",
    dreamSnippet: "청와대 같은 웅장한 집무실에서 대통령과 기분 좋게 악수를 나누고 내 가슴팍에 직접 금빛 공로 훈장을 수여해 주시는 꿈.",
    totalAmount: 1500,
    status: "SUCCESS",
    createdAt: "2026-05-13T08:12:09.198Z",
    updatedAt: "2026-05-13T08:12:35.409Z"
  },
  {
    id: "ord_14",
    orderNumber: "ord_1778418293819_ak9211z",
    userType: "MEMBER",
    buyerInfo: "teeth_lost@gmail.com",
    expertStyle: "프로이트",
    dreamSnippet: "앞니와 어금니가 몽땅 우수수 부러져 빠지며 입 안 전체가 붉은 선혈로 가득 차는 꿈을 꿔서 현실로 깨어난 후에도 멍하니 울었어.",
    totalAmount: 2000,
    status: "SUCCESS",
    createdAt: "2026-05-12T05:34:11.900Z",
    updatedAt: "2026-05-12T05:34:55.201Z"
  },
  {
    id: "ord_15",
    orderNumber: "ord_1778309283911_pk9284a",
    userType: "MEMBER",
    buyerInfo: "lucky_lotto@naver.com",
    expertStyle: "칼 융",
    dreamSnippet: "돌아가신 외할머니께서 온화하게 웃으시며 오만원 짜리 지폐가 다발로 꽉꽉 들어차 있는 보따리를 품 안에 안겨주셨어.",
    totalAmount: 1500,
    status: "SUCCESS",
    createdAt: "2026-05-11T23:56:00.298Z",
    updatedAt: "2026-05-11T23:56:30.122Z"
  }
];

// TODO: 추후 관리자용 주문 API(/api/admin/orders) 연동 시 SWR 또는 React Query 적용 (FIX: 무한 스크롤 및 필터링 시 파라미터 매핑 유효성 보장)
const OrderListPage = () => {
  // 상태 변수
  const [searchTerm, setSearchTerm] = useState("");
  const [userType, setUserType] = useState<UserTypeFilter>("ALL");
  const [status, setStatus] = useState<StatusFilter>("ALL");
  const [productType, setProductType] = useState<ProductFilter>("ALL");
  const [sortBy, setSortBy] = useState<SortOption>("date_desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [orders, setOrders] = useState<OrderItem[]>(MOCK_ORDERS);

  const itemsPerPage = 8;

  // 필터링 및 서치, 정렬 로직 (반응성 향상을 위한 useMemo 적용)
  const filteredAndSortedOrders = useMemo(() => {
    let result = [...orders];

    // 1. 검색어 필터링 (주문번호, 바이어 정보, 꿈 요약 등 교차 검색)
    if (searchTerm.trim() !== "") {
      const lowerSearch = searchTerm.toLowerCase();
      result = result.filter(o => 
        o.orderNumber.toLowerCase().includes(lowerSearch) ||
        o.buyerInfo.toLowerCase().includes(lowerSearch) ||
        o.dreamSnippet.toLowerCase().includes(lowerSearch) ||
        o.expertStyle.toLowerCase().includes(lowerSearch)
      );
    }

    // 2. 유저 유형 필터링
    if (userType !== "ALL") {
      result = result.filter(o => o.userType === userType);
    }

    // 3. 결제 상태 필터링
    if (status !== "ALL") {
      result = result.filter(o => o.status === status);
    }

    // 4. 상품 단가 필터링 (1500원: 텍스트 해몽, 2000원: 텍스트+이미지 해몽)
    if (productType !== "ALL") {
      result = result.filter(o => o.totalAmount === parseInt(productType));
    }

    // 5. 정렬 처리
    if (sortBy === "date_desc") {
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortBy === "date_asc") {
      result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    } else if (sortBy === "amount_desc") {
      result.sort((a, b) => b.totalAmount - a.totalAmount);
    } else if (sortBy === "amount_asc") {
      result.sort((a, b) => a.totalAmount - b.totalAmount);
    }

    return result;
  }, [orders, searchTerm, userType, status, productType, sortBy]);

  // 페이지네이션 가공 데이터
  const paginatedOrders = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedOrders.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedOrders, currentPage]);

  const totalPages = Math.max(Math.ceil(filteredAndSortedOrders.length / itemsPerPage), 1);

  // 필터 변경 시 현재 페이지 1페이지로 리셋
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, userType, status, productType, sortBy]);

  // 실시간 새로고침 시뮬레이션
  const handleRefresh = async () => {
    try {
      setIsLoading(true);
      // TODO: 실제 백엔드 API 연동 시 fetch(`/api/admin/orders`) 호출
      await new Promise(resolve => setTimeout(resolve, 500));
      setOrders(MOCK_ORDERS);
      setCurrentPage(1);
    } catch (error) {
      console.error("주문 목록을 새로 불러오는 중 오류 발생:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 필터 초기화
  const resetFilters = () => {
    setSearchTerm("");
    setUserType("ALL");
    setStatus("ALL");
    setProductType("ALL");
    setSortBy("date_desc");
  };

  // 핵심 통계 계산
  const stats = useMemo(() => {
    const successOrders = filteredAndSortedOrders.filter(o => o.status === "SUCCESS");
    const totalRevenue = successOrders.reduce((sum, o) => sum + o.totalAmount, 0);
    const pendingCount = filteredAndSortedOrders.filter(o => o.status === "PENDING").length;
    const failedCount = filteredAndSortedOrders.filter(o => o.status === "FAILED").length;
    
    return {
      revenue: totalRevenue,
      successCount: successOrders.length,
      pendingCount,
      failedCount,
      totalCount: filteredAndSortedOrders.length
    };
  }, [filteredAndSortedOrders]);

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
      ) : filteredAndSortedOrders.length === 0 ? (
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
                  {paginatedOrders.map((order) => (
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
                              <CheckCircle2 className="w-3 h-3" />
                              결제 승인
                            </>
                          ) : order.status === "PENDING" ? (
                            <>
                              <AlertTriangle className="w-3 h-3" />
                              입금 대기
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3 h-3" />
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
              총 {filteredAndSortedOrders.length}건 중 {(currentPage - 1) * itemsPerPage + 1}-
              {Math.min(currentPage * itemsPerPage, filteredAndSortedOrders.length)}건 표시
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
