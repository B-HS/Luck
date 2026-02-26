import { describe, expect, test } from "bun:test";
import { getBallColor } from "@/lib/ball-color.ts";

describe("getBallColor", () => {
  test("1~10 → 노란색", () => {
    expect(getBallColor(1)).toContain("yellow");
    expect(getBallColor(10)).toContain("yellow");
  });

  test("11~20 → 파란색", () => {
    expect(getBallColor(11)).toContain("blue");
    expect(getBallColor(20)).toContain("blue");
  });

  test("21~30 → 빨간색", () => {
    expect(getBallColor(21)).toContain("red");
    expect(getBallColor(30)).toContain("red");
  });

  test("31~40 → 회색", () => {
    expect(getBallColor(31)).toContain("gray");
    expect(getBallColor(40)).toContain("gray");
  });

  test("41~45 → 초록색", () => {
    expect(getBallColor(41)).toContain("green");
    expect(getBallColor(45)).toContain("green");
  });
});
