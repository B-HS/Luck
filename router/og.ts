import { Hono } from 'hono'
import type { LottoService } from '../services/lotto-service'
import type { EpisodeService } from '../services/episode-service'
import { generateOgImage } from '../services/og-image'

export const createOgRouter = (deps: { lottoService: LottoService; episodeService: EpisodeService }) => {
    const og = new Hono()

    og.get('/:episode', async (c) => {
        const episode = Number(c.req.param('episode'))
        if (!Number.isInteger(episode) || episode < 1 || episode > 9999) {
            return c.text('Not Found', 404)
        }

        const result = await deps.lottoService.getResult(episode)
        if (!result) {
            return c.text('Not Found', 404)
        }

        const buffer = await generateOgImage({
            episode,
            numbers: [result.num1, result.num2, result.num3, result.num4, result.num5, result.num6],
            bonusNumber: result.bonusNum,
            drawDate: result.drawDate,
        })

        c.header('Content-Type', 'image/png')
        c.header('Cache-Control', 'public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400')
        return c.body(buffer)
    })

    return og
}
