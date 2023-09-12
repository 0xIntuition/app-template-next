import * as React from 'react'
import { signOut, useSession } from 'next-auth/react'
import { useAccount, useDisconnect } from 'wagmi'

export interface AuthGuardProps extends React.HTMLAttributes<HTMLDivElement> {}

export default function AuthGuard({ children }: AuthGuardProps) {
  const { isConnected } = useAccount()
  const { disconnect } = useDisconnect()
  const { data: session } = useSession()
  React.useEffect(() => {
    if (!isConnected) {
      if (session) {
        signOut()
      }
      disconnect()
    }
  }, [isConnected, session])

  return <div>{children}</div>
}
