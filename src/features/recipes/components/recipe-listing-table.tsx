'use client';

import useSWR from 'swr';
import { MixRecipeDataTable } from './recipe-tables';
import { columns } from './recipe-tables/columns';
import { fetcher } from '@/lib/fetcher';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import { toast } from 'sonner';

export default function RecipeListingTable() {
  const {
    data: response,
    error,
    isLoading
  } = useSWR('/api/mix/recipe', fetcher);

  if (isLoading) {
    return <DataTableSkeleton columnCount={5} rowCount={8} filterCount={2} />;
  }

  const MixData = response.data ?? [];
  const totalItems = response.data.length ?? 0;

  if (error) {
    toast('Error fetching data', {
      description: `details: ${error}`
    });
  }

  return (
    <MixRecipeDataTable
      data={MixData}
      totalItems={totalItems}
      columns={columns}
    />
  );
}
