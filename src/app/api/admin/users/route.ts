import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { checkAdminAccess, maskPhoneNumber } from "@/lib/supabase/admin-auth";

export async function GET(request: Request) {
  try {
    // 1. 어드민 권한 검증
    const { authorized, errorResponse } = await checkAdminAccess();
    if (!authorized) return errorResponse!;

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const userType = searchParams.get("userType") || "ALL";
    const paymentStatus = searchParams.get("paymentStatus") || "ALL";
    const provider = searchParams.get("provider") || "ALL";
    const sortBy = searchParams.get("sortBy") || "date_desc";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "8");

    const adminSupabase = createAdminClient();

    // A. 회원 정보(profiles) 전체 및 관련 주문 내역 조회
    const { data: rawProfiles, error: profileErr } = await adminSupabase
      .from("profiles")
      .select(`
        id,
        email,
        nickname,
        provider,
        created_at,
        orders (
          id,
          total_amount,
          status,
          created_at,
          dreams (
            expert_style,
            dream_content
          )
        )
      `);

    if (profileErr) throw profileErr;

    // B. 비회원 정보(guests) 전체 및 관련 주문 내역 조회
    const { data: rawGuests, error: guestErr } = await adminSupabase
      .from("guests")
      .select(`
        id,
        phone_number,
        created_at,
        orders (
          id,
          total_amount,
          status,
          created_at,
          dreams (
            expert_style,
            dream_content
          )
        )
      `);

    if (guestErr) throw guestErr;

    // C. 통합 데이터 구조 매핑 (회원 + 비회원)
    const membersList = (rawProfiles || []).map((p: any) => {
      const orders = p.orders || [];
      const successOrders = orders.filter((o: any) => o.status === "SUCCESS");
      
      const orderCount = successOrders.length;
      const totalAmount = successOrders.reduce((sum: number, o: any) => sum + o.total_amount, 0);
      const hasPaid = orderCount > 0;

      const dreamHistory = orders.map((o: any) => {
        const dream = o.dreams?.[0] || o.dreams || {};
        const content = dream.dream_content || "";
        const snippet = content.length > 25 ? content.substring(0, 25) + "..." : content;
        return {
          date: o.created_at,
          expertStyle: dream.expert_style || "N/A",
          snippet: snippet || "꿈 내용 요약 없음",
          amount: o.total_amount,
          status: o.status
        };
      });

      return {
        id: p.id,
        emailOrPhone: p.email || "Unknown Email",
        nickname: p.nickname || p.email?.split("@")[0] || "회원유저",
        userType: "MEMBER" as const,
        provider: (p.provider || "email") as any,
        createdAt: p.created_at,
        orderCount,
        totalAmount,
        hasPaid,
        dreamHistory
      };
    });

    const guestsList = (rawGuests || []).map((g: any) => {
      const orders = g.orders || [];
      const successOrders = orders.filter((o: any) => o.status === "SUCCESS");

      const orderCount = successOrders.length;
      const totalAmount = successOrders.reduce((sum: number, o: any) => sum + o.total_amount, 0);
      const hasPaid = orderCount > 0;

      const dreamHistory = orders.map((o: any) => {
        const dream = o.dreams?.[0] || o.dreams || {};
        const content = dream.dream_content || "";
        const snippet = content.length > 25 ? content.substring(0, 25) + "..." : content;
        return {
          date: o.created_at,
          expertStyle: dream.expert_style || "N/A",
          snippet: snippet || "꿈 내용 요약 없음",
          amount: o.total_amount,
          status: o.status
        };
      });

      return {
        id: g.id,
        emailOrPhone: maskPhoneNumber(g.phone_number),
        rawPhone: g.phone_number || "",
        nickname: `비회원_${g.phone_number?.slice(-4) || "GUEST"}`,
        userType: "GUEST" as const,
        provider: "guest_phone" as const,
        createdAt: g.created_at,
        orderCount,
        totalAmount,
        hasPaid,
        dreamHistory
      };
    });

    // 두 리스트 통합
    let combinedUsers = [...membersList, ...guestsList];

    // D. 검색 필터 적용 (이메일, 연락처, 닉네임)
    if (search.trim() !== "") {
      const lower = search.toLowerCase();
      combinedUsers = combinedUsers.filter(u => 
        u.emailOrPhone.toLowerCase().includes(lower) ||
        u.nickname.toLowerCase().includes(lower) ||
        u.id.toLowerCase().includes(lower) ||
        (u.userType === "GUEST" && (u as any).rawPhone?.toLowerCase().includes(lower))
      );
    }

    // E. 회원 유형 필터
    if (userType !== "ALL") {
      combinedUsers = combinedUsers.filter(u => u.userType === userType);
    }

    // F. 결제 이력 유무 필터
    if (paymentStatus !== "ALL") {
      if (paymentStatus === "PAID") {
        combinedUsers = combinedUsers.filter(u => u.hasPaid === true);
      } else {
        combinedUsers = combinedUsers.filter(u => u.hasPaid === false);
      }
    }

    // G. 가입 제공자(인증수단) 필터
    if (provider !== "ALL") {
      combinedUsers = combinedUsers.filter(u => u.provider.toUpperCase() === provider);
    }

    // H. 정렬 적용
    if (sortBy === "date_desc") {
      combinedUsers.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortBy === "date_asc") {
      combinedUsers.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    } else if (sortBy === "spending_desc") {
      combinedUsers.sort((a, b) => b.totalAmount - a.totalAmount);
    } else if (sortBy === "orders_desc") {
      combinedUsers.sort((a, b) => b.orderCount - a.orderCount);
    } else if (sortBy === "name_asc") {
      combinedUsers.sort((a, b) => a.nickname.localeCompare(b.nickname, "ko"));
    }

    // I. 페이지네이션 처리
    const totalCount = combinedUsers.length;
    const totalPages = Math.max(Math.ceil(totalCount / limit), 1);
    const startIndex = (page - 1) * limit;
    const paginatedUsers = combinedUsers.slice(startIndex, startIndex + limit);

    // 통합 DB가 완전히 비어 있는 초기 단계 대응 Fallback 데이터
    const isDbEmpty = totalCount === 0;

    if (isDbEmpty && search.trim() === "" && userType === "ALL" && paymentStatus === "ALL" && provider === "ALL") {
      console.log("[Admin Users] 플랫폼 DB 유저 데이터가 존재하지 않아 Fallback 원장 더미를 리턴합니다.");
      
      const MOCK_USERS = [
        { id: "usr_fallback_101", emailOrPhone: "richdreamer@gmail.com", nickname: "황금빛항해자", userType: "MEMBER", provider: "google", createdAt: new Date().toISOString(), orderCount: 2, totalAmount: 3500, hasPaid: true, dreamHistory: [] },
        { id: "usr_fallback_102", emailOrPhone: "010-1234-****", nickname: "비회원_5107", userType: "GUEST", provider: "guest_phone", createdAt: new Date().toISOString(), orderCount: 1, totalAmount: 1500, hasPaid: true, dreamHistory: [] }
      ];

      return NextResponse.json({
        users: MOCK_USERS,
        pagination: {
          totalCount: MOCK_USERS.length,
          totalPages: 1,
          currentPage: 1,
          limit
        }
      }, { status: 200 });
    }

    return NextResponse.json({
      users: paginatedUsers,
      pagination: {
        totalCount,
        totalPages,
        currentPage: page,
        limit
      }
    }, { status: 200 });
  } catch (error: unknown) {
    console.error("Users list API fetch error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
