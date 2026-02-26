import type { LottoResultRepository } from '../repository/lotto-result-repository'
import type { EpisodeRepository } from '../repository/episode-repository'
import type { DhlotteryClient } from './dhlottery-client'
import type { createLruCache } from '../lib/lru-cache'

export type LottoResult = NonNullable<Awaited<ReturnType<LottoResultRepository['findByEpisode']>>>

const LRU_MAX_SIZE = 30

const MAX_EPISODE = 9999

export const createLottoService = (deps: {
    lottoResultRepo: LottoResultRepository
    episodeRepo: EpisodeRepository
    dhlotteryClient: DhlotteryClient
    lruCache: ReturnType<typeof createLruCache<LottoResult>>
}) => ({
    getResult: async (episode: number) => {
        if (!Number.isInteger(episode) || episode < 1 || episode > MAX_EPISODE) {
            return null
        }
        const memCached = deps.lruCache.get(String(episode))
        if (memCached) {
            console.log(`[메모리 캐시] ${episode}회 결과 조회`)
            return memCached
        }

        const dbCached = await deps.lottoResultRepo.findByEpisode(episode)
        if (dbCached) {
            console.log(`[DB 캐시] ${episode}회 결과 조회`)
            deps.lruCache.set(String(episode), dbCached)
            return dbCached
        }

        try {
            const fetched = await deps.dhlotteryClient.fetchResult(episode)
            if (!fetched) {
                return null
            }

            await deps.episodeRepo.insert({ id: episode, isDrawn: false })
            await deps.lottoResultRepo.insert(fetched)
            await deps.episodeRepo.markDrawn(episode, fetched.drawDate)

            const saved = await deps.lottoResultRepo.findByEpisode(episode)
            if (saved) {
                deps.lruCache.set(String(episode), saved)
            }
            return saved
        } catch (e) {
            console.error(`[API 에러] ${episode}회 외부 API 호출 실패`)
            return null
        }
    },
})

export type LottoService = ReturnType<typeof createLottoService>
