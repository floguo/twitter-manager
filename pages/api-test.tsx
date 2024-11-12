import { useState } from 'react'
import { TwitterResponse } from '../types/twitter'

export default function TestPage() {
  const [result, setResult] = useState<TwitterResponse | null>(null)
  const [userId, setUserId] = useState('')

  const fetchTweets = async () => {
    try {
      const response = await fetch(`/api/twitter?userId=${userId}`);
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Error fetching tweets:', error);
      setResult({ error: 'Error fetching tweets' });
    }
  }

  return (
    <div className="p-4">
      <input 
        type="text" 
        value={userId} 
        onChange={(e) => setUserId(e.target.value)}
        placeholder="Enter user ID"
        className="border p-2"
      />
      <button 
        onClick={fetchTweets}
        className="ml-2 bg-blue-500 text-white p-2 rounded"
      >
        Test API
      </button>
      <pre className="mt-4">
        {JSON.stringify(result, null, 2)}
      </pre>
    </div>
  )
} 