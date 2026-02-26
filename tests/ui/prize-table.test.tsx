import { describe, expect, test } from "bun:test";
import { render, screen } from "@testing-library/react";
import { PrizeTable } from "../../ui/prize-table.tsx";

describe("PrizeTable", () => {
  const rows = [
    {
      rank: 1,
      matchDesc: "6개 번호 일치",
      winners: 24,
      prize: 1102298407,
      totalPrize: 26455161768,
    },
    {
      rank: 2,
      matchDesc: "5개 번호 + 보너스 일치",
      winners: 153,
      prize: 28818259,
      totalPrize: 4409193627,
    },
  ];

  test("등위별 정보를 렌더링", () => {
    render(<PrizeTable rows={rows} />);
    expect(screen.getByText("1등")).toBeTruthy();
    expect(screen.getByText("2등")).toBeTruthy();
    expect(screen.getByText("6개 번호 일치")).toBeTruthy();
    expect(screen.getByText("24명")).toBeTruthy();
  });
});
