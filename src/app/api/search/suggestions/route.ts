import { NextRequest, NextResponse } from 'next/server';
import { getSearchSuggestions } from '@/services/searchService';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q') || '';

  if (!q || q.length < 2) {
    return NextResponse.json({ suggestions: [] });
  }

  const suggestions = await getSearchSuggestions(q);
  return NextResponse.json({ suggestions });
}
