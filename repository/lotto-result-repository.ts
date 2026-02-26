import { eq } from "drizzle-orm";
import { lottoResults } from "@/db/schema.ts";
import type { DrizzleDb } from "@/db/index.ts";

type NewLottoResult = typeof lottoResults.$inferInsert;

export const createLottoResultRepository = (db: DrizzleDb) => ({
  findByEpisode: (episodeId: number) =>
    db.query.lottoResults.findFirst({
      where: eq(lottoResults.episodeId, episodeId),
    }),

  insert: (data: NewLottoResult) =>
    db.insert(lottoResults).values(data).onConflictDoNothing(),
});

export type LottoResultRepository = ReturnType<
  typeof createLottoResultRepository
>;
