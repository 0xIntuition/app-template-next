'use client'

import * as React from 'react'
import { RainbowKitProvider, midnightTheme } from '@rainbow-me/rainbowkit'
import { WagmiConfig } from 'wagmi'
import { chains, config } from '../wagmi'
import AuthGuard from '@/components/AuthGuard'
import { SessionProvider } from 'next-auth/react'

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => setMounted(true), [])
  return (
    <SessionProvider>
      <WagmiConfig config={config}>
        <RainbowKitProvider
          chains={chains}
          theme={midnightTheme()}
          modalSize={'compact'}
        >
          {mounted && <AuthGuard>{children}</AuthGuard>}
        </RainbowKitProvider>
      </WagmiConfig>
    </SessionProvider>
  )
}
