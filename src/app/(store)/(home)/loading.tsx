import { Skeleton } from '@/components/skeleton'

export default function HomeLoading() {
  return (
    <div className="grid h-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <Skeleton className="h-[400px]" />
      <Skeleton className="h-[400px]" />
      <Skeleton className="h-[400px]" />
      <Skeleton className="h-[400px]" />
      <Skeleton className="h-[400px]" />
      <Skeleton className="h-[400px]" />
    </div>
  )
}
