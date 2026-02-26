import { Hono } from "hono";
import type { LottoService } from "../services/lotto-service.ts";
import type { EpisodeService } from "../services/episode-service.ts";

export const createApiRouter = (deps: {
  lottoService: LottoService;
  episodeService: EpisodeService;
}) => {
  const api = new Hono();

  api.get("/lotto/:episode", async (c) => {
    const episode = Number(c.req.param("episode"));
    if (isNaN(episode) || episode < 1) {
      return c.json({ error: "유효하지 않은 회차" }, 400);
    }

    const result = await deps.lottoService.getResult(episode);
    if (!result) {
      return c.json({ error: "결과를 찾을 수 없습니다" }, 404);
    }

    return c.json(result);
  });

  api.get("/episodes", async (c) => {
    const limit = Number(c.req.query("limit") || "20");
    const offset = Number(c.req.query("offset") || "0");
    const episodes = await deps.episodeService.getEpisodes(limit, offset);
    return c.json(episodes);
  });

  return api;
};
