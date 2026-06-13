import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Table, TableHeaderCell, TableCell } from "./Table";

describe("Table", () => {
  it("가로 스크롤 래퍼로 감싼 <table> 을 렌더한다", () => {
    render(
      <Table>
        <thead>
          <tr>
            <TableHeaderCell>이름</TableHeaderCell>
          </tr>
        </thead>
        <tbody>
          <tr>
            <TableCell>홍길동</TableCell>
          </tr>
        </tbody>
      </Table>,
    );
    const table = screen.getByRole("table");
    // 데스크탑(md+)에서만 가로 스크롤/최소폭 — 모바일은 block(카드)
    expect(table).toHaveClass("md:min-w-160");
    expect(table).toHaveClass("block", "md:table");
    expect(table.parentElement).toHaveClass("md:overflow-x-auto");
  });

  it("헤더 셀은 scope=col 인 th, 데이터 셀은 td 로 렌더한다", () => {
    render(
      <Table>
        <thead>
          <tr>
            <TableHeaderCell>상태</TableHeaderCell>
          </tr>
        </thead>
        <tbody>
          <tr>
            <TableCell>대기</TableCell>
          </tr>
        </tbody>
      </Table>,
    );
    const th = screen.getByRole("columnheader", { name: "상태" });
    expect(th.tagName).toBe("TH");
    expect(th).toHaveAttribute("scope", "col");
    expect(screen.getByRole("cell", { name: "대기" }).tagName).toBe("TD");
  });
});
