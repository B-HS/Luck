import { Hono } from 'hono'
import { renderToString } from 'react-dom/server'
import type { LottoService } from '../services/lotto-service'
import type { EpisodeService } from '../services/episode-service'
import { Layout } from '../ui/layout'
import { ResultPage } from '../ui/result-page'
import { NotFoundPage } from '../ui/not-found-page'
import { getCacheHeader } from '../lib/cache-header'

export const createPagesRouter = (deps: { lottoService: LottoService; episodeService: EpisodeService }) => {
    const pages = new Hono()

    const renderHtml = (element: React.ReactElement) => {
        const html = renderToString(element)
        return `<!DOCTYPE html>${html}`
    }

    pages.get('/', async (c) => {
        const latestEpisode = deps.episodeService.getLatestEpisodeNumber()
        const result = await deps.lottoService.getResult(latestEpisode)

        c.header('Cache-Control', 'public, max-age=0, s-maxage=300, stale-while-revalidate=60')

        if (!result) {
            const prevResult = await deps.lottoService.getResult(latestEpisode - 1)
            if (prevResult) {
                const html = renderHtml(
                    <Layout title={`제 ${latestEpisode - 1}회 추첨결과 - 로또 6/45`}>
                        <ResultPage result={prevResult} latestEpisode={latestEpisode} />
                    </Layout>,
                )
                return c.html(html)
            }

            const html = renderHtml(
                <Layout>
                    <NotFoundPage episode={latestEpisode} />
                </Layout>,
            )
            return c.html(html)
        }

        const html = renderHtml(
            <Layout title={`제 ${latestEpisode}회 추첨결과 - 로또 6/45`}>
                <ResultPage result={result} latestEpisode={latestEpisode} />
            </Layout>,
        )
        return c.html(html)
    })

    pages.get('/episode/:id', async (c) => {
        const id = Number(c.req.param('id'))
        if (!Number.isInteger(id) || id < 1 || id > 9999) {
            return c.redirect('/')
        }

        const latestEpisode = deps.episodeService.getLatestEpisodeNumber()
        const result = await deps.lottoService.getResult(id)

        if (!result) {
            c.header('Cache-Control', 'no-cache')
            const html = renderHtml(
                <Layout title={`제 ${id}회 - 로또 6/45`}>
                    <NotFoundPage episode={id} />
                </Layout>,
            )
            return c.html(html, 404)
        }

        c.header('Cache-Control', getCacheHeader(id, latestEpisode))

        const html = renderHtml(
            <Layout title={`제 ${id}회 추첨결과 - 로또 6/45`}>
                <ResultPage result={result} latestEpisode={latestEpisode} />
            </Layout>,
        )
        return c.html(html)
    })

    return pages
}
