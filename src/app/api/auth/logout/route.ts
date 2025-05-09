import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST() {
  const cookieStore = cookies();
  cookieStore.delete('shoe-collection-auth');

  return NextResponse.json({ success: true });
}
