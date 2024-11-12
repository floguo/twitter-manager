import { useState, useEffect } from 'react';
import { twitterClient } from '@/lib/twitter';

interface TwitterUser {
  id: string;
  name: string;
  username: string;
  description?: string;
  selected?: boolean;
}

export default function TwitterFollowing() {
  const [following, setFollowing] = useState<TwitterUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchFollowing() {
      try {
        const me = await twitterClient.currentUser();
        const users = await twitterClient.v2.following(me.id.toString(), {
          max_results: 1000,
          "user.fields": ["description"]
        });
        
        setFollowing(users.data.map(user => ({
          id: user.id,
          name: user.name,
          username: user.username,
          description: user.description,
          selected: false
        })));
      } catch (err) {
        setError('Failed to fetch following list');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchFollowing();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Following ({following.length})</h2>
      <div className="grid gap-4">
        {following.map((user) => (
          <div 
            key={user.id} 
            className="p-4 border rounded-lg flex items-center justify-between"
          >
            <div>
              <h3 className="font-semibold">{user.name}</h3>
              <p className="text-gray-600">@{user.username}</p>
              {user.description && (
                <p className="text-sm text-gray-500">{user.description}</p>
              )}
            </div>
            <input
              type="checkbox"
              checked={user.selected}
              onChange={() => {
                setFollowing(following.map(u => 
                  u.id === user.id ? { ...u, selected: !u.selected } : u
                ));
              }}
              className="h-5 w-5"
            />
          </div>
        ))}
      </div>
    </div>
  );
} 