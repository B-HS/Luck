import { describe, expect, test, beforeEach } from "bun:test";
import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import { sql } from "drizzle-orm";
import * as schema from "@/db/schema.ts";
import { createEpisodeRepository } from "@/repository/episode-repository.ts";

const createTestDb = async () => {
  const client = createClient({ url: "file::memory:" });
  const db = drizzle(client, { schema });
  await db.run(sql`
    CREATE TABLE episodes (
      id INTEGER PRIMARY KEY,
      draw_date TEXT,
      is_drawn INTEGER NOT NULL DEFAULT 0
    )
  `);
  return db;
};

describe("EpisodeRepository", () => {
  let db: Awaited<ReturnType<typeof createTestDb>>;
  let repo: ReturnType<typeof createEpisodeRepository>;

  beforeEach(async () => {
    db = await createTestDb();
    repo = createEpisodeRepository(db);
  });

  test("insert & findById", async () => {
    await repo.insert({ id: 1210, drawDate: "20260207", isDrawn: true });
    const episode = await repo.findById(1210);
    expect(episode?.id).toBe(1210);
    expect(episode?.isDrawn).toBe(true);
  });

  test("findLatest - 추첨 완료된 최신 회차", async () => {
    await repo.insertMany([
      { id: 1210, drawDate: "20260207", isDrawn: true },
      { id: 1211, drawDate: "20260214", isDrawn: true },
      { id: 1212, isDrawn: false },
    ]);
    const latest = await repo.findLatest();
    expect(latest?.id).toBe(1211);
  });

  test("markDrawn", async () => {
    await repo.insert({ id: 1212, isDrawn: false });
    await repo.markDrawn(1212, "20260221");
    const episode = await repo.findById(1212);
    expect(episode?.isDrawn).toBe(true);
    expect(episode?.drawDate).toBe("20260221");
  });

  test("findAll - 내림차순 정렬", async () => {
    await repo.insertMany([
      { id: 1, isDrawn: true },
      { id: 2, isDrawn: true },
      { id: 3, isDrawn: false },
    ]);
    const all = await repo.findAll(10, 0);
    expect(all[0]?.id).toBe(3);
    expect(all.length).toBe(3);
  });
});
