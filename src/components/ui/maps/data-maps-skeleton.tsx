import { Skeleton } from '../skeleton';

export function MapSkeleton() {
  return (
    <div className='flex h-[500px] w-full'>
      <Skeleton className='h-full w-full rounded-md' />
    </div>
  );
}
