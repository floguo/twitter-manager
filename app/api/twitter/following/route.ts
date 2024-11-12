import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'

export async function GET() {
  try {
    const session = await getServerSession(authOptions) as any;
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Call Twitter API to get following list
    const response = await fetch(
      `https://api.twitter.com/2/users/${session.user.id}/following?max_results=1000`,
      {
        headers: {
          'Authorization': `Bearer ${process.env.TWITTER_ACCESS_TOKEN}`,
        }
      }
    );

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json({ error: error.message || 'Twitter API error' }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
} 