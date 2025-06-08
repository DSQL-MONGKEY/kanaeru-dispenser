import { supabase } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
   try {
      const body = await req.json();

      const {
         pump_number,
         flow_rate
      } = body;

      const { data: pumpData, error: pumpError } = await supabase
         .from('pump_settings')
         .insert({
            pump_number,
            flow_rate
         })
         .select();

      if(!pumpData || pumpError) {
         return NextResponse.json({
            success: false,
            error: 'Error creating climber user',
            details: pumpError.message
         }, { status: 500 });
      }

      return NextResponse.json({
         success: true,
         data: pumpData,
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
      const { data, error } = await supabase
      .from('pump_settings')
      .select('*')
      .order('pump_number', { ascending: true });

      if(!data || error) {
         return NextResponse.json({
            success: false,
            error: 'An error occurred while processing your request',
            details: error.message
         }, { status: 500 });
      }
      return NextResponse.json({
         success: true,
         data,
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