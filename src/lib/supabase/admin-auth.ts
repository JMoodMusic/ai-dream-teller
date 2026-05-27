import { NextResponse } from "next/server";
import { cookies } from "next/headers";

/**
 * 어드민 전용 API 요청에 대해 관리자 권한(admin_session 쿠키)을 검증합니다.
 * @returns {Promise<{ authorized: boolean; errorResponse?: NextResponse }>}
 */
export async function checkAdminAccess() {
  try {
    const cookieStore = await cookies();
    const adminSession = cookieStore.get("admin_session")?.value;

    if (adminSession !== "true") {
      return {
        authorized: false,
        errorResponse: NextResponse.json({ message: "Unauthorized" }, { status: 401 }),
      };
    }

    return { authorized: true };
  } catch (error) {
    console.error("Admin Authentication check error:", error);
    return {
      authorized: false,
      errorResponse: NextResponse.json({ message: "Internal Server Error" }, { status: 500 }),
    };
  }
}


/**
 * 휴대폰 번호 뒷자리를 마스킹 처리합니다.
 * @param phone 휴대폰 번호 (예: 01012345678, 010-1234-5678 등)
 */
export function maskPhoneNumber(phone: string | null | undefined): string {
  if (!phone) return "N/A";
  const trimmed = phone.trim();
  // 하이픈이 있는 경우 포맷 유지 처리
  if (trimmed.includes("-")) {
    const parts = trimmed.split("-");
    if (parts.length === 3) {
      return `${parts[0]}-${parts[1]}-****`;
    }
  }
  // 하이픈이 없는 11자리 휴대폰 번호 기준
  if (trimmed.length >= 10) {
    return `${trimmed.substring(0, 3)}-${trimmed.substring(3, trimmed.length - 4)}-****`;
  }
  return trimmed;
}

interface SystemLog {
  timestamp: string;
  level: "INFO" | "WARN" | "ERROR";
  message: string;
}

/**
 * 주문 정보와 AI 해몽 상태에 대응하는 가상 원격 제어/감사 시스템 로그를 생성합니다.
 */
export function generateSystemLogs(
  orderId: string,
  orderStatus: string,
  dreamStatus: string,
  totalAmount: number,
  createdAt: string,
  updatedAt: string
): SystemLog[] {
  const logs: SystemLog[] = [];
  const baseTime = new Date(createdAt);

  const formatTime = (dateObj: Date) => {
    return dateObj.toTimeString().split(" ")[0];
  };

  // 1. 주문 생성 로그
  logs.push({
    timestamp: formatTime(baseTime),
    level: "INFO",
    message: `가주문서 생성 완료 (order_id: ${orderId})`,
  });

  // 2. 결제 상태에 따른 로그
  if (orderStatus === "SUCCESS") {
    const payTime = new Date(baseTime.getTime() + 2500); // 2.5초 후 결제 완료 가정
    logs.push({
      timestamp: formatTime(payTime),
      level: "INFO",
      message: `Toss Payments 결제 승인 요청 수신 및 검증 완료 (금액: ${totalAmount.toLocaleString()}원)`,
    });
    logs.push({
      timestamp: formatTime(new Date(payTime.getTime() + 100)),
      level: "INFO",
      message: `DB 상태 변경 완료: PENDING -> SUCCESS`,
    });

    // 3. AI 해몽 상태 로그
    if (dreamStatus === "GENERATING") {
      const genTime = new Date(payTime.getTime() + 1000);
      logs.push({
        timestamp: formatTime(genTime),
        level: "INFO",
        message: "AI Dream interpretation pipeline triggered (model: gemini-2.5-flash)",
      });
    } else if (dreamStatus === "COMPLETED") {
      const genTime = new Date(payTime.getTime() + 1000);
      logs.push({
        timestamp: formatTime(genTime),
        level: "INFO",
        message: "AI Dream interpretation pipeline triggered (model: gemini-2.5-flash)",
      });
      const compTime = new Date(updatedAt);
      if (totalAmount > 1500) {
        logs.push({
          timestamp: formatTime(new Date(genTime.getTime() + 1500)),
          level: "INFO",
          message: "AI Dream Image Generator (imagen-4.0) API 호출 및 prompt 송신 성공",
        });
        logs.push({
          timestamp: formatTime(new Date(genTime.getTime() + 4500)),
          level: "INFO",
          message: "AI Dream Image 생성 완료 & Supabase Storage 업로드 성공",
        });
      }
      logs.push({
        timestamp: formatTime(compTime),
        level: "INFO",
        message: "해몽 보고서 빌드 완료 및 텔레그램 Notification Bot 전송 완료 (SUCCESS)",
      });
    } else if (dreamStatus === "FAILED") {
      const genTime = new Date(payTime.getTime() + 1000);
      logs.push({
        timestamp: formatTime(genTime),
        level: "INFO",
        message: "AI Dream interpretation pipeline triggered (model: gemini-2.5-flash)",
      });
      const failTime = new Date(updatedAt);
      logs.push({
        timestamp: formatTime(failTime),
        level: "ERROR",
        message: "Gemini API 호출 중 원격 서비스 장애 수신 (HTTP 503 / 500) - AI 해몽 파이프라인 실패 중단",
      });
    }
  } else if (orderStatus === "FAILED") {
    const failTime = new Date(updatedAt);
    logs.push({
      timestamp: formatTime(failTime),
      level: "WARN",
      message: `사용자 결제창 이탈 또는 결제 취소 감지: 결제 실패 원장 업데이트 (FAILED)`,
    });
  } else {
    // PENDING
    logs.push({
      timestamp: formatTime(new Date()),
      level: "INFO",
      message: "Toss Payments 결제창 대기 중 (PG 승인 및 웹훅 신호 대기)",
    });
  }

  return logs;
}
