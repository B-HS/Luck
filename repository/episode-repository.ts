import { eq, desc } from "drizzle-orm";
import { episodes } from "../db/schema.ts";
import type { DrizzleDb } from "../db/index.ts";

export const createEpisodeRepository = (db: DrizzleDb) => ({
  findById: (id: number) =>
    db.query.episodes.findFirst({ where: eq(episodes.id, id) }),

  findLatest: () =>
    db.query.episodes.findFirst({
      where: eq(episodes.isDrawn, true),
      orderBy: desc(episodes.id),
    }),

  findAll: (limit = 20, offset = 0) =>
    db.query.episodes.findMany({
      orderBy: desc(episodes.id),
      limit,
      offset,
    }),

  insert: (data: { id: number; drawDate?: string; isDrawn: boolean }) =>
    db.insert(episodes).values(data).onConflictDoNothing(),

  markDrawn: (id: number, drawDate: string) =>
    db
      .update(episodes)
      .set({ isDrawn: true, drawDate })
      .where(eq(episodes.id, id)),

  insertMany: (
    data: { id: number; drawDate?: string; isDrawn: boolean }[]
  ) => db.insert(episodes).values(data).onConflictDoNothing(),
});

export type EpisodeRepository = ReturnType<typeof createEpisodeRepository>;
