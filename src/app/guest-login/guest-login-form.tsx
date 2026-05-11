"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const GuestLoginForm = () => {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/guest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phoneNumber, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "로그인에 실패했습니다.");
      }

      // 성공 시 비회원 주문조회 페이지로 이동
      router.push("/guest-check");
      router.refresh();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^0-9]/g, "");
    let formatted = rawValue;
    
    if (rawValue.length < 4) {
      formatted = rawValue;
    } else if (rawValue.length < 8) {
      formatted = rawValue.replace(/(\d{3})(\d{1,4})/, "$1-$2");
    } else if (rawValue.length === 10) {
      formatted = rawValue.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
    } else {
      formatted = rawValue.replace(/(\d{3})(\d{4})(\d{1,4})/, "$1-$2-$3").slice(0, 13);
    }
    
    setPhoneNumber(formatted);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="phoneNumber" className="text-slate-600 font-medium">
            전화번호
          </Label>
          <Input
            id="phoneNumber"
            type="tel"
            placeholder="010-0000-0000"
            value={phoneNumber}
            onChange={handlePhoneChange}
            maxLength={13}
            className="h-12 bg-white/80 border-slate-200/60 focus:border-purple-400 focus:ring-purple-400/20"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-slate-600 font-medium">
            비밀번호
          </Label>
          <Input
            id="password"
            type="password"
            placeholder="결제 시 입력한 비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-12 bg-white/80 border-slate-200/60 focus:border-pink-400 focus:ring-pink-400/20"
            required
          />
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-500 font-medium text-center bg-red-50/50 p-3 rounded-lg">
          {error}
        </p>
      )}

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full h-14 text-base font-semibold bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-md hover:shadow-lg transition-all"
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            조회 중...
          </span>
        ) : (
          "비회원 주문조회"
        )}
      </Button>
    </form>
  );
};

export default GuestLoginForm;
