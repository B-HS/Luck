import { describe, expect, test, beforeEach } from "bun:test";
import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import { sql } from "drizzle-orm";
import * as schema from "../../db/schema.ts";
import { createLottoResultRepository } from "../../repository/lotto-result-repository.ts";

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
  await db.run(sql`
    CREATE TABLE lotto_results (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      episode_id INTEGER NOT NULL UNIQUE REFERENCES episodes(id),
      num1 INTEGER NOT NULL,
      num2 INTEGER NOT NULL,
      num3 INTEGER NOT NULL,
      num4 INTEGER NOT NULL,
      num5 INTEGER NOT NULL,
      num6 INTEGER NOT NULL,
      bonus_num INTEGER NOT NULL,
      draw_date TEXT NOT NULL,
      rank1_winners INTEGER NOT NULL,
      rank1_prize INTEGER NOT NULL,
      rank1_total_prize INTEGER NOT NULL,
      rank2_winners INTEGER NOT NULL,
      rank2_prize INTEGER NOT NULL,
      rank2_total_prize INTEGER NOT NULL,
      rank3_winners INTEGER NOT NULL,
      rank3_prize INTEGER NOT NULL,
      rank3_total_prize INTEGER NOT NULL,
      rank4_winners INTEGER NOT NULL,
      rank4_prize INTEGER NOT NULL,
      rank4_total_prize INTEGER NOT NULL,
      rank5_winners INTEGER NOT NULL,
      rank5_prize INTEGER NOT NULL,
      rank5_total_prize INTEGER NOT NULL,
      total_sales INTEGER NOT NULL,
      related_sales INTEGER NOT NULL,
      win_type0 INTEGER,
      win_type1 INTEGER,
      win_type2 INTEGER,
      win_type3 INTEGER,
      total_winners INTEGER,
      game_seq_no INTEGER
    )
  `);
  await db.run(sql`INSERT INTO episodes (id, is_drawn) VALUES (1210, 1)`);
  return db;
};

describe("LottoResultRepository", () => {
  let db: Awaited<ReturnType<typeof createTestDb>>;
  let repo: ReturnType<typeof createLottoResultRepository>;

  beforeEach(async () => {
    db = await createTestDb();
    repo = createLottoResultRepository(db);
  });

  test("insert & findByEpisode", async () => {
    await repo.insert({
      episodeId: 1210,
      num1: 1,
      num2: 7,
      num3: 9,
      num4: 17,
      num5: 27,
      num6: 38,
      bonusNum: 31,
      drawDate: "20260207",
      rank1Winners: 24,
      rank1Prize: 1102298407,
      rank1TotalPrize: 26455161768,
      rank2Winners: 153,
      rank2Prize: 28818259,
      rank2TotalPrize: 4409193627,
      rank3Winners: 4649,
      rank3Prize: 948418,
      rank3TotalPrize: 4409195282,
      rank4Winners: 211663,
      rank4Prize: 50000,
      rank4TotalPrize: 10583150000,
      rank5Winners: 3139766,
      rank5Prize: 5000,
      rank5TotalPrize: 15698830000,
      totalSales: 123111058000,
      relatedSales: 123111058000,
    });

    const result = await repo.findByEpisode(1210);
    expect(result?.episodeId).toBe(1210);
    expect(result?.num1).toBe(1);
    expect(result?.bonusNum).toBe(31);
  });

  test("존재하지 않는 회차 조회 시 undefined", async () => {
    const result = await repo.findByEpisode(9999);
    expect(result).toBeUndefined();
  });
});
