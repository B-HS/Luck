type FetchFn = typeof fetch

interface DhlotteryItem {
    ltEpsd: number
    ltRflYmd: string
    tm1WnNo: number
    tm2WnNo: number
    tm3WnNo: number
    tm4WnNo: number
    tm5WnNo: number
    tm6WnNo: number
    bnsWnNo: number
    rnk1WnNope: number
    rnk1WnAmt: number
    rnk1SumWnAmt: number
    rnk2WnNope: number
    rnk2WnAmt: number
    rnk2SumWnAmt: number
    rnk3WnNope: number
    rnk3WnAmt: number
    rnk3SumWnAmt: number
    rnk4WnNope: number
    rnk4WnAmt: number
    rnk4SumWnAmt: number
    rnk5WnNope: number
    rnk5WnAmt: number
    rnk5SumWnAmt: number
    wholEpsdSumNtslAmt: number
    rlvtEpsdSumNtslAmt: number
    winType0: number
    winType1: number
    winType2: number
    winType3: number
    sumWnNope: number
    gmSqNo: number
}

export interface DhlotteryResponse {
    data: {
        list: DhlotteryItem[]
    }
}

export const createDhlotteryClient = (fetchFn: FetchFn) => ({
    fetchResult: async (episode: number) => {
        const url = 'https://www.dhlottery.co.kr/lt645/selectPstLt645InfoNew.do'
        const params = new URLSearchParams({
            srchLtEpsd: String(episode),
        })

        const res = await fetchFn(`${url}?${params}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'User-Agent': 'lotto-checker/1.0',
            },
            signal: AbortSignal.timeout(10_000),
        })

        if (!res.ok) {
            throw new Error('동행복권 API 요청 실패')
        }

        const MAX_RESPONSE_SIZE = 1024 * 512
        const text = await res.text()
        if (text.length > MAX_RESPONSE_SIZE) {
            throw new Error('동행복권 API 응답이 너무 큽니다')
        }

        const json = JSON.parse(text)
        const list = json?.data?.list
        if (!Array.isArray(list) || list.length === 0) {
            return null
        }

        const item = list.find((i: DhlotteryItem) => i.ltEpsd === episode) ?? list[0]!

        const isValidLottoNum = (n: unknown): n is number =>
            typeof n === 'number' && Number.isInteger(n) && n >= 1 && n <= 45

        const nums = [item.tm1WnNo, item.tm2WnNo, item.tm3WnNo, item.tm4WnNo, item.tm5WnNo, item.tm6WnNo, item.bnsWnNo]
        if (!nums.every(isValidLottoNum)) {
            throw new Error('동행복권 API 응답 데이터가 유효하지 않습니다')
        }

        if (typeof item.ltEpsd !== 'number' || typeof item.ltRflYmd !== 'string') {
            throw new Error('동행복권 API 응답 데이터가 유효하지 않습니다')
        }

        return {
            episodeId: item.ltEpsd,
            num1: item.tm1WnNo,
            num2: item.tm2WnNo,
            num3: item.tm3WnNo,
            num4: item.tm4WnNo,
            num5: item.tm5WnNo,
            num6: item.tm6WnNo,
            bonusNum: item.bnsWnNo,
            drawDate: item.ltRflYmd,
            rank1Winners: item.rnk1WnNope,
            rank1Prize: item.rnk1WnAmt,
            rank1TotalPrize: item.rnk1SumWnAmt,
            rank2Winners: item.rnk2WnNope,
            rank2Prize: item.rnk2WnAmt,
            rank2TotalPrize: item.rnk2SumWnAmt,
            rank3Winners: item.rnk3WnNope,
            rank3Prize: item.rnk3WnAmt,
            rank3TotalPrize: item.rnk3SumWnAmt,
            rank4Winners: item.rnk4WnNope,
            rank4Prize: item.rnk4WnAmt,
            rank4TotalPrize: item.rnk4SumWnAmt,
            rank5Winners: item.rnk5WnNope,
            rank5Prize: item.rnk5WnAmt,
            rank5TotalPrize: item.rnk5SumWnAmt,
            totalSales: item.wholEpsdSumNtslAmt,
            relatedSales: item.rlvtEpsdSumNtslAmt,
            winType0: item.winType0,
            winType1: item.winType1,
            winType2: item.winType2,
            winType3: item.winType3,
            totalWinners: item.sumWnNope,
            gameSeqNo: item.gmSqNo,
        }
    },
})

export type DhlotteryClient = ReturnType<typeof createDhlotteryClient>
