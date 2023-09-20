import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  let body = await req.json()
  let didSession = body.didSession as string

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/apikey`, {
    headers: {
      'Content-Type': 'application/json',
      authorization: `Bearer ${didSession}`,
    },
  })
  const { key: apikey } = await res.json()

  return NextResponse.json({ apikey })
}
