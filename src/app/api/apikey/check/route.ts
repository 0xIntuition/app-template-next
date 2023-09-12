import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  let body = await req.json()
  let didSession = body.didSession as string
  let apikey = body.apikey as string

  const res = await fetch(`http://localhost:8080/apikey/${apikey}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      authorization: `Bearer ${didSession}`,
    },
  })
  if (res.status !== 200) {
    return NextResponse.json({ success: false }, { status: 401 })
  }
  return NextResponse.json({ success: true }, { status: 200 })
}
