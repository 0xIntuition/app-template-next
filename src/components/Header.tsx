import Link from 'next/link'
import { AccountButton } from './AccountButton'
import IntuitionLogotype from './svg/intuition-logotype'

export default function Header() {
  return (
    <div className="max-w-7xl w-full items-center justify-between lg:flex">
      <div className="space-y-8 max-lg:flex max-lg:flex-col max-lg:items-center max-lg:mt-10">
        <Link href="/" className="max-lg:mb-8">
          <IntuitionLogotype className="max-lg:h-14" />
        </Link>
        <p className="rounded-md px-3 py-2 font-mono text-sm cursor-default border border-stone-700/50 bg-gray-50/5 backdrop-blur-sm max-lg:text-center">
          Get started by editing{' '}
          <span className="font-bold text-success-500">src/app/page.tsx</span>
        </p>
      </div>
      <div className="flex flex-row items-center mt-4 max-lg:justify-center max-lg:py-4">
        <AccountButton />
      </div>
    </div>
  )
}
