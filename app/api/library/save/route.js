import { NextResponse } from 'next/server';
import { supabase } from '@/Services/supabase';

export async function POST(request) {
  try {
    const { searchInput, userEmail, type, searchId, searchResults, aiModel } = await request.json();

    if (!searchInput || !userEmail || !type) {
      return NextResponse.json(
        { error: 'Missing required fields: searchInput, userEmail, type' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('Library')
      .insert([
        {
          searchInput,
          userEmail,
          type,
          searchId,
          searchResults,
          aiModel
        }
      ])
      .select();

    if (error) {
      console.error('Error saving to library:', error);
      return NextResponse.json(
        { error: 'Failed to save to library' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: data[0]
    });

  } catch (error) {
    console.error('Library save API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 