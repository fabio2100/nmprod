import { NextResponse } from 'next/server';

export async function GET() {
    return NextResponse.json({
        googleId: process.env.GOOGLE_ID ? 'Configured' : 'Missing',
        googleSecret: process.env.GOOGLE_SECRET ? 'Configured' : 'Missing',
        nextAuthUrl: process.env.NEXTAUTH_URL,
        nextAuthSecret: process.env.NEXTAUTH_SECRET ? 'Configured' : 'Missing'
    });
}
