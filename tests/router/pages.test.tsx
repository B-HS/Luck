import { describe, expect, test, mock } from 'bun:test'
import { createPagesRouter } from '../../router/pages'

const makeMockResult = (episodeId: number) => ({
    id: 1,
    episodeId,
    num1: 3,
    num2: 10,
    num3: 15,
    num4: 22,
    num5: 33,
    num6: 44,
    bonusNum: 7,
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

describe('Pages Router SEO', () => {
    test('/ 경로에서 og:title 메타태그 포함', async () => {
        const deps = createMockDeps(makeMockResult(1210))
        const pages = createPagesRouter(deps)
        const res = await pages.request('/')
        const html = await res.text()
        expect(html).toContain('og:title')
        expect(html).toContain('제 1210회 추첨결과 - 로또 6/45')
    })

    test('/ 경로에서 og:description에 당첨번호 포함', async () => {
        const deps = createMockDeps(makeMockResult(1210))
        const pages = createPagesRouter(deps)
        const res = await pages.request('/')
        const html = await res.text()
        expect(html).toContain('3 10 15 22 33 44 + 7')
    })

    test('/ 경로에서 og:image 메타태그 포함', async () => {
        const deps = createMockDeps(makeMockResult(1210))
        const pages = createPagesRouter(deps)
        const res = await pages.request('/')
        const html = await res.text()
        expect(html).toContain('og:image')
        expect(html).toContain('/og/1210')
    })

    test('/ 경로에서 twitter:card 메타태그 포함', async () => {
        const deps = createMockDeps(makeMockResult(1210))
        const pages = createPagesRouter(deps)
        const res = await pages.request('/')
        const html = await res.text()
        expect(html).toContain('summary_large_image')
    })

    test('/ 경로에서 author 메타태그 포함', async () => {
        const deps = createMockDeps(makeMockResult(1210))
        const pages = createPagesRouter(deps)
        const res = await pages.request('/')
        const html = await res.text()
        expect(html).toContain('Hyunseok Byun')
    })

    test('/ 경로에서 favicon 포함', async () => {
        const deps = createMockDeps(makeMockResult(1210))
        const pages = createPagesRouter(deps)
        const res = await pages.request('/')
        const html = await res.text()
        expect(html).toContain('https://blog.gumyo.net/favicon.ico')
    })

    test('/episode/:id 경로에서 SEO 메타태그 포함', async () => {
        const result = makeMockResult(1200)
        const deps = createMockDeps(result)
        deps.lottoService.getResult = mock(() => Promise.resolve(result))
        const pages = createPagesRouter(deps)
        const res = await pages.request('/episode/1200')
        const html = await res.text()
        expect(html).toContain('제 1200회 추첨결과 - 로또 6/45')
        expect(html).toContain('/og/1200')
        expect(html).toContain('3 10 15 22 33 44 + 7')
    })

    test('결과 없을 때 fallback 처리', async () => {
        let callCount = 0
        const prevResult = makeMockResult(1209)
        const deps = createMockDeps(null)
        deps.lottoService.getResult = mock(() => {
            callCount++
            if (callCount === 1) return Promise.resolve(null)
            return Promise.resolve(prevResult)
        })
        const pages = createPagesRouter(deps)
        const res = await pages.request('/')
        const html = await res.text()
        expect(html).toContain('제 1209회 추첨결과 - 로또 6/45')
        expect(html).toContain('/og/1209')
    })
})
