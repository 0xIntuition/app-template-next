import Header from '@/components/Header'
import Resources from '@/components/Resources'

export default function Home() {
  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-between p-24 gap-y-12">
        <Header />
        <Resources />
      </main>
    </>
  )
}
