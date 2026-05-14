"use client"

import { useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import Link from "next/link"
import { StuDeskLogo } from "@/components/Logo"

function AuthForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const initialMode = searchParams.get("mode") === "register" ? "register" : "login"

  const [mode, setMode] = useState<"login" | "register">(initialMode)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [role, setRole] = useState<"student" | "teacher">("student")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)
    try {
      if (mode === "register") {
        const { error } = await supabase.auth.signUp({ email, password, options: { data: { full_name: fullName, role } } })
        if (error) throw error
        setSuccess("Konto skapat. En administratör behöver godkänna det innan du kan logga in.")
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        router.push("/")
      }
    } catch (err: any) {
      setError(err.message || "Något gick fel")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4" style={{ fontFamily: 'var(--font-body)' }}>
      <div className="w-full max-w-sm">
        <Link href="/" className="flex justify-center mb-10">
          <StuDeskLogo size="lg" />
        </Link>

        <div className="bg-white border border-stone-200 rounded-xl p-8">
          <div className="flex border-b border-stone-200 mb-6 -mx-8 -mt-8 px-8 pt-6">
            <button onClick={() => { setMode("login"); setError(""); setSuccess("") }}
              className={`pb-3 text-sm mr-6 transition border-b-2 -mb-px ${mode === "login" ? "border-stone-900 text-stone-900 font-medium" : "border-transparent text-stone-400 hover:text-stone-600"}`}>
              Logga in
            </button>
            <button onClick={() => { setMode("register"); setError(""); setSuccess("") }}
              className={`pb-3 text-sm transition border-b-2 -mb-px ${mode === "register" ? "border-stone-900 text-stone-900 font-medium" : "border-transparent text-stone-400 hover:text-stone-600"}`}>
              Registrera
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "register" && (
              <>
                <div>
                  <label className="block text-[11px] text-stone-500 mb-1.5 uppercase tracking-widest">Namn</label>
                  <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required placeholder="Anna Svensson"
                    className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-lg text-sm focus:ring-1 focus:ring-stone-900 focus:border-stone-900 outline-none transition" />
                </div>
                <div>
                  <label className="block text-[11px] text-stone-500 mb-1.5 uppercase tracking-widest">Jag är</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button type="button" onClick={() => setRole("student")}
                      className={`py-3 rounded-lg border text-sm transition ${role === "student" ? "border-stone-900 bg-stone-900 text-white" : "border-stone-200 text-stone-600 hover:border-stone-400"}`}>
                      Elev
                    </button>
                    <button type="button" onClick={() => setRole("teacher")}
                      className={`py-3 rounded-lg border text-sm transition ${role === "teacher" ? "border-stone-900 bg-stone-900 text-white" : "border-stone-200 text-stone-600 hover:border-stone-400"}`}>
                      Lärare
                    </button>
                  </div>
                </div>
              </>
            )}
            <div>
              <label className="block text-[11px] text-stone-500 mb-1.5 uppercase tracking-widest">E-post</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="namn@skola.se"
                className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-lg text-sm focus:ring-1 focus:ring-stone-900 focus:border-stone-900 outline-none transition" />
            </div>
            <div>
              <label className="block text-[11px] text-stone-500 mb-1.5 uppercase tracking-widest">Lösenord</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Minst 6 tecken"
                className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-lg text-sm focus:ring-1 focus:ring-stone-900 focus:border-stone-900 outline-none transition" />
            </div>
            {error && <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg p-3">{error}</p>}
            {success && <p className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-lg p-3">{success}</p>}
            <button type="submit" disabled={loading}
              className="w-full py-2.5 bg-stone-900 text-white text-sm rounded-lg hover:bg-black transition disabled:opacity-40">
              {loading ? "..." : mode === "login" ? "Logga in" : "Skapa konto"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default function AuthPage() {
  return <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-5 h-5 border-2 border-stone-900 border-t-transparent rounded-full animate-spin" /></div>}><AuthForm /></Suspense>
}