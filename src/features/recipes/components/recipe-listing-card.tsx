'use client';

import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { DataTableSkeleton } from "@/components/ui/table/data-table-skeleton";
import { toast } from "sonner";
import { Card, CardTitle } from "@/components/ui/card";

export default function RecipeListingCard() {
   const { data:response, error, isLoading } = useSWR('/api/recipes', fetcher);

   if(isLoading) {
      return (
         <DataTableSkeleton columnCount={5} rowCount={8} filterCount={2} />
      );
   }

   const recipesData = response.data ?? [];
   const totalItems = response.data.length ?? 0;

   if(error) {
      toast('Error fetching data', {
         description: `details: ${error}`
      })
   }

   return (
      <div className="flex flex-col gap-2">
         <p>Total recipes {totalItems}</p>
         <div className="grid gid-cols-1 md:grid-cols-5 gap-5 px-4">
            {recipesData.map((r:any, i:number) => (
               <Card key={r.id + i} className="text-center">
                  <CardTitle>{r.name}</CardTitle>
               </Card>
            ))}
         </div>
      </div>
   )
}