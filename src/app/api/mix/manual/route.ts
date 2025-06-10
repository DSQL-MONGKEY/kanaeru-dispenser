import mqttClient from "@/lib/mqtt-client";
import { supabase } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
   try {
      const body = await req.json();

      const {
         name,
         total_ml,
         composition,
      } = body;

      const pumpNumbers = composition.map((c: any) => c.pump_number);

      const { data:pumpSettings, error:pumpSettingsError } = await supabase
         .from('pump_settings')
         .select('pump_number, flow_rate')
         .in('pump_number', pumpNumbers);

      if(!pumpSettings || pumpSettingsError) {
         return NextResponse.json({
         success: false,
         error: 'Request Failed',
         details: pumpSettingsError?.message || 'Pump number not found',
         }, { status: 404 });
      }

      const flowRateMap = pumpSettings.reduce((map: any, setting: any) => {
         map[setting.pump_number] = setting.flow_rate;
         return map;
      }, {});

      let estimationTime = 0;
      const calculatedComposition = composition.map((c:any) => {
         const ml_portion = (c.percentage * total_ml) / 100;
         
         const active_time = (ml_portion / flowRateMap[c.pump_number]) * 1000;

         estimationTime += active_time!;
         return {
            ...c,
            ml_portion,
            active_time
         }
      });
      
      const mqttPayload = {
         composition: calculatedComposition
      }
      mqttClient.publish(
         'multidispenser/mix',
         JSON.stringify(mqttPayload),
         { qos: 0 },
         (err) => {
            // eslint-disable-next-line no-console
            if(err) console.error('Error publishing MQTT: ', err);
         }
      );

      const { data:mixLog, error:mixLogError } = await supabase
         .from('mix_logs')
         .insert({
            name,
            mode: 'manual',
            recipe_id: null,
            total_volume: total_ml
         })
         .select()
         .single();

      if(!mixLog || mixLogError) {
         return NextResponse.json({
            success: false,
            error: 'Failed to send logs',
            details: mixLogError?.message || 'Logs error',
         }, { status: 500 });
      }

      const detailsToInsert = calculatedComposition.map((pump: any) => ({
         mix_log_id: mixLog.id,
         pump_number: pump.pump_number,
         volume_ml: pump.ml_portion
      }));

      const { error:mixLogDetailError } = await supabase
         .from('mix_log_details')
         .insert(detailsToInsert)

      if(mixLogDetailError) {
         NextResponse.json({
            success: false,
            error: 'Failed to send log details',
            message: mixLogDetailError?.message || 'Error log details'
         })
      }

      return NextResponse.json({
         success: true,
         data: {
            estimation_time: estimationTime,
            mix_log: mixLog
         },
      }, { status: 201 });

   } catch(error) {

      if(error instanceof Error) {
         return NextResponse.json({
            success: false,
            error: 'An error occurred while processing your request',
            details: error.message
         }, { status: 500});
      }

   }
}

export async function GET() {
   try {
      const { data:mixManual, error:mixManualError } = await supabase
      .from('mix_logs')
      .select('*')
      .eq('mode', 'manual')
      .order('created_at', { ascending: false });

      if(!mixManual || mixManualError) {
         return NextResponse.json({
            success: false,
            error: 'Failed to get logs',
            details: mixManualError?.message || 'Logs error',
         }, { status: 500 });
      }

      return NextResponse.json({
         success: true,
         data: mixManual,
      }, { status: 200 });

   } catch(error) {
      if(error instanceof Error) {
         return NextResponse.json({
            success: false,
            error: 'An error occurred while processing your request',
            details: error.message
         }, { status: 500});
      }
   }
}