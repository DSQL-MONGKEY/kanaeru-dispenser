'use client';

import useSWR from "swr";
import { MixLogsDataTable } from "./mix-logs-tables";
import { columns } from "./mix-logs-tables/columns";
import { fetcher } from "@/lib/fetcher";
import { DataTableSkeleton } from "@/components/ui/table/data-table-skeleton";
import { toast } from "sonner";

export default function MixLogsListingTable() {
   const { data:response, error, isLoading } = useSWR('/api/mix-logs', fetcher);

   if(isLoading) {
      return (
         <DataTableSkeleton columnCount={5} rowCount={8} filterCount={2} />
      );
   }

   const MixLogsData = response.data ?? [];
   const totalItems = response.data.length ?? 0;

   if(error) {
      toast('Error fetching data', {
         description: `details: ${error}`
      })
   }

   return (
      <MixLogsDataTable
         data={MixLogsData}
         totalItems={totalItems}
         columns={columns}
      />
   )
}