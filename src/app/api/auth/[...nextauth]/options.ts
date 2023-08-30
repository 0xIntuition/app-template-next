import { definition } from '@/lib/ceramic'
import { DIDSession } from 'did-session'
import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

export const options: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Ethereum',
      credentials: {
        didSession: {
          label: 'didSession',
          type: 'text',
          placeholder: '0x0',
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

          return {
            id: didSession.did.id,
            didSession: credentials?.didSession,
            did: didSession.did.id,
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
    async session({ session, token }: { session: any; token: any }) {
      session.didSession = token.sub
      session.did = token.sub
      return session
    },
  },
}
