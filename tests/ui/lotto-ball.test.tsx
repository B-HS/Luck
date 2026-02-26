import { describe, expect, test } from "bun:test";
import { render, screen } from "@testing-library/react";
import { LottoBall } from "@/ui/lotto-ball.tsx";

describe("LottoBall", () => {
  test("번호를 렌더링", () => {
    render(<LottoBall number={7} />);
    expect(screen.getByText("7")).toBeTruthy();
  });

  test("노란색 공 (1~10)", () => {
    const { container } = render(<LottoBall number={5} />);
    expect(container.innerHTML).toContain("yellow");
  });

  test("파란색 공 (11~20)", () => {
    const { container } = render(<LottoBall number={15} />);
    expect(container.innerHTML).toContain("blue");
  });
});
