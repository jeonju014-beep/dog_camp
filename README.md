# 반려견 캠핑 추천 대시보드 (전북·전남)

전라북도·전라남도에서 반려견과 캠핑하기 좋은 장소를 추천하는 **교육용 Next.js 대시보드** MVP입니다.

## 기능

- 전북(37) / 전남(38) / 전체 비교 필터
- 캠핑장·반려동물 동반 여행지 목록
- 5일 날씨 요약 (OpenWeather)
- 반려견 캠핑 추천지수 (0~100)
- Recharts 차트 (Bar / Line / Pie)
- 추천 지역 TOP3
- API 실패 시 Mock fallback

## 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경변수

`.env.local.example`을 복사해 `.env.local`을 만듭니다.

```env
PUBLIC_DATA_SERVICE_KEY=공공데이터포털_디코딩키
OPENWEATHER_API_KEY=openweather_api_key
```

> API 키는 **서버 전용**입니다. 클라이언트에 노출되지 않습니다.

### 3. 개발 서버

```bash
npm run dev
```

브라우저에서 [http://localhost:3005](http://localhost:3005) 을 엽니다.

> 포트 3000이 사용 중이면 `package.json`의 `dev` 스크립트 포트(기본 3005)를 확인하세요.

## API Routes

| 경로 | 설명 |
|------|------|
| `/api/dashboard` | 통합 대시보드 데이터 |
| `/api/camping` | 고캠핑 목록 |
| `/api/pet-tour?areaCode=37` | 반려동물 여행지 |
| `/api/weather?region=jeonbuk` | 5일 예보 |

## 추천지수 (100점)

| 항목 | 배점 |
|------|------|
| 캠핑장 수 | 30 |
| 반려동물 장소 수 | 25 |
| 날씨 적합도 | 30 |
| 데이터 완성도 | 15 |

## 문서

- [PRD.md](./PRD.md) — 제품 요구사항 정의서

## 기술 스택

Next.js App Router · TypeScript · Tailwind CSS · Recharts
