import { supabase } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  {
    params
  }: {
    params: Promise<{ slug?: string[] }>;
  }
) {
  const { slug } = await params;

  return NextResponse.json(
    {
      mesg: 'ok',
      slug
    },
    { status: 200 }
  );
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const {
      deviceId,
      climberUserId,
      latitude,
      longitude,
      altitude,
      rssi,
      snr,
      is_emergency
    } = body;

    const { data, error } = await supabase
      .from('trackings')
      .update({
        deviceId,
        climberUserId,
        latitude,
        longitude,
        altitude,
        rssi,
        snr,
        is_emergency
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to update tracking data',
          details: error.message
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        {
          success: false,
          error: 'An error occured while processing your request',
          details: error.message
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

    const { data, error } = await supabase
      .from('trackings')
      .delete()
      .eq('id', id)
      .select();

    if (error) {
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to delete tracking data',
          details: error.message
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data
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
