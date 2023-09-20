import { DIDSession } from 'did-session'
import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

import { definition } from '@/lib/ceramic'

export const options: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Ethereum',
      credentials: {
        didSession: {
          label: 'didSession',
          type: 'text',
          placeholder: '0xuwu',
        },
        apikey: {
          label: 'apikey',
          type: 'text',
          placeholder: 'uwu',
        },
        wallet: {
          label: 'wallet',
          type: 'text',
          placeholder: '0xuwu',
        },
      },
      async authorize(credentials) {
        try {
          const didSession = await DIDSession.fromSession(
            credentials?.didSession!,
          )
          if (!didSession) {
            console.error('Error getting session from auth credentials')
            return null
          }
          if (!didSession.hasSession) {
            console.error('No session for DID')
            return null
          }
          if (didSession.isExpired) {
            console.error('Session is expired')
            return null
          }
          if (
            !didSession.isAuthorized(
              Object.entries(definition.models).map(
                ([_, v]) => `ceramic://*?model=${v.id}`,
              ),
            )
          ) {
            console.error('Session is not authorized')
            return null
          }

          const resp = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/apikey/${credentials?.apikey}`,
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                authorization: `Bearer ${credentials?.didSession}`,
              },
            },
          )
          if (!resp.ok) {
            console.error('Invalid API key')
            return null
          }
          return {
            id: didSession.did.id,
            didSession: credentials?.didSession,
            did: didSession.did.id,
            apikey: credentials?.apikey,
            wallet: credentials?.wallet,
          }
        } catch (e) {
          return null
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }: { token: any; user: any }) {
      if (user) {
        token.didSession = user.didSession
        token.did = user.did
        token.apikey = user.apikey
        token.id = user.id
        token.wallet = user.wallet
      }
      return token
    },
    async session({ session, token }: { session: any; token: any }) {
      if (token) {
        session.didSession = token.didSession
        session.did = token.did
        session.apikey = token.apikey
        session.id = token.id
        session.wallet = token.wallet
      }
      return session
    },
  },
}
