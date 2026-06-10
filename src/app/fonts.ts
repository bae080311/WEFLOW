import localFont from "next/font/local";

export const pretendard = localFont({
  src: [
    { path: "../shared/fonts/Pretendard-Regular.woff2", weight: "400", style: "normal" },
    { path: "../shared/fonts/Pretendard-Medium.woff2", weight: "500", style: "normal" },
    { path: "../shared/fonts/Pretendard-Bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-pretendard",
  display: "swap",
  preload: true,
});
