import type { LottoResultRepository } from "../repository/lotto-result-repository.ts";
import type { EpisodeRepository } from "../repository/episode-repository.ts";
import type { DhlotteryClient } from "./dhlottery-client.ts";

export const createLottoService = (deps: {
  lottoResultRepo: LottoResultRepository;
  episodeRepo: EpisodeRepository;
  dhlotteryClient: DhlotteryClient;
}) => ({
  getResult: async (episode: number) => {
    const cached = await deps.lottoResultRepo.findByEpisode(episode);
    if (cached) {
      console.log(`[DB 캐시] ${episode}회 결과 조회`);
      return cached;
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

    return deps.lottoResultRepo.findByEpisode(episode);
  },
});

export type LottoService = ReturnType<typeof createLottoService>;
