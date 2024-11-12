import { TwitterApi } from 'twitter-api-v2';

export class TwitterService {
  private client: TwitterApi;

  constructor(bearerToken: string) {
    this.client = new TwitterApi(bearerToken);
  }

  async getFollowing(userId: string) {
    try {
      const following = await this.client.v2.following(userId, {
        max_results: 1000, // Adjust as needed
        "user.fields": ["id", "name", "username", "description"]
      });
      return following.data || [];
    } catch (error) {
      console.error('Error fetching following:', error);
      throw error;
    }
  }

  async unfollowUser(targetUserId: string) {
    try {
      // Get the authenticated user's ID
      const me = await this.client.v2.me();
      const sourceUserId = me.data.id;
      
      // Execute unfollow
      const result = await this.client.v2.unfollow(sourceUserId, targetUserId);
      return result;
    } catch (error) {
      console.error('Twitter Service Error:', error);
      throw error;
    }
  }
} 
