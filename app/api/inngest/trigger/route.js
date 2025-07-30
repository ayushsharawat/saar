import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { event, data } = await request.json();

    if (!event || !data) {
      return NextResponse.json(
        { error: 'Event name and data are required' },
        { status: 400 }
      );
    }

    // Check if Inngest is configured
    if (!process.env.INNGEST_SIGNING_KEY) {
      console.log('Inngest not configured, skipping event:', event);
      return NextResponse.json({
        success: true,
        message: `Event "${event}" skipped (Inngest not configured)`
      });
    }

    // Only import and use Inngest if configured
    try {
      const { inngest } = await import('@/lib/inngest');
      
      // Send event to Inngest
      await inngest.send({
        name: event,
        data: {
          ...data,
          timestamp: new Date().toISOString()
        }
      });

      return NextResponse.json({
        success: true,
        message: `Event "${event}" sent successfully`
      });
    } catch (inngestError) {
      console.error('Inngest error:', inngestError);
      return NextResponse.json({
        success: true,
        message: `Event "${event}" processed (Inngest error ignored)`
      });
    }

  } catch (error) {
    console.error('Error in trigger API:', error);
    return NextResponse.json(
      { error: 'Failed to process event' },
      { status: 500 }
    );
  }
} 