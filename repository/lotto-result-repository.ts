import { eq } from "drizzle-orm";
import { lottoResults } from "../db/schema";
import type { DrizzleDb } from "../db/index";

export type LottoResultRow = typeof lottoResults.$inferSelect;
export type NewLottoResult = typeof lottoResults.$inferInsert;

export type LottoResultRepository = {
  findByEpisode: (episodeId: number) => PromiseLike<LottoResultRow | undefined>;
  insert: (data: NewLottoResult) => PromiseLike<unknown>;
};

export const createLottoResultRepository = (db: DrizzleDb): LottoResultRepository => ({
  findByEpisode: (episodeId: number) =>
    db.query.lottoResults.findFirst({
      where: eq(lottoResults.episodeId, episodeId),
    }),

  insert: (data: NewLottoResult) =>
    db.insert(lottoResults).values(data).onConflictDoNothing(),
});
