'use client';

import { useState, useEffect } from 'react';

interface Following {
  id: string;
  name: string;
  username: string;
}

export default function FollowingList() {
  const [following, setFollowing] = useState<Following[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchFollowing();
  }, []);

  const fetchFollowing = async () => {
    try {
      const response = await fetch('/api/twitter/following');
      const { data } = await response.json();
      setFollowing(data.data);
    } catch (error) {
      console.error('Error fetching following:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSelect = (userId: string) => {
    const newSelected = new Set(selectedUsers);
    if (newSelected.has(userId)) {
      newSelected.delete(userId);
    } else {
      newSelected.add(userId);
    }
    setSelectedUsers(newSelected);
  };

  const unfollowSelected = async () => {
    if (!confirm('Are you sure you want to unfollow these accounts?')) return;
    
    try {
      const response = await fetch('/api/twitter/unfollow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userIds: Array.from(selectedUsers)
        }),
      });
      
      const result = await response.json();
      if (result.success) {
        // Refresh the following list
        await fetchFollowing();
        setSelectedUsers(new Set());
      }
    } catch (error) {
      console.error('Error unfollowing users:', error);
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="p-4">
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-bold">Following ({following.length})</h2>
        <button 
          onClick={unfollowSelected}
          disabled={selectedUsers.size === 0}
          className="bg-red-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Unfollow Selected ({selectedUsers.size})
        </button>
      </div>
      <div className="space-y-2">
        {following.map(user => (
          <div key={user.id} className="flex justify-between items-center">
            <span>{user.name}</span>
            <input
              type="checkbox"
              checked={selectedUsers.has(user.id)}
              onChange={() => toggleSelect(user.id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
} 