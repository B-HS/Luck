import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/components/table'
import { formatMoney, formatCount } from '../lib/format'

interface PrizeRow {
    rank: number
    matchDesc: string
    winners: number
    prize: number
    totalPrize: number
}

export const PrizeTable = ({ rows }: { rows: PrizeRow[] }) => (
    <Table>
        <TableHeader>
            <TableRow>
                <TableHead className='text-center'>등위</TableHead>
                <TableHead className='text-center'>당첨 조건</TableHead>
                <TableHead className='text-center'>당첨자 수</TableHead>
                <TableHead className='text-right'>1인당 당첨금</TableHead>
                <TableHead className='text-right'>등위별 총 당첨금</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {rows.map((row) => (
                <TableRow key={row.rank}>
                    <TableCell className='text-center font-medium'>{row.rank}등</TableCell>
                    <TableCell className='text-center'>{row.matchDesc}</TableCell>
                    <TableCell className='text-center'>{formatCount(row.winners)}</TableCell>
                    <TableCell className='text-right'>{formatMoney(row.prize)}</TableCell>
                    <TableCell className='text-right'>{formatMoney(row.totalPrize)}</TableCell>
                </TableRow>
            ))}
        </TableBody>
    </Table>
)
