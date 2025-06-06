import { supabase } from "@/lib/supabase/server";
import { NextResponse } from "next/server";


export async function POST(req: Request) {
   try {
      const body = await req.json();
      const { name, composition } = body;

      if (!name || !composition || !Array.isArray(composition)) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
      }

      const { data: recipe, error: insertError } = await supabase
         .from('recipes')
         .insert({ name })
         .select()
         .single();

      if (insertError) {
         return NextResponse.json({ 
            error: insertError.message 
         }, { status: 500 });
      }

      const details = composition.map((c) => ({
         recipe_id: recipe.id,
         pump_number: c.pump_number,
         percentage: c.percentage,
      }));

      const { data: detail, error: detailError } = await supabase
         .from('recipe_details')
         .insert(details)
         .select(`*`);

      if (detailError) {
         return NextResponse.json({
            error: detailError.message
         }, { status: 500 });
      }

      return NextResponse.json({ 
         message: 'Resep berhasil disimpan',
         data: {
            recipe,
            composition: detail
         }
      }, { status: 201 });
   } catch(error) {
      if(error instanceof Error) {
         return NextResponse.json({
            error: 'Errors occured',
            message: error.message
         }, { status: 500 });
      }
   }
}


export async function GET() {
   try {
      const { data: recipe, error: recipeError } = await supabase
      .from('recipes')
      .select(`*`)
      .order('created_at', { ascending: true });

      if(recipeError) {
         return NextResponse.json({
            success: false,
            error: 'An error occurred while processing your request',
            details: recipeError.message
         }, { status: 500 });
      }

      return NextResponse.json({
         success: true,
         data: recipe
      })

   } catch(error) {
      if(error instanceof Error) {
         return NextResponse.json({
            error: 'Request failed',
            message: error.message
         }, { status: 500 });
      }
   }
}