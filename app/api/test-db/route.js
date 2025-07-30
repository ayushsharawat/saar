import { NextResponse } from 'next/server';
import { supabase } from '@/Services/supabase';

export async function GET() {
  try {
    // Test database connection
    const { data, error } = await supabase
      .from('Library')
      .select('count')
      .limit(1);

    if (error) {
      console.error('Database test error:', error);
      return NextResponse.json({
        success: false,
        error: error.message,
        details: error,
        message: 'Database connection failed'
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      data: data
    });

  } catch (error) {
    console.error('Test API error:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      message: 'Test API failed'
    }, { status: 500 });
  }
} 