/** @type {import('next').NextConfig} */
const nextConfig = {
  // React Compiler ON (Next 16 stable, top-level). devDep: babel-plugin-react-compiler.
  reactCompiler: true,
  images: {
    // 최신 포맷 우선(AVIF→WebP)으로 전송 용량 절감.
    formats: ["image/avif", "image/webp"],
    // 최적화 결과 캐시 TTL(초) — 동일 이미지 재요청 시 재최적화 방지.
    minimumCacheTTL: 2_678_400, // 31일
  },
};

export default nextConfig;
