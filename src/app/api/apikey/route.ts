import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  let body = await req.json()
  let didSession = body.didSession as string

  const res = await fetch('http://localhost:8080/apikey', {
    headers: {
      'Content-Type': 'application/json',
      authorization: `Bearer ${didSession}`,
    },
  })
  const { key: apikey } = await res.json()

  return NextResponse.json({ apikey })
}
