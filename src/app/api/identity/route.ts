import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'

import { AuthSession } from '@/types/session'

import { options } from '../auth/[...nextauth]/options'

export async function POST(req: Request) {
  const session = (await getServerSession(options)) as AuthSession
  if (!session) {
    return NextResponse.json(
      { message: 'You must be logged in.' },
      { status: 401 },
    )
  }
  const { didSession, apikey } = session

  const body = await req.json()
  const displayName = body.displayName as string
  const description = body.description as string

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/identity`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      authorization: `Bearer ${didSession}`,
      'x-api-key': `${apikey}`,
    },
    body: JSON.stringify({
      display_name: displayName,
      description: description,
      options: {
        await_existence_check: true, // add polling to await subgraph indexing following on-chain interaction
      },
    }),
  })
  if (!res.ok) {
    const error = await res.json()
    return NextResponse.json(error, { status: res.status })
  }

  const data = await res.json()
  return NextResponse.json({ data }, { status: 200 })
}
