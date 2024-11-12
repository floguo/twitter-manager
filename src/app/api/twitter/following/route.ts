import { twitterClient } from '@/lib/twitter';
import { TwitterApi } from 'twitter-api-v2';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const client = new TwitterApi({
      appKey: process.env.TWITTER_API_KEY!,
      appSecret: process.env.TWITTER_API_SECRET!,
      accessToken: process.env.TWITTER_ACCESS_TOKEN!,
      accessSecret: process.env.TWITTER_ACCESS_SECRET!,
    });

    // First get the authenticated user's ID
    const me = await client.currentUser();
    
    // Then get their following list
    const following = await client.v2.following(me.id.toString(), {
        max_results: 10,
        "user.fields": ["description"]
      });

    return NextResponse.json({ success: true, data: following.data });
    
  } catch (error) {
    console.error('Twitter API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch following' },
      { status: 500 }
    );
  }
} 