import { TwitterApi } from 'twitter-api-v2';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse
) {
  if (!process.env.TWITTER_API_KEY) {
    return res.status(500).json({ message: 'Twitter API key is not configured' });
  }

  try {
    const client = new TwitterApi(process.env.TWITTER_API_KEY);
    const readOnlyClient = client.readOnly;

    const tweets = await readOnlyClient.v2.userTimeline('12345', {
      max_results: 10,
    });

    return res.status(200).json(tweets);
  } catch (error) {
    console.error('Twitter API Error:', error);
    return res.status(500).json({ message: 'Error fetching tweets' });
  }
} 