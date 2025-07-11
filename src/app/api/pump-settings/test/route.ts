import mqttClient from '@/lib/mqtt-client';
import { supabase } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { pumpNumber, activeTime } = body;

    const mqttPayload = {
      calibration: {
        pump_number: pumpNumber,
        active_time: activeTime
      }
    };

    mqttClient.publish(
      'multidispenser/mix',
      JSON.stringify(mqttPayload),
      { qos: 0 },
      (err) => {
        // eslint-disable-next-line no-console
        if (err) console.error('Error publishing MQTT: ', err.message);
      }
    );
    return NextResponse.json(
      {
        success: true,
        data: mqttPayload
      },
      { status: 201 }
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

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('pump_settings')
      .select('*')
      .order('pump_number', { ascending: true });

    if (!data || error) {
      return NextResponse.json(
        {
          success: false,
          error: 'An error occurred while processing your request',
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
