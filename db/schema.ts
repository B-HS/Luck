import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";

export const episodes = sqliteTable("episodes", {
  id: integer("id").primaryKey(),
  drawDate: text("draw_date"),
  isDrawn: integer("is_drawn", { mode: "boolean" }).notNull().default(false),
});

export const lottoResults = sqliteTable("lotto_results", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  episodeId: integer("episode_id")
    .notNull()
    .unique()
    .references(() => episodes.id),
  num1: integer("num1").notNull(),
  num2: integer("num2").notNull(),
  num3: integer("num3").notNull(),
  num4: integer("num4").notNull(),
  num5: integer("num5").notNull(),
  num6: integer("num6").notNull(),
  bonusNum: integer("bonus_num").notNull(),
  drawDate: text("draw_date").notNull(),
  rank1Winners: integer("rank1_winners").notNull(),
  rank1Prize: integer("rank1_prize").notNull(),
  rank1TotalPrize: integer("rank1_total_prize").notNull(),
  rank2Winners: integer("rank2_winners").notNull(),
  rank2Prize: integer("rank2_prize").notNull(),
  rank2TotalPrize: integer("rank2_total_prize").notNull(),
  rank3Winners: integer("rank3_winners").notNull(),
  rank3Prize: integer("rank3_prize").notNull(),
  rank3TotalPrize: integer("rank3_total_prize").notNull(),
  rank4Winners: integer("rank4_winners").notNull(),
  rank4Prize: integer("rank4_prize").notNull(),
  rank4TotalPrize: integer("rank4_total_prize").notNull(),
  rank5Winners: integer("rank5_winners").notNull(),
  rank5Prize: integer("rank5_prize").notNull(),
  rank5TotalPrize: integer("rank5_total_prize").notNull(),
  totalSales: integer("total_sales").notNull(),
  relatedSales: integer("related_sales").notNull(),
  winType0: integer("win_type0"),
  winType1: integer("win_type1"),
  winType2: integer("win_type2"),
  winType3: integer("win_type3"),
  totalWinners: integer("total_winners"),
  gameSeqNo: integer("game_seq_no"),
});
