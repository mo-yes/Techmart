"use client"

import { useSession } from "next-auth/react"

export default function AllOrdersPage() {
  const { data: session } = useSession()

  return (
    <section className="flex flex-col items-center justify-center min-h-screen bg-green-50 text-center px-4">
      <h2 className="text-3xl font-bold text-green-600 animate-bounce">
        Order Success 🎉
      </h2>

      {session?.user?.name && (
        <p className="mt-4 text-lg text-gray-700 animate-pulse">
          Thank you <span className="font-semibold">{session.user.name}</span> for order💚
        </p>
      )}
    </section>
  )
}
