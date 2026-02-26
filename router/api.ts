import { Hono } from 'hono'
import type { LottoService } from '../services/lotto-service'
import type { EpisodeService } from '../services/episode-service'
import { getCacheHeader } from '../lib/cache-header'

const MAX_EPISODE = 9999
const MAX_LIMIT = 100

export const createApiRouter = (deps: { lottoService: LottoService; episodeService: EpisodeService }) => {
    const api = new Hono()

    api.get('/lotto/:episode', async (c) => {
        const episode = Number(c.req.param('episode'))
        if (!Number.isInteger(episode) || episode < 1 || episode > MAX_EPISODE) {
            return c.json({ error: '유효하지 않은 회차' }, 400)
        }

        const result = await deps.lottoService.getResult(episode)
        if (!result) {
            return c.json({ error: '결과를 찾을 수 없습니다' }, 404)
        }

        const latestEpisode = deps.episodeService.getLatestEpisodeNumber()
        c.header('Cache-Control', getCacheHeader(episode, latestEpisode))

        return c.json(result)
    })

    api.get('/episodes', async (c) => {
        const rawLimit = Number(c.req.query('limit') || '20')
        const rawOffset = Number(c.req.query('offset') || '0')
        const limit = Number.isFinite(rawLimit) ? Math.min(Math.max(rawLimit, 1), MAX_LIMIT) : 20
        const offset = Number.isFinite(rawOffset) ? Math.max(rawOffset, 0) : 0
        const episodes = await deps.episodeService.getEpisodes(limit, offset)
        c.header('Cache-Control', 'public, max-age=0, s-maxage=300, stale-while-revalidate=60')
        return c.json(episodes)
    })

    return api
}
