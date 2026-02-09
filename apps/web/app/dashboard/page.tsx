'use client'

import { redirect } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { signOut, useSession } from '@/lib/auth-client'
import { useMemo } from 'react'

 const SignOutButton = () => {
  const router = useRouter()
 
  const handleSignOut = async () => {
    await signOut()
    router.refresh()
  }
 
  return (
    <button
      onClick={handleSignOut}
      className="text-xs text-red-300 transition hover:text-red-200"
    >
      Sign Out
    </button>
  )
}

export default function Dashboard() {
  const {data} = useSession()
  
  // if (!data) redirect('/sign-in')
  return (
    <section className="p-10">
      <h1 className="text-2xl font-bold">Welcome, {data?.user.name || "Unknown"}!</h1>
      <p className="mt-2">You made it to the protected area. 🎉</p>
      <SignOutButton />
    </section>
  )
}