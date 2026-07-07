import { ComponentProps } from 'react'
import { cn } from '@/lib/cn'

export function Card({ className, ...props }: ComponentProps<'div'>) {
    return (
        <div
            className={cn(
                'rounded-[28px] border border-white/10 bg-surface-100/80 shadow-[0_20px_60px_rgba(2,6,23,0.35)] backdrop-blur',
                className,
            )}
            {...props}
        />
    )
}
