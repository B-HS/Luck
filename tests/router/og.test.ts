import { describe, expect, test, mock } from 'bun:test'
import { createOgRouter } from '../../router/og'
import { createLruCache } from '../../lib/lru-cache'

const makeMockResult = (episodeId: number) => ({
    id: 1,
    episodeId,
    num1: 1,
    num2: 7,
    num3: 9,
    num4: 17,
    num5: 27,
    num6: 38,
    bonusNum: 31,
    drawDate: '20260221',
    rank1Winners: 24,
    rank1Prize: 1102298407,
    rank1TotalPrize: 26455161768,
    rank2Winners: 153,
    rank2Prize: 28818259,
    rank2TotalPrize: 4409193627,
    rank3Winners: 4649,
    rank3Prize: 948418,
    rank3TotalPrize: 4409195282,
    rank4Winners: 211663,
    rank4Prize: 50000,
    rank4TotalPrize: 10583150000,
    rank5Winners: 3139766,
    rank5Prize: 5000,
    rank5TotalPrize: 15698830000,
    totalSales: 123111058000,
    relatedSales: 123111058000,
    winType0: 0,
    winType1: 20,
    winType2: 2,
    winType3: 2,
    totalWinners: 3356255,
    gameSeqNo: 1,
})

const createMockDeps = (result: ReturnType<typeof makeMockResult> | null) => ({
    lottoService: {
        getResult: mock(() => Promise.resolve(result)),
    },
    episodeService: {
        getLatestEpisodeNumber: mock(() => 1210),
        syncEpisodes: mock(() => Promise.resolve()),
    },
})

describe('OG Router', () => {
    test('유효하지 않은 에피소드 ID에 404 반환', async () => {
        const deps = createMockDeps(null)
        const og = createOgRouter(deps)
        const res = await og.request('/abc')
        expect(res.status).toBe(404)
    })

    test('범위 벗어난 에피소드 ID에 404 반환', async () => {
        const deps = createMockDeps(null)
        const og = createOgRouter(deps)
        const res = await og.request('/0')
        expect(res.status).toBe(404)
    })

    test('결과 없는 에피소드에 404 반환', async () => {
        const deps = createMockDeps(null)
        const og = createOgRouter(deps)
        const res = await og.request('/9999')
        expect(res.status).toBe(404)
        expect(deps.lottoService.getResult).toHaveBeenCalledWith(9999)
    })

    test('음수 에피소드 ID에 404 반환', async () => {
        const deps = createMockDeps(null)
        const og = createOgRouter(deps)
        const res = await og.request('/-1')
        expect(res.status).toBe(404)
    })

    test('10000 이상 에피소드 ID에 404 반환', async () => {
        const deps = createMockDeps(null)
        const og = createOgRouter(deps)
        const res = await og.request('/10000')
        expect(res.status).toBe(404)
    })
})
