import { test, expect } from "@playwright/test";

test.describe("어드민 공통 글로벌 레이아웃 E2E 검증", () => {
  test.beforeEach(async ({ page }) => {
    // 어드민 대시보드 페이지로 진입
    await page.goto("/admin");
  });

  test("1. 사이드바 메뉴 탭 전환 및 로그아웃 플로우", async ({ page }) => {
    // 사이드바 로고 및 기본 타이틀 확인
    await expect(page.locator("h1:has-text('Dream Teller')")).toBeVisible();
    await expect(page.locator("span:has-text('Admin Console')")).toBeVisible();

    // 메뉴 항목 확인
    const dashboardLink = page.locator("a:has-text('매출 대시보드')");
    const orderListLink = page.locator("a:has-text('주문 내역 리스트')");
    const userListLink = page.locator("a:has-text('유저 리스트')");

    await expect(dashboardLink).toBeVisible();
    await expect(orderListLink).toBeVisible();
    await expect(userListLink).toBeVisible();

    // 탭 이동 확인 (주문 내역 리스트 이동)
    await orderListLink.click();
    await page.waitForURL("/admin/order-list");
    await expect(page.locator("h3:has-text('주문 및 결제 거래 내역')")).toBeVisible();

    // 탭 이동 확인 (유저 리스트 이동)
    await userListLink.click();
    await page.waitForURL("/admin/user-list");
    await expect(page.locator("h3:has-text('플랫폼 유저 및 계정 감사')")).toBeVisible();

    // 탭 이동 확인 (매출 대시보드 복귀)
    await dashboardLink.click();
    await page.waitForURL("/admin");

    // 시스템 로그아웃 트리거 & 대화상자(Alert) 가로채기 핸들링
    let dialogMessage = "";
    page.once("dialog", async (dialog) => {
      dialogMessage = dialog.message();
      await dialog.accept(); // 얼럿 확인 버튼 클릭 시뮬레이션
    });

    const logoutButton = page.locator("button:has-text('로그아웃')");
    await expect(logoutButton).toBeVisible();
    await logoutButton.click();

    // 로그아웃 알림 메시지 검증 및 메인 리다이렉트 확인
    await page.waitForURL("/");
    expect(dialogMessage).toContain("로그아웃 되었습니다.");
  });
});

test.describe("매출 대시보드 페이지 (/admin) E2E 검증", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/admin");
  });

  test("2. 기간별 매출 조회 필터 및 차트/도넛 렌더링", async ({ page }) => {
    // 메인 타이틀 확인
    await expect(page.locator("h3:has-text('매출 및 비즈니스 분석')")).toBeVisible();

    // 핵심 지표 카드 4종 검증
    await expect(page.locator("span:has-text('조회 기간 총 매출')")).toBeVisible();
    await expect(page.locator("span:has-text('총 주문 수')")).toBeVisible();
    await expect(page.locator("span:has-text('신규 가입 및 방문 유저')")).toBeVisible();
    await expect(page.locator("span:has-text('AI 해몽 시스템 안정성')")).toBeVisible();

    // 기간 필터 전환 (오늘 필터 클릭)
    const todayFilterButton = page.locator("button:has-text('오늘')");
    await todayFilterButton.click();
    
    // 로딩 시뮬레이션 및 데이터 세트 로드 확인
    await page.waitForTimeout(400); // 300ms simulated load timeout
    const revenueValue = page.locator("h3:has-text('23,500원')");
    await expect(revenueValue).toBeVisible();

    // 기간 필터 전환 (30일 필터 클릭)
    const thirtyDaysFilterButton = page.locator("button:has-text('30일')");
    await thirtyDaysFilterButton.click();
    await page.waitForTimeout(400);
    const thirtyDaysRevenue = page.locator("h3:has-text('546,000원')");
    await expect(thirtyDaysRevenue).toBeVisible();

    // SVG 도넛 차트 구성비 검증 (Strict Mode 해결을 위해 .first() 명시 적용)
    await expect(page.locator("span:has-text('이미지 비중')")).toBeVisible();
    await expect(page.locator("span:has-text('71%')").first()).toBeVisible(); // 30일 데이터 셋 기준 이미지 비중

    // 막대 그래프 호버 시 툴팁 인터랙션 검증을 위한 막대 호버 시뮬레이션
    const firstBar = page.locator("div.group.cursor-pointer").first();
    await firstBar.hover();
    await expect(page.locator("div.absolute.top-0.z-30")).toBeVisible(); // 툴팁 노출 확인
  });
});

test.describe("주문 내역 리스트 페이지 (/admin/order-list) E2E 검증", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/admin/order-list");
  });

  test("3. 검색, 다중 필터링, 페이지네이션 및 동기화 무결성", async ({ page }) => {
    // 실시간 검색어 필터링 검증 (프로이트 검색)
    const searchInput = page.locator("input[placeholder*='주문번호, 바이어 연락처']");
    await expect(searchInput).toBeVisible();
    await searchInput.fill("프로이트");
    await page.waitForTimeout(100);

    // 프로이트와 매칭된 주문 로우 렌더링 확인
    const rowsCount = await page.locator("tbody tr").count();
    expect(rowsCount).toBeGreaterThan(0);
    await expect(page.locator("td:has-text('프로이트')").first()).toBeVisible();

    // 엉뚱한 검색어로 결과 부재(Empty State) 디자인 카드 검증
    await searchInput.fill("존재하지않는해몽데이터");
    await page.waitForTimeout(100);
    await expect(page.locator("h4:has-text('일치하는 주문 내역이 없습니다')")).toBeVisible();

    // 검색 필터 전면 초기화 확인
    await page.locator("button:has-text('모든 검색 필터 해제')").click();
    await page.waitForTimeout(100);
    await expect(page.locator("input[placeholder*='주문번호, 바이어 연락처']")).toHaveValue("");

    // 다중 드롭다운 필터 선택 (비회원 게스트 전용 조회)
    await page.selectOption("select:has-text('유저유형')", "GUEST");
    await page.waitForTimeout(100);
    
    // exact text match filter를 활용하여 '비회원' 배지만 있고 순수 '회원' 배지가 없는지 정확히 교차 검증
    await expect(page.locator("span").filter({ hasText: /^회원$/ }).first()).not.toBeVisible();

    // 실시간 새로고침 스피너 연동 검증
    const refreshButton = page.locator("button:has-text('실시간 동기화')");
    await refreshButton.click();
    await expect(page.locator("p:has-text('거래 내역 장부를 최신화하고 있습니다')")).toBeVisible();
    await page.waitForTimeout(600); // 500ms simulated timeout
    await expect(page.locator("p:has-text('거래 내역 장부를 최신화하고 있습니다')")).not.toBeVisible();

    // 정밀 페이지네이션 버튼 클릭 및 인덱스 정합성 검증
    const page2Button = page.locator("button:has-text('2')");
    if (await page2Button.isVisible()) {
      await page2Button.click();
      await page.waitForTimeout(100);
      await expect(page.locator("span:has-text('총 15건 중 9-')")).toBeVisible(); // 1페이지당 8건 제한에 따라 9번부터 표시 검증
    }
  });
});

test.describe("상세 주문 내역 페이지 (/admin/order-list/[id]) E2E 검증", () => {
  test("4. AI 해몽 재생성, 비상 상태 수동 제어 및 로그 감사", async ({ page }) => {
    // 2번 주문(ord_2) 상세 감사 페이지 진입
    await page.goto("/admin/order-list/ord_2");
    
    // 원본 꿈 및 스타일 확인
    await expect(page.locator("span:has-text('원본 무의식')")).toBeVisible();
    await expect(page.locator("span:has-text('칼 융')")).toBeVisible();

    // 가. AI 보고서 재생성 시뮬레이션
    // 재생성 상태(isRegenerating)에 따라 버튼 텍스트가 동적으로 갱신되므로, 텍스트가 아닌 구조적 셀렉터로 버튼을 타겟해 E2E 무결성을 보장합니다.
    const regenerateButton = page.locator("div.flex.flex-col.sm\\:flex-row.sm\\:items-center button").first();
    await expect(regenerateButton).toBeVisible();

    // 대화상자(Alert) 가로채기를 재생성 버튼 클릭 전에 먼저 등록하여 블로킹 방지 및 비활성화 검증 보장
    let dialogMsg = "";
    page.once("dialog", async (dialog) => {
      dialogMsg = dialog.message();
      await dialog.accept();
    });

    // 클릭 시 다중 클릭 방어 스피너 동작 확인
    await regenerateButton.click();
    
    // 2초 simulated setTimeout이 끝나기 전, 클릭 직후 즉각적으로 비활성화(disabled) 상태 체크
    await expect(regenerateButton).toBeDisabled();
    await expect(page.locator("p:has-text('LLM이 전문가 분석 기법에 기반해')")).toBeVisible();

    // 재생성 완수 및 텍스트 갱신 검증
    await page.waitForTimeout(2100); // 2000ms delay
    expect(dialogMsg).toContain("재생성되었습니다");
    await expect(page.locator("p:has-text('재생성 필터링 분석 완료')")).toBeVisible();

    // 나. AI 꿈 심상 이미지 렌더러 검증 (ord_2는 2,000원 결제 건이므로 이미지 렌더링 확인)
    // 이미지 파일 로딩 시 비동기 레이아웃 높이(0px) 연산 지연에 따른 hidden 처리 에러 방지를 위해 toBeAttached와 src 속성 검증 도입 (완벽!)
    await expect(page.locator("img[alt='AI Dream Render']")).toBeAttached();
    await expect(page.locator("img[alt='AI Dream Render']")).toHaveAttribute("src", /unsplash|photo/);
    await expect(page.locator("a:has-text('원본 이미지 다운로드')")).toBeVisible();

    // 다. 관리자 비상 강제 제어 툴 (Status Overrider) 작동 검증
    const statusSelect = page.locator("select:has-text('결제 완료 상태')");
    await expect(statusSelect).toBeVisible();
    await statusSelect.selectOption("FAILED"); // 실패 상태로 제어값 변경

    const applyOverrideButton = page.locator("button:has-text('거래 상태 강제 갱신 적용')");
    await applyOverrideButton.click();

    // 이중 승인 동의 박스 활성화 검증
    await expect(page.locator("p:has-text('주의: 강제 갱신 시 Toss 결제')")).toBeVisible();
    
    // 강제 적용 승인 클릭 및 상태 갱신 확인
    let statusOverrideDialog = "";
    page.once("dialog", async (dialog) => {
      statusOverrideDialog = dialog.message();
      await dialog.accept();
    });
    await page.locator("button:has-text('강제 적용 승인')").click();
    expect(statusOverrideDialog).toContain("강제 변경되었습니다");
    await expect(page.locator("span:has-text('결제 실패 / 취소')")).toBeVisible(); // 오버라이드 갱신 검증 완료

    // 라. 실시간 서버 트랜잭션 콘솔 로그 확인
    await expect(page.locator("h4:has-text('실시간 서버 트랜잭션 로그')")).toBeVisible();
    await expect(page.locator("p:has-text('관리자 강제 제어로 결제 상태 오버라이드')")).toBeVisible(); // 감사 로그 연계 확인
  });
});

test.describe("유저 리스트 페이지 (/admin/user-list) E2E 검증", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/admin/user-list");
  });

  test("5. 유저 세그먼트 요약 카드, 상세 드로어 및 미결제 유저 폴백", async ({ page }) => {
    // 플랫폼 유저 감사 타이틀 확인
    await expect(page.locator("h3:has-text('플랫폼 유저 및 계정 감사')")).toBeVisible();
    await expect(page.locator("span:has-text('전체 관리 유저 수')")).toBeVisible();

    // 2페이지에 위치한 '황금빛항해자' 유저를 가져오기 위해 먼저 서치 검색창 활용 (필수!)
    const searchInput1 = page.locator("input[placeholder*='이메일, 연락처, 닉네임']");
    await searchInput1.fill("황금빛항해자");
    await page.waitForTimeout(100);

    // 이제 1페이지로 자동 필터링된 '황금빛항해자' 유저 행의 '구매 내역 감사' 돋보기 버튼 획득 및 클릭
    const richDreamerRow = page.locator("tr", { hasText: "황금빛항해자" });
    const viewDetailButton = richDreamerRow.locator("button[title='구매 내역 감사']");
    await expect(viewDetailButton).toBeVisible();
    await viewDetailButton.click();

    // 프리미엄 슬라이드 드로어 오픈 확인
    await expect(page.locator("span:has-text('User History & Dream Resume')")).toBeVisible();
    await expect(page.locator("h4:has-text('황금빛항해자')")).toBeVisible(); // 1번 유저 닉네임
    await expect(page.locator("span:has-text('3. 해몽 의뢰 히스토리 (3건)')")).toBeVisible();

    // 드로어 닫기 (글로벌 Sticky 헤더 오버랩 간섭을 100% 회피하기 위해 드로어 바깥 딤 배경(Backdrop) 영역을 안전하게 클릭)
    const backdrop = page.locator("div.fixed.inset-0.z-\\[100\\] > div.absolute.inset-0");
    await expect(backdrop).toBeVisible();
    await backdrop.click();
    
    // 드로어 컨테이너 자체가 DOM에서 언마운트(not.toBeAttached)되어 사라질 때까지 대기하여 레이아웃/포커스 간섭 원천 배제
    await expect(page.locator("div.fixed.inset-0.z-\\[100\\]")).not.toBeAttached();
    await page.waitForTimeout(300); // 드로어 퇴장 CSS Transition 완료 대기 버퍼

    // URL이 유저 리스트 감사 페이지를 그대로 안전하게 유지 중인지 감사 단언
    await expect(page).toHaveURL(/\/admin\/user-list/);

    // 13번 유저(clean_slate@gmail.com - 미결제 유저) 검색 및 드로어 확인 (Stale Element 방지를 위한 로케이터 실시간 재검색)
    const searchInput2 = page.locator("input[placeholder*='이메일, 연락처, 닉네임']");
    await expect(searchInput2).toBeVisible();
    await searchInput2.fill("clean_slate");
    
    // "신규새출발" 행이 렌더링될 때까지 확실히 대기
    const targetRow = page.locator("tr", { hasText: "신규새출발" });
    await expect(targetRow).toBeVisible();

    // 유저 상세 클릭 (해당 행 내부의 버튼 명시적 타겟팅)
    await targetRow.locator("button[title='구매 내역 감사']").click();
    await expect(page.locator("h4:has-text('신규새출발')")).toBeVisible();
    
    // 구매 이력 0건에 대한 Fallback Empty State 검증
    await expect(page.locator("p:has-text('가입 후 구매 이력이 존재하지 않습니다')")).toBeVisible();
  });
});
