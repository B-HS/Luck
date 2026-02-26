import type { LottoResultRepository } from "../repository/lotto-result-repository";
import type { EpisodeRepository } from "../repository/episode-repository";
import type { DhlotteryClient } from "./dhlottery-client";
import type { createLruCache } from "../lib/lru-cache";

type LottoResult = NonNullable<
  Awaited<ReturnType<LottoResultRepository["findByEpisode"]>>
>;

const LRU_MAX_SIZE = 30;

export const createLottoService = (deps: {
  lottoResultRepo: LottoResultRepository;
  episodeRepo: EpisodeRepository;
  dhlotteryClient: DhlotteryClient;
  lruCache: ReturnType<typeof createLruCache<LottoResult>>;
}) => ({
  getResult: async (episode: number) => {
    const memCached = deps.lruCache.get(String(episode));
    if (memCached) {
      console.log(`[메모리 캐시] ${episode}회 결과 조회`);
      return memCached;
    }

    const dbCached = await deps.lottoResultRepo.findByEpisode(episode);
    if (dbCached) {
      console.log(`[DB 캐시] ${episode}회 결과 조회`);
      deps.lruCache.set(String(episode), dbCached);
      return dbCached;
    }

    console.log(`[API 요청] ${episode}회 결과 동행복권 API 호출`);
    const fetched = await deps.dhlotteryClient.fetchResult(episode);
    if (!fetched) {
      console.log(`[API 요청] ${episode}회 결과 없음`);
      return null;
    }

    await deps.episodeRepo.insert({ id: episode, isDrawn: false });
    await deps.lottoResultRepo.insert(fetched);
    await deps.episodeRepo.markDrawn(episode, fetched.drawDate);
    console.log(`[API 요청] ${episode}회 결과 DB 저장 완료`);

    const saved = await deps.lottoResultRepo.findByEpisode(episode);
    if (saved) {
      deps.lruCache.set(String(episode), saved);
    }
    return saved;
  },
});

export type LottoService = ReturnType<typeof createLottoService>;
