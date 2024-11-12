'use client'
import { useState } from 'react'

type ApiResponse = {
  success?: boolean;
  error?: string;
  data?: {
    userId?: string;
    message?: string;
  };
}

export default function Home() {
  const [result, setResult] = useState<ApiResponse | null>(null)
  const [userId, setUserId] = useState('')
  const [loading, setLoading] = useState(false)

  const testApi = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/twitter/unfollow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId.trim()
        })
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      console.log('Response data:', data)
      setResult(data)
    } catch (error) {
      console.error('Error:', error)
      setResult({
        error: String(error)
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Twitter API Test</h1>
        
        <div className="space-y-4">
          <div>
            <input 
              type="text" 
              value={userId} 
              onChange={(e) => setUserId(e.target.value)}
              placeholder="Enter Twitter User ID"
              className="border p-2 rounded w-full"
            />
          </div>

          <button 
            onClick={testApi}
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white p-2 rounded disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test Unfollow API'}
          </button>

          {result && (
            <div className="mt-4">
              <h2 className="text-lg font-semibold mb-2">Result:</h2>
              <pre className="bg-gray-100 p-4 rounded overflow-auto">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}