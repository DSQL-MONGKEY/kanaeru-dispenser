import { supabase } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { data: pump, error: pumpError } = await supabase
      .from('pump_settings')
      .select(`*`)
      .eq('id', id)
      .single();

    if (!pump || pumpError) {
      return NextResponse.json(
        {
          success: false,
          error: 'An error occurred while processing your add tracking request',
          details: 'Recipe not found'
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: pump
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        {
          success: false,
          error: 'An error occurred while processing your request',
          details: error.message
        },
        { status: 500 }
      );
    }
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { pumpNumber, flowRate } = body;

    // 1. Update nama resep
    const { data: pump, error: pumpError } = await supabase
      .from('pump_settings')
      .update({
        pump_number: pumpNumber,
        flow_rate: flowRate
      })
      .eq('id', id)
      .select()
      .single();

    if (pumpError || !pump) {
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to update recipe name',
          details: pumpError?.message || 'Recipe not found'
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          pump
        }
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        {
          error: 'Errors occured',
          message: error.message
        },
        { status: 500 }
      );
    }
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // 1. Hapus semua recipe_details terlebih dahulu
    const { data: pump, error: pumpError } = await supabase
      .from('pump_settings')
      .delete()
      .eq('id', id);

    if (!pump || pumpError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to delete recipe details',
          details: pumpError?.message
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: pump,
        message: 'Pump data successfully deleted'
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Unexpected server error',
        details: (error as Error).message
      },
      { status: 500 }
    );
  }
}
