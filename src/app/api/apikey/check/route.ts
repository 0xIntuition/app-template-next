import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  let body = await req.json()
  let didSession = body.didSession as string
  let apikey = body.apikey as string

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/apikey/${apikey}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `${didSession}`,
    },
  })
  if (res.status !== 200) {
    return NextResponse.json({ success: false }, { status: 401 })
  }
  return NextResponse.json({ success: true }, { status: 200 })
}
