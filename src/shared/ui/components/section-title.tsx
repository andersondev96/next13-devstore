import { ComponentProps } from 'react'
import { cn } from '@/shared/lib/cn'

interface SectionTitleProps extends ComponentProps<'div'> {
    eyebrow?: string
    title: string
    description?: string
}

export function SectionTitle({
    eyebrow,
    title,
    description,
    className,
    ...props
}: SectionTitleProps) {
    return (
        <div className={cn('space-y-2', className)} {...props}>
            {eyebrow ? (
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-300">
                    {eyebrow}
                </p>
            ) : null}
            <h2 className="text-2xl font-semibold text-white sm:text-3xl">{title}</h2>
            {description ? (
                <p className="max-w-2xl text-sm leading-7 text-slate-300">{description}</p>
            ) : null}
        </div>
    )
}
