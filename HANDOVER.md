# 인수인계서 — 반려견 캠핑 지도 대시보드

| 항목 | 내용 |
|------|------|
| 프로젝트명 | Pet Camping Dashboard (반려견 캠핑 지도 대시보드) |
| 목적 | 전라북도·전라남도 반려견 캠핑 장소 추천 (교육용 MVP) |
| GitHub | https://github.com/jeonju014-beep/dog_camp |
| 브랜치 | `main` |
| 작성일 | 2026-05-23 |

---

## 1. 프로젝트 개요

### 1.1 한 줄 요약

공공데이터(고캠핑·반려동물 동반여행)와 OpenWeather API를 조합해, **전북·전남 캠핑장을 지도 위에 표시하고 추천지수·날씨·통계**를 보여주는 Next.js 웹 대시보드입니다.

### 1.2 주요 사용자

- 비전공자 교육 수강생 (Cursor Agent 실습용)
- 전북·전남 캠핑·반려견 동반 여행 정보를 한 화면에서 비교하려는 사용자

### 1.3 MVP 범위 (구현됨)

| 기능 | 상태 |
|------|------|
| Leaflet + OpenStreetMap 지도 | ✅ |
| 전북·전남 주소 캠핑장 마커 | ✅ |
| 마커 색상 (최고=빨강, 70+=연노랑, 70-=회색) | ✅ |
| 마커 클릭 팝업 | ✅ |
| 추천 캠핑장 테이블 | ✅ |
| Recharts (Bar / Line / Pie) | ✅ |
| 지역 필터 (전북/전남/전체) | ✅ |
| API 실패 시 Mock fallback | ✅ |

### 1.4 범위 외 (미구현)

- 회원가입·로그인
- DB 영속 저장
- 상세 페이지 라우팅 (`/detail/[id]`)
- Vercel 등 프로덕션 배포 설정 (로컬 개발 기준)

---

## 2. 기술 스택

| 구분 | 기술 |
|------|------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| UI | Tailwind CSS |
| 지도 | Leaflet 1.9 + react-leaflet 5 |
| 타일 | OpenStreetMap (API 키 불필요) |
| 차트 | Recharts 2 |
| 아이콘 | lucide-react |
| 런타임 | Node.js 18+ 권장 (22 테스트됨) |

---

## 3. 저장소 및 로컬 실행

### 3.1 저장소 클론

```bash
git clone https://github.com/jeonju014-beep/dog_camp.git
cd dog_camp
```

### 3.2 환경변수 (필수)

`.env.local.example`을 복사해 `.env.local` 생성:

```bash
copy .env.local.example .env.local   # Windows
# cp .env.local.example .env.local  # macOS/Linux
```

```env
PUBLIC_DATA_SERVICE_KEY=공공데이터포털_디코딩키
OPENWEATHER_API_KEY=openweather_api_key
```

| 변수 | 설명 | 발급처 |
|------|------|--------|
| `PUBLIC_DATA_SERVICE_KEY` | 고캠핑·반려동물여행 API 공통 키 | [공공데이터포털](https://www.data.go.kr) — **Decoding 키** 권장 |
| `OPENWEATHER_API_KEY` | 5일 날씨 예보 | [OpenWeather](https://openweathermap.org/api) |

> **주의:** `.env.local`은 Git에 올라가지 않습니다. 채팅·이슈·스크린샷에 키를 노출하지 마세요.

### 3.3 실행 명령

```bash
npm install
npm run dev      # http://localhost:3005
npm run build    # 프로덕션 빌드 검증
npm run start    # 빌드 후 실행 (기본 포트 3000)
npm run lint     # ESLint
```

### 3.4 포트

- 개발: **3005** (`package.json` → `"dev": "next dev -p 3005"`)
- 3000이 사용 중이면 3005로 접속

---

## 4. 시스템 구조

### 4.1 데이터 흐름

```
[브라우저]
    │
    ▼ fetch /api/dashboard?region=all
[Next.js API Route]  ← API 키는 서버에서만 사용
    │
    ├─► 고캠핑 locationBasedList (전라도 좌표 기준)
    ├─► 반려동물여행 areaBasedList2 (areaCode 37/38)
    └─► OpenWeather forecast (전북·전남 대표 좌표)
    │
    ▼ JSON (DashboardData)
[DashboardClient] → [DashboardShell] → 지도·테이블·차트
```

- **클라이언트**는 외부 API를 직접 호출하지 않습니다.
- 페이지(`page.tsx`)는 `DashboardClient`만 렌더하고, 데이터는 **클라이언트에서 `/api/dashboard` 호출**로 로드합니다.

### 4.2 폴더 구조

```
src/
├── app/
│   ├── page.tsx              # 진입 (Suspense + DashboardClient)
│   ├── layout.tsx            # Leaflet CSS 전역 import
│   ├── api/
│   │   ├── dashboard/route.ts   # 통합 API (메인)
│   │   ├── camping/route.ts
│   │   ├── pet-tour/route.ts
│   │   └── weather/route.ts
│   ├── loading.tsx / error.tsx
│   └── globals.css
├── components/
│   ├── dashboard/            # 셸, 테이블, 차트, 필터, 날씨 카드
│   └── map/                  # CampingMap, 팝업
├── lib/
│   ├── api/                  # public-data, openweather, dashboard 빌더
│   ├── mock/data.ts          # API 실패 시 fallback
│   └── utils/                # 점수, 날씨, 지역 필터, enrich
└── types/index.ts            # 공통 TypeScript 타입
```

### 4.3 핵심 파일 (수정 시 우선 확인)

| 파일 | 역할 |
|------|------|
| `src/lib/api/dashboard.ts` | API 통합·Mock 병합·TOP3·차트 데이터 생성 |
| `src/lib/api/public-data.ts` | 고캠핑·반려여행 호출, 전북·전남 주소 필터 |
| `src/lib/utils/enrich-camping.ts` | 캠핑장별 점수·명당·순위·마커 등급 |
| `src/lib/utils/camping-score.ts` | 캠핑장 개별 추천지수 산식 |
| `src/components/map/camping-map.tsx` | Leaflet 지도·마커 스타일 |
| `src/components/dashboard/dashboard-client.tsx` | API fetch·로딩·에러 UI |

---

## 5. 외부 API 명세

### 5.1 고캠핑 API

- **Base:** `https://apis.data.go.kr/B551011/GoCamping`
- **사용 엔드포인트:** `/locationBasedList` (전라도 중심 좌표 + radius 120km)
- **필수 파라미터:** `serviceKey`, `MobileOS=ETC`, `MobileApp=PetCampingDashboard`, `_type=json`, `mapX`, `mapY`, `radius`, `numOfRows`, `pageNo`
- **필터:** 응답 중 `addr1`/`doNm`에 전북·전남 포함 건만 표시
- **좌표:** `mapY`=위도, `mapX`=경도

### 5.2 반려동물 동반여행 API

- **Base:** `https://apis.data.go.kr/B551011/KorPetTourService2`
- **엔드포인트:** `/areaBasedList2`
- **지역 코드:** 전북 `37`, 전남 `38`

### 5.3 OpenWeather API

- **URL:** `https://api.openweathermap.org/data/2.5/forecast`
- **파라미터:** `lat`, `lon`, `appid`, `units=metric`, `lang=kr`
- **대표 좌표:** `src/lib/constants.ts` → `REGIONS`

### 5.4 일일 트래픽

공공데이터 API는 서비스별 **일 1,000건** 제한이 있습니다. 과다 호출 시 Mock·부분 실패가 발생할 수 있습니다.

---

## 6. 화면·비즈니스 규칙

### 6.1 지역 필터

| URL 쿼리 | 의미 |
|----------|------|
| (없음) / `region=all` | 전북+전남 |
| `region=37` | 전라북도 |
| `region=38` | 전라남도 |

### 6.2 마커 규칙

| 등급 | 조건 | 표시 |
|------|------|------|
| `best` | 추천지수 1위 (오늘의 최고 캠핑장) | **빨간 원** + 흰색 ★ (크기 약 13px) |
| `high` | 70점 이상 | 연노랑 원 (약 10px) |
| `low` | 70점 미만 | 회색 원 (약 9px) |

### 6.3 지역별 추천지수 (100점)

| 항목 | 배점 | 로직 위치 |
|------|------|-----------|
| 캠핑장 수 | 30 | `src/lib/utils/score.ts` |
| 반려동물 장소 수 | 25 | 동일 |
| 날씨 적합도 | 30 | 동일 |
| 데이터 완성도 | 15 | API 3종 성공 비율 |

### 6.4 캠핑장 개별 추천지수

`src/lib/utils/camping-score.ts` — 반려 동반 가능 여부, 시설, 당일 날씨 등으로 35~98점 산출 후 순위·명당 결정.

---

## 7. API Routes (내부)

| Method | Path | Query | 설명 |
|--------|------|-------|------|
| GET | `/api/dashboard` | `region=all\|37\|38` | **메인** — 통합 JSON |
| GET | `/api/camping` | `areaCode=37\|38` | 캠핑장만 |
| GET | `/api/pet-tour` | `areaCode=37\|38` | 반려 여행지만 |
| GET | `/api/weather` | `region=jeonbuk\|jeonnam` | 날씨만 |

응답 예시 (`/api/dashboard`):

```json
{
  "success": true,
  "data": {
    "camping": [...],
    "petTours": [...],
    "top3": [...],
    "todayWeather": {...},
    "dataSource": "live | mock | mixed",
    "errors": []
  }
}
```

---

## 8. Mock Fallback

- **위치:** `src/lib/mock/data.ts`
- **동작:** API 키 없음·호출 실패·빈 응답 시 Mock 데이터로 화면 유지
- **표시:** 상단 배너에 `실시간 API` / `일부 Mock` / `Mock 데이터` 표시

---

## 9. 트러블슈팅

| 증상 | 원인 | 조치 |
|------|------|------|
| 지도가 안 보임 | Leaflet SSR/높이 이슈 | `CampingMap`은 클라이언트 전용, 높이 `560px` 고정. 새로고침 |
| 빈 지도 | 전북·전남 필터 결과 0건 | API 키·공공데이터 트래픽 확인. Mock으로라도 표시되는지 확인 |
| 500 on `/api/dashboard` | 첫 요청 시 컴파일·JSON 파싱 | 재요청 또는 `npm run dev` 재시작 |
| 포트 접속 불가 | 포트 충돌 | `package.json`의 `3005` 또는 터미널에 표시된 Local URL 확인 |
| `npm`/`git` 없음 | PATH 미설정 | Node.js LTS, Git for Windows 설치 |
| 공공데이터 인증 오류 | Encoding/Decoding 키 혼용 | `.env.local`에 **Decoding 키** 사용 권장 |

---

## 10. 배포 시 참고 (선택)

1. **Vercel** 등에 배포 시 Environment Variables에 동일 키 등록
2. `npm run build` 로컬에서 통과 확인 후 배포
3. 공공데이터 API는 **서버 IP** 기준 트래픽 제한 가능 — 운영 시 캐시(Revalidate) 검토

현재 `fetch`에 `cache: "no-store"`가 많아, 배포 후 트래픽이 늘면 `revalidate` 조정을 권장합니다.

---

## 11. 관련 문서

| 문서 | 경로 |
|------|------|
| 제품 요구사항 (PRD) | [PRD.md](./PRD.md) |
| 실행 요약 | [README.md](./README.md) |
| 환경변수 템플릿 | [.env.local.example](./.env.local.example) |

---

## 12. 인수인계 체크리스트

인수자가 아래를 직접 확인하면 인수 완료로 볼 수 있습니다.

- [ ] 저장소 clone 및 `npm install` 성공
- [ ] `.env.local` 설정 후 `npm run dev` → http://localhost:3005 접속
- [ ] 지도에 마커 표시, 빨간색 최고 캠핑장 1개 확인
- [ ] 마커 클릭 시 팝업 표시
- [ ] 하단 테이블·우측(또는 하단) 차트 표시
- [ ] `region=37`, `region=38` 필터 동작
- [ ] API 키 제거 시 Mock fallback 동작
- [ ] `.env.local`이 Git에 커밋되지 않음 확인

---

## 13. 문의·이슈

- **이슈 트래킹:** GitHub Issues — https://github.com/jeonju014-beep/dog_camp/issues
- **코드 변경 시:** PRD·인수인계서의 “범위 외” 항목과 충돌하지 않는지 확인

---

*본 문서는 프로젝트 인수인계용이며, 기능 추가 시 PRD 및 본 문서를 함께 갱신하는 것을 권장합니다.*
