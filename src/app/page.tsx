import Header from '@/components/Header'

/**
 * Example A: Serverside fetch of identities
 */
// import { getAuthHeaders } from '@/lib/api'
// import { requireAuth } from '@/lib/session'

/**
 * Example B: Clientside mutation/write
 */
// import IdentityForm from './identity-form'

/**
 * Example A: Serverside fetch of identities
 */
// export async function getIdentities() {
//   const { didSession, apikey } = await requireAuth()
//   const headers = getAuthHeaders(didSession, apikey)

//   const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/identities`, {
//     method: 'GET',
//     headers,
//   })
//   const { data: identities } = await res.json()
//   return { identities }
// }

export default async function Home() {
  /**
   * Example A
   */
  // const identities = await getIdentities()
  // console.log(identities)

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
        {/* Example B: Clientside mutation/write */}
        {/* <IdentityForm /> */}
      </main>
    </>
  )
}
