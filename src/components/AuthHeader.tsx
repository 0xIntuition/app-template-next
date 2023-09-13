'use client'
import Link from 'next/link'
import { AccountButton } from './AccountButton'
import IntuitionLogotype from './svg/intuition-logotype'
import AuthenticateCard from '@/app/authenticate-card'
import { useAccount } from 'wagmi'

export default function AuthHeader() {
  const { isConnected } = useAccount()
  return (
    <div className="max-w-7xl w-full items-start justify-between lg:flex">
      <div className="space-y-6 max-lg:flex max-lg:flex-col max-lg:items-center">
        <Link href="/">
          <IntuitionLogotype />
        </Link>
        <p className="rounded-md px-3 py-2 font-mono text-sm cursor-default border border-stone-800/50 bg-gray-50/5 backdrop-blur-sm">
          Get started by editing{' '}
          <span className="font-bold text-success-500">src/app/page.tsx</span>
        </p>
      </div>
      <div className="flex flex-col items-end max-lg:items-center mt-4 max-lg:justify-center gap-4">
        <AccountButton />
        {isConnected && <AuthenticateCard />}
      </div>
    </div>
  )
}
