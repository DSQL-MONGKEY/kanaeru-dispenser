import { supabase } from "@/lib/supabase/server";
import { NextResponse } from "next/server";


export async function GET() {
   try {
      const { data:mixLog, error:mixLogError } = await supabase
         .from('mix_logs')
         .select(`*, id, mode, recipe_id, total_volume, created_at, recipes(name)`)
         .order('created_at', { ascending: false });

      if(!mixLog || mixLogError) {
         return NextResponse.json({
            success: false,
            error: 'Failed to fetch mix logs',
            details: mixLogError?.message,
         }, { status: 500 });
      }
      const mixLogIds = mixLog.map((log:any) => log.id);

      const { data:mixLogDetails, error:mixLogDetailsError } = await supabase
         .from('mix_log_details')
         .select('mix_log_id, pump_number, volume_ml')
         .in('mix_log_id', mixLogIds);

      if(!mixLogDetails || mixLogDetailsError) {
         return NextResponse.json({
            success: false,
            error: 'Failed to fetch mix log details',
            details: mixLogDetailsError?.message
         }, { status: 500 });
      }

      const mixLogDetailsMap = mixLogDetails.reduce((map:any, detail:any) => {
         if(!map[detail.mix_log_id]) {
            map[detail.mix_log_id] = [];
         }

         map[detail.mix_log_id].push({
            pump_number: detail.pump_number,
            volume_ml: detail.volume_ml
         });
         
         return map;
      }, {});
      
      const responseData = mixLog.map((log:any) => ({
         id: log.id,
         mode: log.mode,
         volume: log.total_volume,
         created_at: log.created_at,
         recipe_name: log.recipes ? log.recipes.name : null,
         composition: mixLogDetailsMap[log.id] || [],
      }));


      return NextResponse.json({
         success: true,
         data: responseData,
      }, { status: 200 });

   } catch(error) {

      if(error instanceof Error) {
         return NextResponse.json({
            success: false,
            error: 'An error occurred while processing your request',
            details: error.message,
         }, { status: 500 });
      }

   }
}