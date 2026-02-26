import { formatMoney } from '../lib/format'

export const SalesInfo = ({
    totalSales,
    winType1,
    winType2,
    winType3,
}: {
    totalSales: number
    winType1?: number | null
    winType2?: number | null
    winType3?: number | null
}) => (
    <div className='grid grid-cols-2 gap-4 text-sm'>
        <div>
            <span className='text-muted-foreground'>총 판매금액</span>
            <p className='font-semibold'>{formatMoney(totalSales)}</p>
        </div>
        {(winType1 != null || winType2 != null || winType3 != null) && (
            <div>
                <span className='text-muted-foreground'>1등 당첨 유형</span>
                <p className='font-semibold'>
                    자동 {winType1 ?? 0} / 수동 {winType2 ?? 0} / 반자동 {winType3 ?? 0}
                </p>
            </div>
        )}
    </div>
)
