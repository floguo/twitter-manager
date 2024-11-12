'use client';

import { useEffect, useState } from 'react';

interface TwitterUser {
  id: string;
  name: string;
  username: string;
  description?: string;
}

export default function TwitterPage() {
  const [following, setFollowing] = useState<TwitterUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchFollowing() {
      try {
        const response = await fetch('/api/twitter/following');
        const result = await response.json();
        
        if (!result.success) throw new Error(result.error);
        
        setFollowing(result.data);
      } catch (err) {
        setError('Failed to fetch following list');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchFollowing();
  }, []);

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Twitter Following ({following.length})</h1>
      <div className="space-y-4">
        {following.map((user) => (
          <div key={user.id} className="border p-4 rounded">
            <h2 className="font-bold">{user.name}</h2>
            <p className="text-gray-600">@{user.username}</p>
            {user.description && (
              <p className="text-sm mt-2">{user.description}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 