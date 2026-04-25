# Product Requirements Document(PRD)

## 1. 프로젝트 개요(Project Overview)

- **프로젝트 명** : AI Dream Teller(AI 꿈 해몽 서비스)

- **목표** : 사용자가 입력한 꿈 내용을 AI가 분석하여 심층적인 해몽과 조언을 제공하는 수익형 웹 서비스

- **핵심 가치 1** : 신비롭고 직관적인 UI경험과 정확도 높은 AI 분석을 통해서 사용자에게 인사이트와 재미를 제공
- **핵심 가치 2** : 프로이트, 칼 융, 신경과학, 게슈탈트 등 해몽을 맡기고 싶은 전문 분야를 선택해서 해몽 요청을 가능하게 함.


## 2. 타겟 유저(Target Audience)

- 꿈의 의미를 검색해보는 습관이 있는 20~40대 남녀.
- 모바일 환경에서 간편ㅇ하게 결과를 확인하고 공유하고 싶어하는 유저.


## 3. 기술 스택(Tech Stack)
- **Web Framework** : Next.js (App Router)
- **Language** : TypeScript
- **Styling** : Tailwind CSS, Shadcn/UI
- **Backend & DB** : Next.js API Routes, Supabase
- **Payment** : Toss Payments
- **AI Services** : Gemini with gemini sdk


## 4. 디자인 가이드(Design Guide)

- **Theme** : Mystical, Vibrant, Fluid 
- **Colors** : Deep Purple, Neon Blue, Soft Pink (Aurora Gradients)
- **Interactions** : 부드러운 스크롤, 호버 시 빛나는 효과, 로딩 시 몽환적인 애니메이션
-- **Typography** : 적절한 폰트사이즈와 줄바꿈으로 가독성 확보

## 5. UX Flow & Layout

### 5.1. 전체 레이아웃 (Overall Layout)

1. **상단 네비게이션 바**
   - (공통) 홈 로고 (클릭 시 메인 페이지 이동)
   - (비회원) 로그인, 비회원 주문 조회
   - (회원) 마이페이지
   - **(모바일 반응형)** 화면이 작아질 경우 텍스트 메뉴가 숨겨지고 우측에 햄버거 메뉴 버튼 노출. 버튼 클릭 시 좌우 여백 없이 화면 너비를 꽉 채우며 위에서 아래로 떨어지는 Drawer(Sheet) 메뉴 제공
2. **Body**
   - 각 페이지 별 주요 내용 렌더링 (꿈 입력, 분석 결과, 마이페이지 등)
3. **Footer**
   - 하단 카피라이트 텍스트 및 사업자 정보 텍스트 직접 표기 (상호, 대표자, 사업자등록번호, 이메일 등)
   - 우측(또는 하단) 링크 영역: 이용약관(`/terms`), 개인정보처리방침(`/privacy`), 문의하기(이메일 링크) 제공
4. **Head & Meta**
   - SEO 최적화 (Title, Description)
   - Open Graph (SNS 공유 시 노출 정보)
   - GA4 등 Analytics 설정 및 데이터 트래킹

### 5.2. 페이지 별 UX 구성 (UX Flow & Pages)

1. **메인 랜딩페이지 (`/`)**
   - 서비스 한줄 소개
   - 프로덕트 상세로 넘어가는 후킹 버튼 (프로덕트 상세 페이지로 이동)
   - 서비스에 대한 여러 feature 소개
   - 이미 풀이된 이전 유저들의 꿈 해몽 텍스트 및 AI 이미지 예시 리스트 섹션 (더보기 -> 예시 리스트 피드로 이동)

2. **프로덕트 상세 페이지 (`/dream-teller`)**
   - 간략한 서비스 사용 소개
   - 프로이트, 칼 융, 신경과학, 게슈탈트 등 해몽을 맡기고 싶은 전문 분야 선택
   - 유저의 꿈 입력란
   - 꿈 풀이 요청 버튼
   - 안내 및 주의 사항
     * 보통 3분 이내에 생성이 완료됩니다.
     * 꿈 해석은 AI를 통해 정신분석, 신화, 상징학 데이터를 기반으로 생성됩니다.
     * 이 해석은 자기 이해를 돕기 위한 참고 자료이며, 의학적/심리학적 진단을 대체하지 않습니다.
   - 구매 옵션 선택 섹션
     * (기본) 단순 텍스트 해석 : 1,500원
     * (추가 옵션) AI 생성 이미지 추가 : +500원

3. **결제 페이지 (`/payments`)**
   - 영수증 디자인을 참고한 디자인의 결제 페이지
   - 토스페이먼츠 위젯이 들어갈 섹션
   - 회원 결제와 비회원 결제 모두 지원
   - 결제가 성공적으로 완료된 후 회원은 마이페이지, 비회원은 비회원 주문 조회 페이지로 이동
   - 결제에 실패했을 경우 입력한 꿈 정보가 사라지지 않고 결제 페이지에 그대로 머물러 있음

4. **해석 확인 페이지 (`/dream-result/[order-id]`)**
   - 결제한 유저가 자신의 꿈 해석 및 AI 이미지(옵션)를 확인할 수 있는 페이지
   - 해몽과 이미지 뿐 아니라 자신이 입력한 꿈 내용도 함께 확인할 수 있어야 함
   - 다른 사람에게 공유할 수 있도록 링크 카피, 소셜 공유 버튼 섹션 하단 배치
   - **(회원의 경우)** 캘린더 라이브러리를 활용해 해몽이 이뤄진 날짜에 하이라이트 표시 및 해당 일자를 누를 경우 해당 해몽 결과 페이지로 넘어감

5. **유저의 마이페이지 (`/my-page`)**
   - 회원 가입된 유저만 자신의 마이페이지 접근 가능
   - 캘린더 라이브러리를 활용해 해몽이 이뤄진 날짜에 하이라이트 표시 및 해당 일자를 누를 경우 해당 해몽 결과 페이지로 넘어감
   - 구매 내역 리스트가 캘린더 하단에 배치 및 해당 리스트 아이템을 누를 경우 해당 해몽 결과 확인 페이지로 넘어감
   - 닉네임(수정 가능 기능), 로그인 한 소셜 서비스(구글 or 네이버 or 카카오) 로고, 이메일 주소, 로그아웃 버튼

6. **비회원 로그인 (`/guest-login`)**
   - 간단한 페이지 소개
   - 전화번호 및 비밀번호 입력 폼
   - 비회원 주문 조회 버튼

7. **비회원 주문 조회 페이지 (`/guest-check`)**
   - 6번에서 로그인한 비회원이 자신의 구매 내역을 조회하는 페이지
   - 구매내역 리스트가 배치되어 있고 해당 리스트 아이템을 눌렀을 때, 해당 해몽 결과 확인 페이지로 이동

8. **이전 유저들의 과거 풀이 내역 리스트 피드 페이지 (`/feeds`)**
   - 페이스북 형태의 피드
   - 이미지가 있는 해몽 결과는 이미지와 텍스트가 함께 보여지고, 텍스트만 있는 해몽 결과는 텍스트만 보여짐

9. **회원 로그인 페이지 (`/auth`)**
   - 구글 및 네이버, 카카오 소셜 로그인만 존재
   - 각 소셜 서비스로 성공적으로 로그인 후 리다이렉트는 2번의 프로덕트 상세 페이지로 이동

### 5.3. 관리자 UX 페이지 구성 (Admin UX Flow & Pages)

0. **관리자 페이지 기본 공통 레이아웃**
   - 좌측 네비게이션 패널
     * 매출 조회
     * 주문 내역 리스트
   - 네비게이션 패널을 제외하고는 각 관리자 메뉴 페이지별 내용 body 영역

1. **관리자 메인 페이지 (`/admin`)**
   - 기간별 매출 조회 대시보드 (기본 화면)

2. **주문 내역 리스트 (`/admin/order-list`)**
   - 결제가 완료된 주문 건 확인을 위한 리스트 표
   - 각 리스트 아이템을 누르면 각 주문의 "3번 상세 주문 내역"으로 이동

3. **상세 주문 내역 (`/admin/order-list/[order-id]`)**
   - 2번에 종속된 페이지
   - 해당 주문의 회원/비회원 여부, 구매자 정보, 결제 완료 여부, 유저의 꿈 input, LLM이 생성한 해몽 텍스트, AI가 생성한 꿈 이미지(존재한다면), LLM 해몽 재생성 요청 버튼

4. **유저 리스트 (`/admin/user-list`)**
   - 회원 및 비회원 유저 리스트 표 페이지
   - 회원과 비회원을 필터링해서 볼 수 있는 기능
   - 각 회원의 결제 여부를 확인할 수 있음

## 6. API 구조 설계 (API Architecture)

Next.js 14 App Router의 `app/api/.../route.ts` (Route Handlers) 및 Supabase 기반으로 설계된 MECE한 API 구조입니다.

### 6.1. Auth & Users (`/api/auth`, `/api/users`)
Supabase Auth와 연동하여 인증 및 확장된 유저 정보를 관리합니다.
- `POST /api/auth/guest` : 비회원용 세션 토큰 발급 (비회원 주문 조회용)
- `GET /api/users/me` : 현재 로그인한 유저의 프로필 정보 및 남은 크레딧/결제 상태 조회
- `PATCH /api/users/me` : 유저 프로필(닉네임 등) 수정

### 6.2. Feeds (`/api/feeds`)
메인 랜딩 등에 노출되는 공개 데이터를 처리합니다.
- `GET /api/feeds` : 메인 랜딩용 공개 해몽 결과 목록 조회 (Pagination 지원)

### 6.3. AI Processing (`/api/ai`)
해몽 생성 및 이미지 비동기 처리를 담당합니다.
- `POST /api/ai/generate` : 결제 완료 건을 대상으로 Gemini API를 활용하여 해몽 분석 및 이미지 생성 작업 비동기 트리거

### 6.4. Dreams (`/api/dreams`)
생성된 꿈 해몽 결과 조회 및 관리를 담당합니다.
- `GET /api/dreams/[id]` : 특정 꿈 해몽 및 이미지 상세 조회 (공유 링크 및 상세 페이지용, 권한 체크)

### 6.5. Orders & Payments (`/api/orders`, `/api/payments`)
주문서 생성 및 결제 웹훅 처리를 담당합니다.
- `POST /api/orders` : 결제 전 주문 정보(텍스트 기본/이미지 추가 등) 생성 
- `GET /api/orders/me` : 유저의 전체 주문/결제 내역 조회 (마이페이지 캘린더 및 리스트용, 토큰 기반)
- `POST /api/payments/toss/confirm` : Toss Payments 결제 승인 요청 및 서버 상태(결제 완료) 업데이트 Webhook

### 6.6. Admin (`/api/admin`)
관리자 대시보드 및 리스트 관리를 위한 어드민 전용 API입니다.
- `GET /api/admin/dashboard` : 기간별 매출, 유저 가입 수 등 대시보드 통계 데이터 조회
- `GET /api/admin/orders` : 전체 주문/결제 내역 리스트 조회 및 필터링
- `GET /api/admin/users` : 회원 및 비회원 유저 리스트 조회 및 상태 확인
- `POST /api/admin/orders/[id]/regenerate` : LLM 해몽 재생성(regenerate) 요청

## 7. DB 스키마 설계 (DB Schema - Supabase)

Supabase PostgreSQL 환경에 맞춘 MECE한 테이블 설계입니다.

### 7.1. profiles (회원 정보)
Supabase의 기본 `auth.users` 테이블과 1:1로 연결되는 확장 프로필 테이블입니다. 관리자 권한 및 기본 유저 정보를 관리합니다.
| 컬럼명 | 데이터 타입 | 제약조건 (Null 여부 등) | 설명 |
| :--- | :--- | :--- | :--- |
| `id` | `uuid` | PK, FK(`auth.users.id`), **NOT NULL** | 유저 고유 ID |
| `email` | `text` | **NOT NULL** | 유저 이메일 |
| `nickname` | `text` | NULL | 유저 닉네임 |
| `provider` | `text` | NULL | 소셜 로그인 제공자 (google, kakao 등) |
| `role` | `text` | Default `'USER'`, **NOT NULL** | 권한 (`'USER'`, `'ADMIN'`) |
| `created_at` | `timestamptz` | Default `now()`, **NOT NULL** | 가입 일시 |

### 7.2. guests (비회원 정보)
비회원 주문 및 조회를 위한 정보를 저장합니다.
| 컬럼명 | 데이터 타입 | 제약조건 (Null 여부 등) | 설명 |
| :--- | :--- | :--- | :--- |
| `id` | `uuid` | PK, Default `uuid_generate_v4()`, **NOT NULL** | 비회원 고유 ID |
| `phone_number` | `text` | **NOT NULL** | 휴대폰 번호 (조회용 아이디 역할) |
| `password_hash` | `text` | **NOT NULL** | 암호화된 비밀번호 (조회용) |
| `created_at` | `timestamptz` | Default `now()`, **NOT NULL** | 최초 주문 일시 |

### 7.3. orders (주문 및 결제 내역)
회원과 비회원의 모든 결제 및 주문 정보를 관리합니다. 토스페이먼츠 연동 기준입니다.
| 컬럼명 | 데이터 타입 | 제약조건 (Null 여부 등) | 설명 |
| :--- | :--- | :--- | :--- |
| `id` | `uuid` | PK, Default `uuid_generate_v4()`, **NOT NULL** | 주문 고유 ID |
| `order_number` | `text` | Unique, **NOT NULL** | 토스페이먼츠 연동용 `orderId` |
| `user_type` | `text` | **NOT NULL** | 구매자 유형 (`'MEMBER'`, `'GUEST'`) |
| `profile_id` | `uuid` | FK(`profiles.id`), NULL | (회원인 경우) 구매자 ID |
| `guest_id` | `uuid` | FK(`guests.id`), NULL | (비회원인 경우) 비회원 ID |
| `total_amount` | `integer` | **NOT NULL** | 총 결제 금액 |
| `status` | `text` | Default `'PENDING'`, **NOT NULL** | 결제 상태 (`'PENDING'`, `'SUCCESS'`, `'FAILED'`) |
| `payment_key` | `text` | NULL | 토스페이먼츠 `paymentKey` |
| `created_at` | `timestamptz` | Default `now()`, **NOT NULL** | 주문 생성 일시 |
| `updated_at` | `timestamptz` | Default `now()`, **NOT NULL** | 주문 상태 업데이트 일시 |

### 7.4. dreams (해몽 및 결과 데이터)
주문과 1:1 (또는 1:N)로 연결되는 꿈 내용, AI 해몽 결과, 생성된 이미지를 저장합니다.
| 컬럼명 | 데이터 타입 | 제약조건 (Null 여부 등) | 설명 |
| :--- | :--- | :--- | :--- |
| `id` | `uuid` | PK, Default `uuid_generate_v4()`, **NOT NULL** | 해몽 고유 ID |
| `order_id` | `uuid` | FK(`orders.id`), **NOT NULL** | 결제된 주문 ID |
| `expert_style` | `text` | **NOT NULL** | 선택한 해몽 전문가 스타일 (프로이트, 융 등) |
| `dream_content` | `text` | **NOT NULL** | 유저가 입력한 꿈 내용 (Input) |
| `ai_analysis` | `text` | NULL | LLM이 생성한 심층 해몽 텍스트 (Output) |
| `image_url` | `text` | NULL | 생성된 꿈 이미지 URL (옵션 결제 시) |
| `is_public` | `boolean` | Default `false`, **NOT NULL** | 공개 피드 노출 여부 |
| `status` | `text` | Default `'PENDING'`, **NOT NULL** | AI 처리 상태 (`'PENDING'`, `'GENERATING'`, `'COMPLETED'`, `'FAILED'`) |
| `created_at` | `timestamptz` | Default `now()`, **NOT NULL** | 레코드 생성 일시 |
| `updated_at` | `timestamptz` | Default `now()`, **NOT NULL** | 해몽 완료/업데이트 일시 |