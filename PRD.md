# PRD: 전북·전남 반려견 캠핑 추천 대시보드

## 1. 문서 정보

| 항목 | 내용 |
|------|------|
| 프로젝트명 | Pet Camping Dashboard (반려견 캠핑 추천 대시보드) |
| 버전 | MVP 1.0 |
| 대상 사용자 | 비전공자 교육 수강생, Cursor Agent 실습용 |
| 목표 | 전라북도·전라남도 지역 반려견과 캠핑하기 좋은 장소를 한 화면에서 비교·추천하는 SaaS 스타일 대시보드 |

---

## 2. 배경 및 목적

### 2.1 배경
- 공공데이터(고캠핑, 반려동물 동반여행)와 OpenWeather API를 조합하면 지역별 캠핑·반려동물 여행 적합도를 시각화할 수 있다.
- 교육 과정에서는 복잡한 백엔드보다 **Next.js App Router + API Route**로 빠르게 동작하는 MVP를 만드는 것이 목표이다.

### 2.2 목적
1. Cursor Agent로 실제 서비스처럼 보이는 데이터 대시보드를 구축한다.
2. API 키를 서버에서만 사용하는 안전한 패턴을 익힌다.
3. API 실패 시에도 mock fallback으로 화면이 유지되는 UX를 제공한다.

### 2.3 비목표 (MVP 범위 외)
- 사용자 인증/회원가입
- 지도(GIS) 상세 연동
- 실시간 WebSocket
- DB 영속 저장

---

## 3. 사용자 시나리오

1. 사용자가 대시보드에 접속한다.
2. **전라북도(37)** 또는 **전라남도(38)** 필터를 선택한다.
3. 선택 지역의 캠핑장 목록, 반려동물 동반 여행지 목록, 5일 날씨 요약을 확인한다.
4. **반려견 캠핑 추천지수(0~100)** 와 **추천 지역 TOP3** 를 본다.
5. Recharts 차트로 지역 비교·날씨 추이·장소 유형 분포를 파악한다.
6. API 오류 시에도 mock 데이터로 동일한 UI가 표시된다.

---

## 4. 기능 요구사항

### 4.1 필수 기능

| ID | 기능 | 설명 | 우선순위 |
|----|------|------|----------|
| F-01 | 지역 필터 | 전북(37) / 전남(38) 선택 | P0 |
| F-02 | 캠핑장 목록 | 고캠핑 API 기반 카드/리스트 | P0 |
| F-03 | 반려동물 동반 여행지 | KorPetTour areaBasedList2 목록 | P0 |
| F-04 | 5일 날씨 요약 | OpenWeather forecast, 주요 도시 | P0 |
| F-05 | 추천지수 | 0~100점, 계산식 고정 | P0 |
| F-06 | TOP3 지역 | 추천지수 상위 3개 지역 표시 | P0 |
| F-07 | Recharts 차트 | Bar(지수), Line(날씨), Pie(장소유형) | P0 |
| F-08 | Mock fallback | API 실패 시 mock 데이터 | P0 |
| F-09 | Loading / Error / Empty | 각 섹션별 상태 UI | P0 |
| F-10 | 반응형 UI | 모바일~데스크톱 SaaS 스타일 | P0 |

### 4.2 추천지수 계산 (100점 만점)

| 항목 | 배점 | 산식 개요 |
|------|------|-----------|
| 캠핑장 수 | 30점 | `min(캠핑장수 / 기준값, 1) × 30` |
| 반려동물 동반 장소 수 | 25점 | `min(장소수 / 기준값, 1) × 25` |
| 날씨 적합도 | 30점 | 비 없음·15~25℃ 가점, 강풍/폭염/한파 감점 |
| 데이터 완성도 | 15점 | API 3종 응답 성공 비율 × 15 |

**날씨 적합도 세부 (예시)**
- 강수 없는 일수 비율: 최대 12점
- 평균기온 15~25℃ 일수 비율: 최대 12점
- 극한 기온/강풍 일수: 감점 최대 6점

### 4.3 외부 API

#### 고캠핑 API
- Base: `https://apis.data.go.kr/B551011/GoCamping`
- Endpoints: `/basedList`, `/locationBasedList`
- 공통 파라미터: `serviceKey`, `MobileOS=ETC`, `MobileApp=PetCampingDashboard`, `_type=json`, `numOfRows`, `pageNo`

#### 반려동물 동반여행 API
- Base: `https://apis.data.go.kr/B551011/KorPetTourService2`
- Endpoints: `/areaBasedList2`, `/detailPetTour2`
- `areaCode`: 전북 37, 전남 38

#### OpenWeather API
- `https://api.openweathermap.org/data/2.5/forecast`
- `lat`, `lon`, `appid`, `units=metric`, `lang=kr`

### 4.4 환경변수 (`.env.local`)

```
PUBLIC_DATA_SERVICE_KEY=
OPENWEATHER_API_KEY=
```

- 클라이언트에 노출 금지
- 모든 외부 호출은 **Next.js API Route** 경유

---

## 5. 기술 스택

| 구분 | 선택 |
|------|------|
| Framework | Next.js 14+ App Router |
| Language | TypeScript |
| Styling | Tailwind CSS (+ shadcn/ui 선택) |
| Charts | Recharts |
| Data Fetch | Server Components + API Routes |
| 배포 | Vercel 등 (교육용 로컬 우선) |

---

## 6. 정보 구조 및 화면 구성

```
┌─────────────────────────────────────────────────────────┐
│ Header: 로고, 제목, 지역 필터(전북/전남/전체 비교)        │
├─────────────────────────────────────────────────────────┤
│ KPI Cards: 추천지수 | 캠핑장 수 | 반려장소 수 | 날씨요약 │
├─────────────────────────────────────────────────────────┤
│ TOP3 추천 지역 (카드 3개)                                │
├──────────────────────────┬──────────────────────────────┤
│ BarChart: 지역별 추천지수 │ LineChart: 5일 기온/강수   │
├──────────────────────────┴──────────────────────────────┤
│ PieChart: 반려장소 유형 | 캠핑장 목록 | 반려여행지 목록 │
└─────────────────────────────────────────────────────────┘
```

---

## 7. API Route 설계 (MVP)

| Route | 메서드 | 설명 |
|-------|--------|------|
| `/api/camping` | GET | 고캠핑 목록 (`area` query) |
| `/api/pet-tour` | GET | 반려동물 여행지 (`areaCode`) |
| `/api/weather` | GET | 5일 예보 (`region`) |
| `/api/dashboard` | GET | 통합 데이터 + 추천지수 + TOP3 |

Server Component는 `/api/dashboard` 또는 서버 유틸을 호출해 초기 데이터를 로드한다.

---

## 8. 폴더 구조 (목표)

```
src/
  app/
    page.tsx
    layout.tsx
    api/
      camping/route.ts
      pet-tour/route.ts
      weather/route.ts
      dashboard/route.ts
  components/
    dashboard/
    ui/
  lib/
    api/          # fetch wrappers
    utils/        # score, weather helpers
    mock/         # fallback data
  types/
    index.ts
```

---

## 9. 비기능 요구사항

- **보안**: API Key 서버 전용
- **안정성**: 부분 API 실패 시 mock + `dataSource: 'live' | 'mock'` 표시
- **성능**: MVP 기준 SSR 1회 + 클라이언트 필터만 허용
- **접근성**: 기본 시맨틱 HTML, 대비 충분한 SaaS 테마
- **유지보수**: 타입·API·utils 분리, 주석 최소화

---

## 10. 성공 기준 (Definition of Done)

- [ ] PRD 문서 작성 완료
- [ ] `.env.local.example` 제공
- [ ] 전북/전남 필터 동작
- [ ] 추천지수·TOP3·3종 차트 표시
- [ ] API 키 없거나 API 실패 시 mock으로 전체 화면 유지
- [ ] `npm run dev` 로 로컬 실행 가능
- [ ] 반응형 레이아웃

---

## 11. 일정 (MVP)

| 단계 | 작업 | 산출물 |
|------|------|--------|
| 1 | PRD 확정 | PRD.md |
| 2 | 프로젝트 초기화 | package.json, tailwind |
| 3 | API Route + types + mock | lib/, api/ |
| 4 | 대시보드 UI | components/, page.tsx |
| 5 | 점검 | README, .env.example |

---

## 12. 리스크 및 대응

| 리스크 | 대응 |
|--------|------|
| 공공데이터 API 키 미발급 | mock 데이터 fallback |
| 공공데이터 CORS/429 | 서버 Route에서만 호출 |
| OpenWeather 무료 한도 | mock + 캐시(선택, MVP 생략 가능) |
| 응답 스키마 불일치 | 방어적 파싱 + optional chaining |

---

*문서 끝 — MVP 구현은 본 PRD를 기준으로 진행한다.*
