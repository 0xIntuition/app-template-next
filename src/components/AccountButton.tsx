'use client'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { Button } from './ui/button'
import { useAccount, useDisconnect, useWalletClient } from 'wagmi'
import { newDIDSessionFromWalletClient } from '@/lib/ceramic'
import { signIn, signOut, useSession } from 'next-auth/react'
import { useEffect } from 'react'

export const AccountButton = () => {
  const { data: walletClient } = useWalletClient()
  const { isConnected } = useAccount()
  const { data: session } = useSession()
  const { disconnect } = useDisconnect()

  useEffect(() => {
    // if we are disconnected, sign out
    if (!isConnected && session) {
      signOut()
    }
  }, [isConnected, session])

  async function authenticate() {
    try {
      const didSession = await newDIDSessionFromWalletClient({
        account: walletClient?.account!,
        signMessage: walletClient?.signMessage!,
      })
      signIn('credentials', {
        didSession: didSession.serialize(),
        redirect: false,
        callbackUrl: '/',
      })
    } catch (e) {
      window.alert(e)
    }
  }

  async function handleSignout() {
    await signOut()
    disconnect()
  }

  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openChainModal,
        openConnectModal,
        openAccountModal,
        authenticationStatus,
        mounted,
      }) => {
        // Note: If your app doesn't use authentication, you
        // can remove all 'authenticationStatus' checks
        const ready = mounted && authenticationStatus !== 'loading'
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === 'authenticated')
        return (
          <div
            {...(!ready && {
              'aria-hidden': true,
              style: {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <Button variant="outline" onClick={openConnectModal}>
                    Connect Wallet
                  </Button>
                )
              }
              if (chain.unsupported) {
                return (
                  <Button variant="outline" onClick={openChainModal}>
                    Wrong network
                  </Button>
                )
              }
              if (!session)
                return (
                  <Button variant="outline" onClick={authenticate}>
                    Sign In
                  </Button>
                )
              return (
                <div className="flex flex-col gap-4 items-center">
                  <Button variant="outline" onClick={openAccountModal}>
                    {account.ensName ?? account.displayName}
                  </Button>
                  <Button
                    className="w-fit"
                    variant="ghost"
                    size="sm"
                    onClick={handleSignout}
                  >
                    Sign Out
                  </Button>
                </div>
              )
            })()}
          </div>
        )
      }}
    </ConnectButton.Custom>
  )
}
