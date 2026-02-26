import { Hono } from "hono";
import { createDb } from "@/db/index.ts";
import { createEpisodeRepository } from "@/repository/episode-repository.ts";
import { createLottoResultRepository } from "@/repository/lotto-result-repository.ts";
import { createDhlotteryClient } from "@/services/dhlottery-client.ts";
import { createEpisodeService } from "@/services/episode-service.ts";
import { createLottoService } from "@/services/lotto-service.ts";
import { createApiRouter } from "@/router/api.ts";
import { createPagesRouter } from "@/router/pages.tsx";

const db = createDb({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

const episodeRepo = createEpisodeRepository(db);
const lottoResultRepo = createLottoResultRepository(db);
const dhlotteryClient = createDhlotteryClient(fetch);

const episodeService = createEpisodeService({ episodeRepo });
const lottoService = createLottoService({
  lottoResultRepo,
  episodeRepo,
  dhlotteryClient,
});

export const app = new Hono();

app.route("/api", createApiRouter({ lottoService, episodeService }));
app.route("/", createPagesRouter({ lottoService, episodeService }));
