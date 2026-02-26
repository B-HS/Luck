import { eq, desc } from "drizzle-orm";
import { episodes } from "../db/schema";
import type { DrizzleDb } from "../db/index";

type EpisodeRow = typeof episodes.$inferSelect;

export type EpisodeRepository = {
  findById: (id: number) => PromiseLike<EpisodeRow | undefined>;
  findLatest: () => PromiseLike<EpisodeRow | undefined>;
  findAll: (limit?: number, offset?: number) => PromiseLike<EpisodeRow[]>;
  insert: (data: { id: number; drawDate?: string; isDrawn: boolean }) => PromiseLike<unknown>;
  markDrawn: (id: number, drawDate: string) => PromiseLike<unknown>;
  insertMany: (data: { id: number; drawDate?: string; isDrawn: boolean }[]) => PromiseLike<unknown>;
};

export const createEpisodeRepository = (db: DrizzleDb): EpisodeRepository => ({
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
