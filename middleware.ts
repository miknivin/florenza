import { NextRequest, NextResponse } from 'next/server';
import { get } from '@vercel/edge-config';

export const config = {
  matcher: '/((?!_next|_vercel|.*\\..*).*)', // Match all routes except static files
};

export async function middleware(req: NextRequest) {
  const isInMaintenanceMode = await get('isInMaintenanceMode') as boolean;
  if (isInMaintenanceMode) {
    const url = req.nextUrl.clone();
    url.pathname = '/maintenance'; // Path to your maintenance page
    return NextResponse.rewrite(url);
  }
  return NextResponse.next();
}