"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function TeacherDashboard() {
  const { profile, loading, signOut } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && (!profile || profile.role !== "teacher")) {
      router.push("/")
    }
  }, [profile, loading, router])

  if (loading || !profile) return null

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2 text-xl font-bold text-slate-800">
          <span className="text-blue-500">◆</span> StuDesk — Lärarvy
        </div>
        <button onClick={signOut} className="text-sm text-slate-500 hover:text-slate-800">Logga ut</button>
      </header>

      <div className="max-w-4xl mx-auto p-8">
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-sm">
          <div className="text-5xl mb-4">🏗️</div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Lärarvyn byggs snart</h2>
          <p className="text-slate-500">Hej {profile.full_name}! Här kommer du kunna se klasslistan, AI-insikter och skapa prov.</p>
        </div>
      </div>
    </div>
  )
}
