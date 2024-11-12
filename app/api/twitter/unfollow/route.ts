import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions) as any;
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userIds } = await request.json();

    // Process unfollows sequentially to respect rate limits
    const results = [];
    for (const userId of userIds) {
      const response = await fetch(
        `https://api.twitter.com/2/users/${session.user.id}/following/${userId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${process.env.TWITTER_ACCESS_TOKEN}`,
          }
        }
      );

      results.push({
        userId,
        success: response.ok,
        status: response.status
      });

      // Add a small delay to respect rate limits
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    return NextResponse.json({ success: true, results });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
} 