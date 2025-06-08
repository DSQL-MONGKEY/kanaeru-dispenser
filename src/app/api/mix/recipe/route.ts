import mqttClient from "@/lib/mqtt-client";
import { supabase } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
   try {
      const body = await req.json();

      const {
         recipe_id,
         total_ml,
      } = body;

      const { data:recipe, error:recipeError } = await supabase
         .from('recipes')
         .select('id, name')
         .eq('id', recipe_id)
         .single();

      if(!recipe || recipeError) {
         return NextResponse.json({
            success: false,
            error: 'Failed to process request',
            details: recipeError.message || 'Recipe not found'
         }, { status: 404 });
      }
      const recipeDbId = recipe.id;

      const { data:recipeDetails, error:recipeDetailsError } = await supabase
         .from('recipe_details')
         .select('pump_number, percentage')
         .eq('recipe_id', recipeDbId);

      if(!recipeDetails || recipeDetailsError) {
         return NextResponse.json({
            success: false,
            error: 'Recipe details not found',
            details: recipeDetailsError?.message
         }, { status: 404 });
      }

      const pumpNumbers = recipeDetails.map((d) => d.pump_number);

      const { data:pumpSettings, error:pumpSettingsError } = await supabase
         .from('pump_settings')
         .select('*, pump_number, flow_rate')
         .in('pump_number', pumpNumbers);

      if (!pumpSettings || pumpSettingsError) {
         return NextResponse.json({
         success: false,
         error: 'Pump settings not found',
         details: pumpSettingsError?.message,
         }, { status: 404 });
      }

      const flowRateMap = pumpSettings.reduce((map:any, setting:any) => {
         map[setting.pump_number] = setting.flow_rate;
         return map;
      }, {});

      let estimationTime = 0;
      const calculatedComposition = recipeDetails.map((d:any) => {
         const ml_portion = (d.percentage * total_ml) / 100;
         const flow_rate = flowRateMap[d.pump_number];

         const active_time = flow_rate ? (ml_portion / flow_rate) * 1000 : null;

         estimationTime += active_time!;
         return {
            pump_number: d.pump_number,
            percentage: d.percentage,
            ml_portion,
            active_time
         }
      });

      const mqttPayload = {
         composition: calculatedComposition,
      }

      mqttClient.publish(
         'multidispenser/mix',
         JSON.stringify(mqttPayload),
         { qos: 0 },
         (err) => {
            // eslint-disable-next-line no-console
            if(err) console.error('Error publishing MQTT: ', err.message);
         }
      );

      const { data:mixLog, error:mixLogError } = await supabase
         .from('mix_logs')
         .insert({
            mode: 'recipe',
            recipe_id: recipeDbId,
            total_volume: total_ml
         })
         .select()
         .single();

      if (!mixLog || mixLogError) {
         return NextResponse.json({
            success: false,
            error: 'Failed to save mix log',
            details: mixLogError?.message,
         }, { status: 500 });
      }
      const mixLogDbId = mixLog.id;

      const logDetailsPayload = calculatedComposition.map((c:any) => ({
         mix_log_id: mixLogDbId,
         pump_number: c.pump_number,
         volume_ml: c.ml_portion,
      }))

      const { data:mixLogDetails, error:mixLogDetailsError } = await supabase
         .from('mix_log_details')
         .insert(logDetailsPayload)
         .select();

      if (!mixLogDetails || mixLogDetailsError) {
         return NextResponse.json({
            success: false,
            error: 'Failed to save mix log details',
            details: mixLogDetailsError?.message,
         }, { status: 500 });
      }

         return NextResponse.json({
            success: true,
            data: {
               estimation_time: estimationTime,
               mix_log: mixLog,
               mix_log_details: mixLogDetails,
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
      const { data:mixedRecipe, error:mixedRecipeError } = await supabase
      .from('mix_logs')
      .select(`*, recipes(name)`)
      .eq('mode', 'recipe')
      .order('created_at', { ascending: false });

      if(!mixedRecipe || mixedRecipeError) {
         return NextResponse.json({
            success: false,
            error: 'Failed to get logs',
            details: mixedRecipeError?.message || 'Logs error',
         }, { status: 500 });
      }

      return NextResponse.json({
         success: true,
         data: mixedRecipe,
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
