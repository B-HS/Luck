import { Hono } from "hono";
import { createDb } from "./db/index";
import { createEpisodeRepository } from "./repository/episode-repository";
import { createLottoResultRepository } from "./repository/lotto-result-repository";
import { createDhlotteryClient } from "./services/dhlottery-client";
import { createEpisodeService } from "./services/episode-service";
import { createLottoService } from "./services/lotto-service";
import { createApiRouter } from "./router/api";
import { createPagesRouter } from "./router/pages";
import { createLruCache } from "./lib/lru-cache";

const db = createDb({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

const episodeRepo = createEpisodeRepository(db);
const lottoResultRepo = createLottoResultRepository(db);
const dhlotteryClient = createDhlotteryClient(fetch);

const episodeService = createEpisodeService({ episodeRepo });
const lruCache = createLruCache(30);
const lottoService = createLottoService({
  lottoResultRepo,
  episodeRepo,
  dhlotteryClient,
  lruCache,
});

export const app = new Hono();

app.route("/api", createApiRouter({ lottoService, episodeService }));
app.route("/", createPagesRouter({ lottoService, episodeService }));
