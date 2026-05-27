"use server";

import { cookies } from "next/headers";

/**
 * 어드민 로그인 Server Action
 * - ID: admin, Password: admin1234!
 * - 성공 시 30일 만료를 가지는 admin_session 쿠키 발급
 */
export async function adminLogin(formData: FormData) {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  if (username === "admin" && password === "admin1234!") {
    const cookieStore = await cookies();
    cookieStore.set("admin_session", "true", {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30일
    });
    return { success: true };
  }

  return { success: false, error: "아이디 또는 비밀번호가 올바르지 않습니다." };
}

/**
 * 어드민 로그아웃 Server Action
 * - admin_session 쿠키 삭제
 */
export async function adminLogout() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_session");
  return { success: true };
}
