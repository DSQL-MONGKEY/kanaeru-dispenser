'use client';

import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { IconCheckbox, IconWhirl } from '@tabler/icons-react';
import { Badge } from '@/components/ui/badge';
import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';
import { Skeleton } from '@/components/ui/skeleton';

export function PumpCard() {
  const { data: response, isLoading } = useSWR('/api/pump-settings', fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 10 * 60 * 1000
  });

  return (
    <Card className='@container/card'>
      <CardHeader>
        <CardDescription>Pump Chamber</CardDescription>
        <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
          {isLoading ? (
            <Skeleton className='h-2 w-20' />
          ) : (
            response?.data.length
          )}
        </CardTitle>
        <CardAction>
          <Badge variant='outline'>
            <IconWhirl />
            Pump
          </Badge>
        </CardAction>
      </CardHeader>
      <CardFooter className='flex-col items-start gap-1.5 text-sm'>
        <div className='line-clamp-1 flex gap-2 font-medium'>
          Currently available pump
          <IconCheckbox className='size-4' />
        </div>
        <div className='text-muted-foreground'>
          Every pump have different flavour
        </div>
      </CardFooter>
    </Card>
  );
}
