import { describe, expect, test } from "bun:test";
import { render, screen } from "@testing-library/react";
import { WinningNumbers } from "@/ui/winning-numbers.tsx";

describe("WinningNumbers", () => {
  test("6개 번호 + 보너스 번호를 렌더링", () => {
    render(
      <WinningNumbers numbers={[1, 7, 9, 17, 27, 38]} bonusNumber={31} />
    );
    expect(screen.getByText("1")).toBeTruthy();
    expect(screen.getByText("7")).toBeTruthy();
    expect(screen.getByText("38")).toBeTruthy();
    expect(screen.getByText("31")).toBeTruthy();
    expect(screen.getByText("+")).toBeTruthy();
  });
});
