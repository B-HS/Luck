import { createDb } from "./index";
import { episodes } from "./schema";
import { sql } from "drizzle-orm";

const FIRST_DRAW_DATE = new Date("2002-12-07");
const MS_PER_WEEK = 7 * 24 * 60 * 60 * 1000;

const getDrawDate = (episodeId: number) => {
  const date = new Date(
    FIRST_DRAW_DATE.getTime() + (episodeId - 1) * MS_PER_WEEK
  );
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}${mm}${dd}`;
};

const getLatestEpisode = () => {
  const now = new Date();
  const kstNow = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const diff = kstNow.getTime() - FIRST_DRAW_DATE.getTime();
  const weeks = Math.floor(diff / MS_PER_WEEK);
  const drawDayThisWeek = new Date(
    FIRST_DRAW_DATE.getTime() + weeks * MS_PER_WEEK
  );
  const kstHour = kstNow.getUTCHours();
  const isPastDraw =
    kstNow >= drawDayThisWeek &&
    (kstNow.getTime() > drawDayThisWeek.getTime() + 24 * 60 * 60 * 1000 ||
      kstHour >= 22);
  return isPastDraw ? weeks + 1 : weeks;
};

const main = async () => {
  const db = createDb({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
  });

  const latestEpisode = getLatestEpisode();
  console.log(`시딩: 1~${latestEpisode}회 episodes 생성`);

  const batchSize = 500;
  for (let i = 1; i <= latestEpisode; i += batchSize) {
    const batch = [];
    for (let j = i; j < Math.min(i + batchSize, latestEpisode + 1); j++) {
      batch.push({
        id: j,
        drawDate: getDrawDate(j),
        isDrawn: false,
      });
    }
    await db.insert(episodes).values(batch).onConflictDoNothing();
  }

  console.log(`시딩 완료: ${latestEpisode}개 회차 생성됨`);
};

main().catch(console.error);
