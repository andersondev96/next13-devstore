import { ComponentProps } from 'react'
import { cn } from '@/lib/cn'

const variants = {
    primary:
        'bg-brand-500 text-white shadow-[0_10px_30px_rgba(125,211,252,0.25)] hover:bg-brand-600',
    secondary:
        'border border-white/10 bg-surface-100 text-surface-foreground hover:bg-surface-200',
    ghost: 'text-surface-foreground hover:bg-surface-100/70',
} as const

const sizes = {
    sm: 'h-10 px-4 text-sm',
    md: 'h-12 px-5 text-sm',
    lg: 'h-14 px-6 text-base',
} as const

interface ButtonProps extends ComponentProps<'button'> {
    variant?: keyof typeof variants
    size?: keyof typeof sizes
}

export function Button({
    className,
    variant = 'primary',
    size = 'md',
    ...props
}: ButtonProps) {
    return (
        <button
            className={cn(
                'inline-flex items-center justify-center rounded-full font-semibold transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-400',
                variants[variant],
                sizes[size],
                className,
            )}
            {...props}
        />
    )
}
