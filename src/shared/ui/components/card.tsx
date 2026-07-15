import { ComponentProps } from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cn } from '@/shared/lib/cn'

interface CardProps extends ComponentProps<'div'> {
    asChild?: boolean
}

export function Card({ className, asChild = false, ...props }: CardProps) {
    const Comp = asChild ? Slot : 'div'

    return (
        <Comp
            className={cn(
                'rounded-[28px] border border-white/10 bg-surface-100/80 shadow-[0_20px_60px_rgba(2,6,23,0.35)] backdrop-blur',
                className,
            )}
            {...props}
        />
    )
}