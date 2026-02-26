import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { secureHeaders } from 'hono/secure-headers'
import { createDb } from './db/index'
import { createEpisodeRepository } from './repository/episode-repository'
import { createLottoResultRepository } from './repository/lotto-result-repository'
import { createDhlotteryClient } from './services/dhlottery-client'
import { createEpisodeService } from './services/episode-service'
import { createLottoService } from './services/lotto-service'
import { createApiRouter } from './router/api'
import { createPagesRouter } from './router/pages'
import { createLruCache } from './lib/lru-cache'
import { createRateLimiter } from './lib/rate-limiter'
import type { LottoResult } from './services/lotto-service'

const db = createDb({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
})

const episodeRepo = createEpisodeRepository(db)
const lottoResultRepo = createLottoResultRepository(db)
const dhlotteryClient = createDhlotteryClient(fetch)

const episodeService = createEpisodeService({ episodeRepo })
const lruCache = createLruCache<LottoResult>(30)
const lottoService = createLottoService({
    lottoResultRepo,
    episodeRepo,
    dhlotteryClient,
    lruCache,
})

export const app = new Hono()

app.use('*', cors({
    origin: process.env.ALLOWED_ORIGIN ?? 'https://luck.gumyo.net',
    allowMethods: ['GET'],
}))
app.use('*', secureHeaders({
    contentSecurityPolicy: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:'],
        connectSrc: ["'self'"],
        fontSrc: ["'self'"],
        objectSrc: ["'none'"],
        frameAncestors: ["'none'"],
    },
}))
app.use('*', createRateLimiter(60 * 1000, 60))

app.route('/api', createApiRouter({ lottoService, episodeService }))
app.route('/', createPagesRouter({ lottoService, episodeService }))

app.notFound((c) => c.json({ error: 'Not Found' }, 404))

app.onError((err, c) => {
    const safeMessage = String(err.message).slice(0, 200).replace(/[\r\n]/g, ' ')
    console.error('[서버 에러]', safeMessage)
    return c.json({ error: '서버 오류가 발생했습니다' }, 500)
})
