import AuthHeader from '@/components/AuthHeader'
import Resources from '@/components/Resources'

export default function Auth() {
  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-between p-24 gap-y-12">
        <AuthHeader />
        <Resources />
      </main>
    </>
  )
}
