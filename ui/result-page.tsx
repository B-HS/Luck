import { Card, CardContent, CardHeader } from '../ui/components/card'
import { EpisodeHeader } from './episode-header'
import { WinningNumbers } from './winning-numbers'
import { PrizeTable } from './prize-table'
import { SalesInfo } from './sales-info'
import type { lottoResults } from '../db/schema'

type LottoResult = typeof lottoResults.$inferSelect

const MATCH_DESCS = ['6개 번호 일치', '5개 번호 + 보너스 일치', '5개 번호 일치', '4개 번호 일치', '3개 번호 일치']

export const ResultPage = ({ result, latestEpisode }: { result: LottoResult; latestEpisode: number }) => {
    const numbers = [result.num1, result.num2, result.num3, result.num4, result.num5, result.num6]

    const prizeRows = [
        {
            rank: 1,
            matchDesc: MATCH_DESCS[0]!,
            winners: result.rank1Winners,
            prize: result.rank1Prize,
            totalPrize: result.rank1TotalPrize,
        },
        {
            rank: 2,
            matchDesc: MATCH_DESCS[1]!,
            winners: result.rank2Winners,
            prize: result.rank2Prize,
            totalPrize: result.rank2TotalPrize,
        },
        {
            rank: 3,
            matchDesc: MATCH_DESCS[2]!,
            winners: result.rank3Winners,
            prize: result.rank3Prize,
            totalPrize: result.rank3TotalPrize,
        },
        {
            rank: 4,
            matchDesc: MATCH_DESCS[3]!,
            winners: result.rank4Winners,
            prize: result.rank4Prize,
            totalPrize: result.rank4TotalPrize,
        },
        {
            rank: 5,
            matchDesc: MATCH_DESCS[4]!,
            winners: result.rank5Winners,
            prize: result.rank5Prize,
            totalPrize: result.rank5TotalPrize,
        },
    ]

    return (
        <div className='max-w-2xl mx-auto p-4 space-y-6'>
            <EpisodeHeader episode={result.episodeId} drawDate={result.drawDate} latestEpisode={latestEpisode} />

            <Card>
                <CardHeader className='text-center'>
                    <h2 className='text-lg font-semibold'>당첨번호</h2>
                </CardHeader>
                <CardContent>
                    <WinningNumbers numbers={numbers} bonusNumber={result.bonusNum} />
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <h2 className='text-lg font-semibold'>당첨 현황</h2>
                </CardHeader>
                <CardContent>
                    <PrizeTable rows={prizeRows} />
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <h2 className='text-lg font-semibold'>판매 정보</h2>
                </CardHeader>
                <CardContent>
                    <SalesInfo totalSales={result.totalSales} winType1={result.winType1} winType2={result.winType2} winType3={result.winType3} />
                </CardContent>
            </Card>
        </div>
    )
}
