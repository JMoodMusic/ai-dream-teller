"use client";

import React, { useState, useEffect } from "react";
import { 
  TrendingUp, 
  ShoppingBag, 
  Users, 
  Sparkles, 
  DollarSign,
  Activity,
  Calendar,
  Layers,
  ArrowRight,
  TrendingDown
} from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

// 기간 타입 정의
type PeriodType = "today" | "7d" | "30d" | "year";

// 대시보드 데이터 규격 정의
interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalUsers: number;
  aiSuccessRate: number;
  revenueChange: number; // 전월 또는 전기간 대비 변동율 (%)
  ordersChange: number;
  usersChange: number;
}

interface ChartDataPoint {
  label: string;
  value: number;
}

interface ProductShare {
  name: string;
  count: number;
  revenue: number;
  percentage: number;
  color: string;
}

interface DashboardData {
  stats: DashboardStats;
  chartData: ChartDataPoint[];
  productShares: ProductShare[];
  recentOrders: {
    id: string;
    orderNumber: string;
    totalAmount: number;
    status: "SUCCESS" | "PENDING" | "FAILED";
    createdAt: string;
    dreamSnippet: string;
    userType: "MEMBER" | "GUEST";
  }[];
}

// 각 기간별 고화질 더미 데이터 셋 (인터랙션 피드백용)
const PERIOD_DATA: Record<PeriodType, DashboardData> = {
  today: {
    stats: {
      totalRevenue: 23500,
      totalOrders: 13,
      totalUsers: 9,
      aiSuccessRate: 100,
      revenueChange: 8.5,
      ordersChange: 12.0,
      usersChange: 4.5,
    },
    chartData: [
      { label: "09:00", value: 1500 },
      { label: "11:00", value: 3500 },
      { label: "13:00", value: 5500 },
      { label: "15:00", value: 7500 },
      { label: "17:00", value: 9500 },
      { label: "19:00", value: 15500 },
      { label: "21:00", value: 23500 },
    ],
    productShares: [
      { name: "텍스트 해몽 (1,500원)", count: 5, revenue: 7500, percentage: 32, color: "bg-blue-500" },
      { name: "텍스트 + 이미지 해몽 (2,000원)", count: 8, revenue: 16000, percentage: 68, color: "bg-purple-500" },
    ],
    recentOrders: [
      { id: "ord_t1", orderNumber: "ord_1779607041724_ofn81gc", totalAmount: 1500, status: "SUCCESS", createdAt: "2026-05-24T07:17:21.913Z", dreamSnippet: "지그문트 프로이트를 봤어...", userType: "GUEST" },
      { id: "ord_t2", orderNumber: "ord_1779606750325_y119yld", totalAmount: 2000, status: "SUCCESS", createdAt: "2026-05-24T07:12:32.807Z", dreamSnippet: "삼성전자 인버스에 전재산 박아서 돈...", userType: "GUEST" },
      { id: "ord_t3", orderNumber: "ord_1779606328311_5b7bjjv", totalAmount: 2000, status: "SUCCESS", createdAt: "2026-05-24T07:05:28.699Z", dreamSnippet: "니어 프로토콜 15000원 가는 걸...", userType: "MEMBER" },
    ]
  },
  "7d": {
    stats: {
      totalRevenue: 138000,
      totalOrders: 74,
      totalUsers: 58,
      aiSuccessRate: 98.6,
      revenueChange: 14.2,
      ordersChange: 9.8,
      usersChange: 11.5,
    },
    chartData: [
      { label: "월요일", value: 12000 },
      { label: "화요일", value: 18000 },
      { label: "수요일", value: 15000 },
      { label: "목요일", value: 24000 },
      { label: "금요일", value: 21000 },
      { label: "토요일", value: 31000 },
      { label: "일요일", value: 138000 },
    ],
    productShares: [
      { name: "텍스트 해몽 (1,500원)", count: 28, revenue: 42000, percentage: 30, color: "bg-blue-500" },
      { name: "텍스트 + 이미지 해몽 (2,000원)", count: 46, revenue: 96000, percentage: 70, color: "bg-purple-500" },
    ],
    recentOrders: [
      { id: "ord_7_1", orderNumber: "ord_1779607041724_ofn81gc", totalAmount: 1500, status: "SUCCESS", createdAt: "2026-05-24T07:17:21.913Z", dreamSnippet: "지그문트 프로이트를 봤어...", userType: "GUEST" },
      { id: "ord_7_2", orderNumber: "ord_1779606750325_y119yld", totalAmount: 2000, status: "SUCCESS", createdAt: "2026-05-24T07:12:32.807Z", dreamSnippet: "삼성전자 인버스에 전재산 박아서 돈...", userType: "GUEST" },
      { id: "ord_7_3", orderNumber: "ord_1779606328311_5b7bjjv", totalAmount: 2000, status: "SUCCESS", createdAt: "2026-05-24T07:05:28.699Z", dreamSnippet: "니어 프로토콜 15000원 가는 걸...", userType: "MEMBER" },
      { id: "ord_7_4", orderNumber: "ord_1779419766168_afbj0cr", totalAmount: 2000, status: "SUCCESS", createdAt: "2026-05-22T03:16:06.839Z", dreamSnippet: "돼지랑 같이 앉아서 돼지갈비를...", userType: "GUEST" },
    ]
  },
  "30d": {
    stats: {
      totalRevenue: 546000,
      totalOrders: 298,
      totalUsers: 245,
      aiSuccessRate: 98.3,
      revenueChange: 22.4,
      ordersChange: 18.7,
      usersChange: 24.1,
    },
    chartData: [
      { label: "1주차", value: 98000 },
      { label: "2주차", value: 125000 },
      { label: "3주차", value: 158000 },
      { label: "4주차", value: 546000 },
    ],
    productShares: [
      { name: "텍스트 해몽 (1,500원)", count: 104, revenue: 156000, percentage: 29, color: "bg-blue-500" },
      { name: "텍스트 + 이미지 해몽 (2,000원)", count: 194, revenue: 390000, percentage: 71, color: "bg-purple-500" },
    ],
    recentOrders: [
      { id: "ord_30_1", orderNumber: "ord_1779607041724_ofn81gc", totalAmount: 1500, status: "SUCCESS", createdAt: "2026-05-24T07:17:21.913Z", dreamSnippet: "지그문트 프로이트를 봤어...", userType: "GUEST" },
      { id: "ord_30_2", orderNumber: "ord_1779606750325_y119yld", totalAmount: 2000, status: "SUCCESS", createdAt: "2026-05-24T07:12:32.807Z", dreamSnippet: "삼성전자 인버스에 전재산 박아서 돈...", userType: "GUEST" },
      { id: "ord_30_3", orderNumber: "ord_1779606328311_5b7bjjv", totalAmount: 2000, status: "SUCCESS", createdAt: "2026-05-24T07:05:28.699Z", dreamSnippet: "니어 프로토콜 15000원 가는 걸...", userType: "MEMBER" },
    ]
  },
  year: {
    stats: {
      totalRevenue: 4890000,
      totalOrders: 2610,
      totalUsers: 2180,
      aiSuccessRate: 98.9,
      revenueChange: 45.8,
      ordersChange: 38.2,
      usersChange: 42.0,
    },
    chartData: [
      { label: "1분기", value: 890000 },
      { label: "2분기", value: 1340000 },
      { label: "3분기", value: 1120000 },
      { label: "4분기", value: 4890000 },
    ],
    productShares: [
      { name: "텍스트 해몽 (1,500원)", count: 850, revenue: 1275000, percentage: 26, color: "bg-blue-500" },
      { name: "텍스트 + 이미지 해몽 (2,000원)", count: 1760, revenue: 3615000, percentage: 74, color: "bg-purple-500" },
    ],
    recentOrders: [
      { id: "ord_y1", orderNumber: "ord_1779607041724_ofn81gc", totalAmount: 1500, status: "SUCCESS", createdAt: "2026-05-24T07:17:21.913Z", dreamSnippet: "지그문트 프로이트를 봤어...", userType: "GUEST" },
      { id: "ord_y2", orderNumber: "ord_1779606750325_y119yld", totalAmount: 2000, status: "SUCCESS", createdAt: "2026-05-24T07:12:32.807Z", dreamSnippet: "삼성전자 인버스에 전재산 박아서 돈...", userType: "GUEST" },
    ]
  }
};

// TODO: 추후 백엔드 어드민 대시보드 API(/api/admin/dashboard?period=...) 연동 시 React Query 또는 SWR 등 캐싱 기법 적용 (FIX: API 쿼리 파라미터 유효성 검사 필수)
const AdminDashboardPage = () => {
  const [activePeriod, setActivePeriod] = useState<PeriodType>("7d");
  const [data, setData] = useState<DashboardData>(PERIOD_DATA["7d"]);
  const [isLoading, setIsLoading] = useState(false);
  const [hoveredBarIndex, setHoveredBarIndex] = useState<number | null>(null);

  // 기간 전환 시 데이터 바인딩 시뮬레이션
  useEffect(() => {
    const loadPeriodData = async () => {
      try {
        setIsLoading(true);
        // TODO: 실제 백엔드 API 요청 시: const res = await fetch(`/api/admin/dashboard?period=${activePeriod}`);
        // 시뮬레이션을 위해 짧은 딜레이 추가
        await new Promise((resolve) => setTimeout(resolve, 300));
        setData(PERIOD_DATA[activePeriod]);
      } catch (err) {
        console.error("Dashboard loading error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadPeriodData();
  }, [activePeriod]);

  // 차트 렌더링에 사용할 최대값 및 계산 변수들
  const maxChartValue = Math.max(...data.chartData.map((d) => d.value), 1000);

  return (
    <div className="space-y-8">
      {/* 상단 컨트롤 바 */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">
            매출 및 비즈니스 분석
          </h3>
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider block mt-1">
            Periodical sales audit and platform key performance indicators
          </p>
        </div>

        {/* 기간 필터링 컨트롤러 */}
        <div className="flex items-center gap-1.5 p-1.5 bg-white/60 backdrop-blur-sm border border-slate-200/60 rounded-2xl shadow-sm">
          {(["today", "7d", "30d", "year"] as PeriodType[]).map((p) => (
            <button
              key={p}
              onClick={() => setActivePeriod(p)}
              className={`h-9 px-4 rounded-xl text-xs font-bold transition-all duration-200 ${
                activePeriod === p
                  ? "bg-slate-900 text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
              }`}
            >
              {p === "today" ? "오늘" : p === "7d" ? "7일" : p === "30d" ? "30일" : "올해"}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
          <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
          <p className="text-slate-500 font-medium animate-pulse">매출 통계 분석 데이터를 연산하고 있습니다...</p>
        </div>
      ) : (
        <>
          {/* 1. 통계 메트릭 카드 영역 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* 총 매출 */}
            <Card className="bg-white/60 backdrop-blur-sm border-slate-200/60 shadow-sm rounded-3xl overflow-hidden hover:shadow-md transition-shadow">
              <CardContent className="p-6 flex items-center justify-between">
                <div className="space-y-1.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                    조회 기간 총 매출
                  </span>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                    {data.stats.totalRevenue.toLocaleString()}원
                  </h3>
                  <p className={`text-[11px] font-semibold flex items-center gap-1 ${
                    data.stats.revenueChange >= 0 ? "text-green-500" : "text-red-500"
                  }`}>
                    {data.stats.revenueChange >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                    이전 대비 {Math.abs(data.stats.revenueChange)}% {data.stats.revenueChange >= 0 ? "상승" : "하락"}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center shrink-0">
                  <DollarSign className="w-6 h-6 text-emerald-500" />
                </div>
              </CardContent>
            </Card>

            {/* 총 주문 수 */}
            <Card className="bg-white/60 backdrop-blur-sm border-slate-200/60 shadow-sm rounded-3xl overflow-hidden hover:shadow-md transition-shadow">
              <CardContent className="p-6 flex items-center justify-between">
                <div className="space-y-1.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                    총 주문 수
                  </span>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                    {data.stats.totalOrders.toLocaleString()}건
                  </h3>
                  <p className={`text-[11px] font-semibold flex items-center gap-1 ${
                    data.stats.ordersChange >= 0 ? "text-green-500" : "text-red-500"
                  }`}>
                    {data.stats.ordersChange >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                    주문량 {Math.abs(data.stats.ordersChange)}% {data.stats.ordersChange >= 0 ? "증가" : "감소"}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center shrink-0">
                  <ShoppingBag className="w-6 h-6 text-purple-500" />
                </div>
              </CardContent>
            </Card>

            {/* 신규 유저 수 */}
            <Card className="bg-white/60 backdrop-blur-sm border-slate-200/60 shadow-sm rounded-3xl overflow-hidden hover:shadow-md transition-shadow">
              <CardContent className="p-6 flex items-center justify-between">
                <div className="space-y-1.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                    신규 가입 및 방문 유저
                  </span>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                    {data.stats.totalUsers.toLocaleString()}명
                  </h3>
                  <p className={`text-[11px] font-semibold flex items-center gap-1 ${
                    data.stats.usersChange >= 0 ? "text-green-500" : "text-red-500"
                  }`}>
                    {data.stats.usersChange >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                    유저 증가율 {Math.abs(data.stats.usersChange)}%
                  </p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center shrink-0">
                  <Users className="w-6 h-6 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            {/* AI 해몽 성공률 */}
            <Card className="bg-white/60 backdrop-blur-sm border-slate-200/60 shadow-sm rounded-3xl overflow-hidden hover:shadow-md transition-shadow">
              <CardContent className="p-6 flex items-center justify-between">
                <div className="space-y-1.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                    AI 해몽 시스템 안정성
                  </span>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                    {data.stats.aiSuccessRate}%
                  </h3>
                  <p className="text-[11px] text-indigo-500 font-semibold flex items-center gap-1">
                    <Activity className="w-3.5 h-3.5" />
                    오류율 1.5% 미만 통제됨
                  </p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-50 to-rose-50 flex items-center justify-center shrink-0">
                  <Sparkles className="w-6 h-6 text-pink-500 animate-pulse" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 2. 매출 트렌드 시각화 차트 및 점유율 분석 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* 고품질 커스텀 매출 차트 영역 (2/3 너비) */}
            <div className="lg:col-span-2 space-y-4">
              <h4 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <Calendar className="w-5 h-5 text-purple-500" />
                매출 흐름 및 누적 분석
              </h4>
              
              <Card className="bg-white/60 backdrop-blur-sm border-slate-200/60 shadow-sm rounded-3xl overflow-hidden p-8 flex flex-col justify-between h-[360px]">
                {/* Y축 그리드선 및 막대 그래프 영역 */}
                <div className="flex-1 flex items-end gap-6 relative w-full h-[220px] px-2">
                  {/* Y축 가이드선 */}
                  <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                    {[0, 1, 2, 3].map((i) => (
                      <div 
                        key={i} 
                        className="w-full border-t border-slate-100/80 flex justify-end text-[10px] text-slate-300 font-semibold pt-1"
                      >
                        {Math.round((maxChartValue / 3) * (3 - i)).toLocaleString()}원
                      </div>
                    ))}
                  </div>

                  {/* 실제 막대 그래프 렌더링 */}
                  <div className="flex-1 h-[200px] flex items-end justify-between relative z-10 w-full">
                    {data.chartData.map((d, index) => {
                      const barHeight = `${(d.value / maxChartValue) * 100}%`;
                      const isHovered = hoveredBarIndex === index;

                      return (
                        <div 
                          key={d.label} 
                          className="flex-1 flex flex-col items-center group cursor-pointer relative h-full justify-end"
                          onMouseEnter={() => setHoveredBarIndex(index)}
                          onMouseLeave={() => setHoveredBarIndex(null)}
                        >
                          {/* 호버 시 툴팁 말풍선 */}
                          {isHovered && (
                            <div className="absolute top-0 z-30 bg-slate-900 text-white font-bold text-[10px] px-3 py-1.5 rounded-xl shadow-lg border border-slate-800 -translate-y-full flex flex-col items-center">
                              <span>{d.value.toLocaleString()}원</span>
                              <div className="w-1.5 h-1.5 bg-slate-900 rotate-45 -mt-0.5" />
                            </div>
                          )}

                          {/* 막대 바 */}
                          <div 
                            className={`w-[45%] rounded-t-xl transition-all duration-300 relative ${
                              isHovered 
                                ? "bg-gradient-to-t from-purple-600 to-pink-500 shadow-md shadow-purple-500/20 scale-x-105" 
                                : "bg-gradient-to-t from-purple-200 to-pink-100 hover:from-purple-300 hover:to-pink-200"
                            }`}
                            style={{ height: barHeight }}
                          >
                            {/* 최상단 화려한 빛 효과 */}
                            <div className="absolute top-0 left-0 w-full h-1 bg-white/40 rounded-t-xl" />
                          </div>
                          
                          {/* 하단 X축 라벨 */}
                          <span className="text-[10px] text-slate-400 font-bold mt-2.5 truncate max-w-[50px]">
                            {d.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </Card>
            </div>

            {/* 상품 매출 구성비 및 점유율 파이 차트 영역 (1/3 너비) */}
            <div className="space-y-4">
              <h4 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <Layers className="w-5 h-5 text-pink-500" />
                상품별 매출 기여도
              </h4>

              <Card className="bg-white/60 backdrop-blur-sm border-slate-200/60 shadow-sm rounded-3xl overflow-hidden p-6 h-[360px] flex flex-col justify-between">
                
                {/* SVG 기반 커스텀 도넛 차트 */}
                <div className="flex items-center justify-center flex-1">
                  <div className="relative w-36 h-36">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                      {/* 배경 도넛 */}
                      <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f1f5f9" strokeWidth="3.8" />
                      
                      {/* 텍스트 해몽 쉐어 (Blue) */}
                      <circle 
                        cx="18" 
                        cy="18" 
                        r="15.915" 
                        fill="none" 
                        stroke="#3b82f6" 
                        strokeWidth="4" 
                        strokeDasharray={`${data.productShares[0].percentage} ${100 - data.productShares[0].percentage}`}
                        strokeDashoffset="0"
                        className="transition-all duration-1000"
                      />

                      {/* 텍스트 + 이미지 해몽 쉐어 (Purple) */}
                      <circle 
                        cx="18" 
                        cy="18" 
                        r="15.915" 
                        fill="none" 
                        stroke="#a855f7" 
                        strokeWidth="4" 
                        strokeDasharray={`${data.productShares[1].percentage} ${100 - data.productShares[1].percentage}`}
                        strokeDashoffset={`${100 - data.productShares[0].percentage}`}
                        className="transition-all duration-1000"
                      />
                    </svg>

                    {/* 중앙 총합 레이아웃 */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-transparent">
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block leading-none">
                        이미지 비중
                      </span>
                      <span className="text-xl font-black text-slate-900 tracking-tight mt-1">
                        {data.productShares[1].percentage}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* 상품 구성 내역 리스트 */}
                <div className="space-y-3.5 pt-4 border-t border-slate-100">
                  {data.productShares.map((item) => (
                    <div key={item.name} className="flex items-start justify-between">
                      <div className="flex gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${item.color} shrink-0 mt-1`} />
                        <div className="space-y-0.5">
                          <p className="text-xs font-bold text-slate-800 leading-none">
                            {item.name}
                          </p>
                          <span className="text-[10px] text-slate-400 font-semibold block">
                            총 {item.count}건 결제 완료
                          </span>
                        </div>
                      </div>
                      <span className="text-xs font-black text-slate-800 shrink-0">
                        {item.revenue.toLocaleString()}원 ({item.percentage}%)
                      </span>
                    </div>
                  ))}
                </div>

              </Card>
            </div>

          </div>

          {/* 3. 최근 결제 내역 퀵 뷰 */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-purple-500" />
                실시간 주문 거래 모니터링
              </h4>
              <Link 
                href="/admin/order-list" 
                className="text-xs text-purple-600 hover:text-purple-700 font-bold flex items-center gap-1 transition-colors"
              >
                전체 주문 내역 보러가기
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <Card className="bg-white/60 backdrop-blur-sm border-slate-200/60 shadow-sm rounded-3xl overflow-hidden p-6">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-xs text-slate-400 font-bold uppercase tracking-wider h-10">
                      <th>주문번호</th>
                      <th>결제 시점</th>
                      <th>해몽 대상 (무의식 내용)</th>
                      <th>총 결제 가격</th>
                      <th>유저유형</th>
                      <th>거래 상태</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 text-sm">
                    {data.recentOrders.map((order) => (
                      <tr key={order.id} className="h-14 hover:bg-slate-50/50 transition-colors">
                        <td className="font-mono text-xs font-bold text-purple-700 max-w-[150px] truncate">
                          <Link href={`/admin/order-list/${order.id}`} className="hover:underline">
                            {order.orderNumber}
                          </Link>
                        </td>
                        <td className="text-slate-500 font-medium text-xs">
                          {format(new Date(order.createdAt), "yyyy-MM-dd HH:mm:ss", { locale: ko })}
                        </td>
                        <td className="font-medium text-slate-700 max-w-[240px] truncate">
                          {order.dreamSnippet}
                        </td>
                        <td className="font-bold text-slate-800">
                          {order.totalAmount.toLocaleString()}원
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
                        <td>
                          <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                            order.status === "SUCCESS" 
                              ? "bg-green-50 text-green-600" 
                              : "bg-red-50 text-red-600"
                          }`}>
                            {order.status === "SUCCESS" ? "결제 완료" : "실패"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboardPage;
