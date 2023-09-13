'use client'

import { useEffect, useMemo } from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { disconnect } from '@wagmi/core'
import { LogOut } from 'lucide-react'
import { Session } from 'next-auth'
import { signOut, useSession } from 'next-auth/react'

import { Copy } from './Copy'
import Avatar from './svg/avatar'
import { Button } from './ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { useAccount } from 'wagmi'

export const AccountButton = () => {
  const { data: session, status: sessionStatus } = useSession()
  const { isConnected } = useAccount()
  const defaultSession = useMemo(() => {
    let serializedDidSession, apikey
    if (session) {
      const customSession = session as Session & {
        didSession: string
        apikey: string
      }
      if (customSession.didSession) {
        serializedDidSession = customSession.didSession
      }
      if (customSession.apikey) {
        apikey = customSession.apikey
      }
    }
    return { serializedDidSession, apikey }
  }, [session])

  async function handleSignout() {
    if (defaultSession.serializedDidSession) await signOut()
    disconnect()
  }

  useEffect(() => {
    if (!isConnected) {
      handleSignout()
    }
  })

  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openConnectModal,
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
            {!isConnected ? (
              <Button
                size="sm"
                variant="outline"
                className="text-xs"
                onClick={openConnectModal}
              >
                Connect
              </Button>
            ) : (
              <div className="flex p-1 rounded-full gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="sm" variant="outline" className="text-xs">
                      {account?.ensName ?? account?.displayName}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-gray-900 w-48">
                    <DropdownMenuLabel className="flex items-center gap-2">
                      <Avatar className="h-6 w-6" />
                      {account?.displayName}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {defaultSession.serializedDidSession && (
                      <DropdownMenuItem
                        onSelect={(e) => e.preventDefault()}
                        className="focus:bg-transparent grid gap-2"
                      >
                        <div className="flex">
                          <Label>DID Session</Label>{' '}
                        </div>
                        <Input
                          value={`Bearer ${defaultSession.serializedDidSession}`}
                          readOnly
                          className="px-0"
                          startAdornment={
                            <div className="ml-1">
                              <Copy
                                text={defaultSession.serializedDidSession}
                                className="py-1"
                              />
                            </div>
                          }
                        />
                      </DropdownMenuItem>
                    )}
                    {defaultSession.apikey && (
                      <DropdownMenuItem
                        onSelect={(e) => e.preventDefault()}
                        className="focus:bg-transparent grid gap-2"
                      >
                        <Label>API Key</Label>
                        <Input
                          readOnly
                          value={defaultSession.apikey}
                          startAdornment={
                            <div className="ml-1">
                              <Copy
                                text={defaultSession.apikey}
                                className="py-1"
                              />
                            </div>
                          }
                        />
                      </DropdownMenuItem>
                    )}

                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onSelect={(e) => {
                        e.preventDefault()
                        handleSignout()
                      }}
                      className="justify-start cursor-pointer"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>
                        {defaultSession.serializedDidSession &&
                          defaultSession.apikey &&
                          'Sign Out'}
                        {connected &&
                          !defaultSession.serializedDidSession &&
                          'Disconnect'}
                      </span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>
        )
      }}
    </ConnectButton.Custom>
  )
}
