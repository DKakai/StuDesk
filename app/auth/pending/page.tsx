"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { StuDeskLogo } from "@/components/Logo"

export default function PendingApproval() {
  const { profile, loading, signOut } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && profile?.is_approved) router.push("/")
  }, [profile, loading, router])

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4" style={{ fontFamily: 'var(--font-body)' }}>
      <div className="max-w-sm text-center">
        <div className="flex justify-center mb-8">
          <StuDeskLogo size="lg" />
        </div>
        <div className="w-12 h-12 border border-stone-200 rounded-xl flex items-center justify-center text-stone-400 mx-auto mb-6 text-xl">⏳</div>
        <h1 className="text-xl font-medium text-stone-800 mb-3 tracking-tight">Inväntar godkännande</h1>
        <p className="text-sm text-stone-500 mb-8 leading-relaxed">
          Ditt konto som {profile?.role === "teacher" ? "lärare" : "elev"} behöver godkännas av en administratör.
        </p>
        <div className="flex gap-3 justify-center">
          <button onClick={() => window.location.reload()} className="text-sm bg-stone-900 text-white px-5 py-2 rounded-lg hover:bg-black transition">Kolla igen</button>
          <button onClick={signOut} className="text-sm border border-stone-200 text-stone-600 px-5 py-2 rounded-lg hover:bg-stone-50 transition">Logga ut</button>
        </div>
      </div>
    </div>
  )
}