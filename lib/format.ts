export const formatMoney = (amount: number) =>
  new Intl.NumberFormat("ko-KR").format(amount) + "원";

export const formatDate = (yyyymmdd: string) => {
  const y = yyyymmdd.slice(0, 4);
  const m = yyyymmdd.slice(4, 6);
  const d = yyyymmdd.slice(6, 8);
  return `${y}년 ${m}월 ${d}일`;
};

export const formatCount = (count: number) =>
  new Intl.NumberFormat("ko-KR").format(count) + "명";
