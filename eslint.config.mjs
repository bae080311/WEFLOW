import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier/flat";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // React Compiler 안전성 린팅은 eslint-config-next/core-web-vitals 가 react-hooks v7 룰
  // (purity, set-state-in-render, immutability, use-memo, preserve-manual-memoization 등)으로 이미 적용한다.
  // eslint-config-prettier 는 반드시 마지막 — 포맷 관련 룰 비활성화.
  prettier,
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "coverage/**",
    "playwright-report/**",
    "test-results/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
