'use client';

import useSWR from "swr";
import { MixManualDataTable } from "./mix-manual-tables";
import { columns } from "./mix-manual-tables/columns";
import { fetcher } from "@/lib/fetcher";
import { DataTableSkeleton } from "@/components/ui/table/data-table-skeleton";
import { toast } from "sonner";

export default function MixManualListingTable() {
   const { data:response, error, isLoading } = useSWR('/api/mix/manual', fetcher);

   if(isLoading) {
      return (
         <DataTableSkeleton columnCount={5} rowCount={8} filterCount={2} />
      );
   }

   const MixData = response.data ?? [];
   const totalItems = response.data.length ?? 0;

   if(error) {
      toast('Error fetching data', {
         description: `details: ${error}`
      })
   }

   return (
      <MixManualDataTable
         data={MixData}
         totalItems={totalItems}
         columns={columns}
      />
   )
}