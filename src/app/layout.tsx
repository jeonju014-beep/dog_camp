import type { Metadata } from "next";
import "leaflet/dist/leaflet.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "반려견 캠핑 지도 대시보드 | 전북·전남",
  description:
    "전라북도·전라남도 반려견과 함께 캠핑하기 좋은 장소를 추천하는 교육용 대시보드",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
