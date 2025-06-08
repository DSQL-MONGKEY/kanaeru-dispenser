import FormCardSkeleton from '@/components/form-card-skeleton';
import PageContainer from '@/components/layout/page-container';
import { Suspense } from 'react';
import MixManualViewPage from '@/features/mix/manual/components/mix-manual-view-page';

export const metadata = {
  title: 'Dashboard : Mix Manual Recipe View'
};

type PageProps = { params: Promise<{ mixManualId: string }> };

export default async function Page(props: PageProps) {
  const params = await props.params;
  return (
    <PageContainer scrollable>
      <div className='flex-1 space-y-4'>
        <Suspense fallback={<FormCardSkeleton />}>
          <MixManualViewPage mixManualId={params.mixManualId} />
        </Suspense>
      </div>
    </PageContainer>
  );
}
