import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { StatsBand, HOME_STATS } from "./StatsBand";

describe("StatsBand", () => {
  it("기본 통계 4개의 값과 라벨을 렌더한다", () => {
    render(<StatsBand />);
    expect(HOME_STATS).toHaveLength(4);
    HOME_STATS.forEach((stat) => {
      expect(screen.getByText(stat.label)).toBeInTheDocument();
      // CountUp 은 IO 미지원(jsdom) 환경에서 최종값을 즉시 표시한다
      expect(screen.getByText(String(stat.value))).toBeInTheDocument();
    });
  });
});
