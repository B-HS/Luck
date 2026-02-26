import { LottoBall } from './lotto-ball'

export const WinningNumbers = ({ numbers, bonusNumber }: { numbers: number[]; bonusNumber: number }) => (
    <div className='flex items-center gap-2 flex-wrap justify-center'>
        {numbers.map((num, i) => (
            <LottoBall key={i} number={num} size='lg' />
        ))}
        <span className='text-2xl font-bold text-muted-foreground mx-1'>+</span>
        <LottoBall number={bonusNumber} size='lg' />
    </div>
)
