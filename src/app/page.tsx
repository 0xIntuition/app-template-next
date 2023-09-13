import Header from '@/components/Header'

export default function Home() {
  return (
    <>
      <main className="flex min-h-screen flex-col items-center p-24 gap-y-12">
        <Header />
        {/* TODO: REPLACE ME AND START DEVING WITH INTUITION HERE! */}
        <div className="h-full flex flex-col items-center pt-40">
          <p className="rounded-md px-4 py-3 font-mono text-md cursor-default border border-stone-800/50 bg-gray-50/5 backdrop-blur-sm">
            Get started by editing{' '}
            <span className="font-bold text-success-500">src/app/page.tsx</span>
          </p>
        </div>
      </main>
    </>
  )
}
