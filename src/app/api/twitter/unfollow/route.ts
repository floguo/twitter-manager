import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log('Received request body:', body)
    
    if (!body.userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 })
    }

    return NextResponse.json({ 
      received: true, 
      userId: body.userId 
    })
  } catch (error) {
    console.error('API Route error:', error)
    return NextResponse.json({ 
      error: String(error),
      details: error instanceof Error ? error.stack : undefined 
    }, { status: 500 })
  }
} 