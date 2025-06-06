import { supabase } from "@/lib/supabase/server";
import { NextResponse } from "next/server";


export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
   try {

      const { id } = await params;

      const { data:recipe , error:recipeError } = await supabase
         .from('recipes')
         .select(`*`)
         .eq('id', id)
         .single();
         
      if (!recipe) {
         return NextResponse.json({
            success: false,
            error: 'An error occurred while processing your add tracking request',
            details: 'Recipe not found',
         }, { status: 404 });
      }

      if (recipeError) {
         return NextResponse.json({
            success: false,
            error: 'An error occurred while processing your add tracking request',
            details: recipeError.message
         }, { status: 500 });
      }
      const recipeDbid = recipe?.id;

      const { data:detail, error:detailError } = await supabase
         .from('recipe_details')
         .select('*')
         .eq('recipe_id', recipeDbid)

      if (detailError || !detail) {
         return NextResponse.json({
            success: false,
            error: 'An error occurred while processing your add tracking request',
            details: detailError?.message || 'Recipe not found',
         }, { status: 404 });
      }
      return NextResponse.json({
         success: true,
         data: {
            recipe,
            detail
         },
      }, { status: 200 });
   
   } catch(error) {

      if(error instanceof Error) {
         return NextResponse.json({
            success: false,
            error: 'An error occurred while processing your request',
            details: error.message
         }, { status: 500 });

      }
   }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
   try {
      const { id } = params;
      const body = await req.json();
      const { name, composition } = body;

      // 1. Update nama resep
      const { data: recipe, error: recipeError } = await supabase
         .from('recipes')
         .update({ name })
         .eq('id', id)
         .select()
         .single();

      if (recipeError || !recipe) {
         return NextResponse.json({
         success: false,
         error: 'Failed to update recipe name',
         details: recipeError?.message || 'Recipe not found',
         }, { status: 500 });
      }

      // 2. Hapus recipe_details lama
      const { error: deleteError } = await supabase
         .from('recipe_details')
         .delete()
         .eq('recipe_id', recipe.id);

      if (deleteError) {
         return NextResponse.json({
         success: false,
         error: 'Failed to delete old recipe details',
         details: deleteError.message,
         }, { status: 500 });
      }

      // 3. Masukkan ulang data composition baru
      const newDetails = composition.map((item: { pump_number: number, percentage: number }) => ({
         recipe_id: recipe.id,
         pump_number: item.pump_number,
         percentage: item.percentage,
      }));

      const { data: insertedDetails, error: insertError } = await supabase
         .from('recipe_details')
         .insert(newDetails)
         .select();

      if (insertError) {
         return NextResponse.json({
         success: false,
         error: 'Failed to insert new recipe details',
         details: insertError.message,
         }, { status: 500 });
      }

      return NextResponse.json({
         success: true,
         data: {
         recipe,
         details: insertedDetails,
         },
      }, { status: 200 });

   } catch (error) {
      if(error instanceof Error) {
         return NextResponse.json({
            error: 'Errors occured',
            message: error.message
         }, { status: 500 });
      }
   }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
   try {
      const { id } = params;

      // 1. Hapus semua recipe_details terlebih dahulu
      const { error: detailsError } = await supabase
         .from('recipe_details')
         .delete()
         .eq('recipe_id', id);

      if (detailsError) {
         return NextResponse.json({
         success: false,
         error: 'Failed to delete recipe details',
         details: detailsError.message,
         }, { status: 500 });
      }

      // 2. Hapus recipe utama
      const { error: recipeError } = await supabase
         .from('recipes')
         .delete()
         .eq('id', id);

      if (recipeError) {
         return NextResponse.json({
         success: false,
         error: 'Failed to delete recipe',
         details: recipeError.message,
         }, { status: 500 });
      }

      return NextResponse.json({
         success: true,
         message: 'Recipe and related details successfully deleted',
      }, { status: 200 });

   } catch (error) {
      return NextResponse.json({
         success: false,
         error: 'Unexpected server error',
         details: (error as Error).message,
      }, { status: 500 });
   }
}