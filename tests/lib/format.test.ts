import { describe, expect, test } from "bun:test";
import { formatMoney, formatDate, formatCount } from "../../lib/format";

describe("formatMoney", () => {
  test("금액을 한국 형식으로 포맷", () => {
    expect(formatMoney(1000000)).toBe("1,000,000원");
    expect(formatMoney(0)).toBe("0원");
  });
});

describe("formatDate", () => {
  test("YYYYMMDD를 한국어 날짜로 변환", () => {
    expect(formatDate("20260221")).toBe("2026년 02월 21일");
    expect(formatDate("20021207")).toBe("2002년 12월 07일");
  });
});

describe("formatCount", () => {
  test("인원수를 한국 형식으로 포맷", () => {
    expect(formatCount(24)).toBe("24명");
    expect(formatCount(3139766)).toBe("3,139,766명");
  });
});
