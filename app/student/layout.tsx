"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { StuDeskLogo } from "@/components/Logo"
import { useEffect } from "react"

const courses = [
  { id: "matematik-2b", label: "Matematik 2b", code: "MA2B" },
  { id: "svenska-1", label: "Svenska 1", code: "SV1" },
  { id: "engelska-5", label: "Engelska 5", code: "EN5" },
  { id: "fysik-1", label: "Fysik 1", code: "FY1" },
  { id: "historia-1b", label: "Historia 1b", code: "HI1B" },
]

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { profile, loading, signOut } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && (!profile || profile.role !== "student")) router.push("/")
  }, [profile, loading, router])

  if (loading || !profile) return <div className="min-h-screen flex items-center justify-center bg-stone-50"><div className="w-5 h-5 border-2 border-stone-800 border-t-transparent rounded-full animate-spin" /></div>

  const initials = profile.full_name.split(" ").map((n: string) => n[0]).join("").slice(0, 2)

  return (
    <div className="h-screen flex overflow-hidden" style={{ fontFamily: 'var(--font-body)' }}>
      <aside className="w-52 bg-white border-r border-stone-200 flex flex-col flex-shrink-0">
        <div className="px-5 py-4 border-b border-stone-100">
          <StuDeskLogo size="md" />
        </div>

        <nav className="flex-1 py-3 px-2.5 overflow-y-auto">
          <p className="text-[10px] uppercase tracking-[0.15em] text-stone-300 px-2 mb-1.5">Översikt</p>
          <Link href="/student"
            className={`w-full flex items-center px-2.5 py-2 rounded-md text-[13px] transition mb-px ${
              pathname === "/student" ? "bg-stone-900 text-white" : "text-stone-500 hover:text-stone-800 hover:bg-stone-50"
            }`}>
            Hem
          </Link>
          <Link href="/student/calendar"
            className={`w-full flex items-center px-2.5 py-2 rounded-md text-[13px] transition mb-px ${
              pathname === "/student/calendar" ? "bg-stone-900 text-white" : "text-stone-500 hover:text-stone-800 hover:bg-stone-50"
            }`}>
            Kalender
          </Link>

          <p className="text-[10px] uppercase tracking-[0.15em] text-stone-300 px-2 mb-1.5 mt-4">Kurser</p>
          {courses.map((course) => {
            const href = `/student/courses/${course.id}`
            const isActive = pathname === href
            return (
              <Link key={course.id} href={href}
                className={`w-full flex items-center justify-between px-2.5 py-2 rounded-md text-[13px] transition mb-px ${
                  isActive ? "bg-stone-900 text-white" : "text-stone-500 hover:text-stone-800 hover:bg-stone-50"
                }`}>
                <span>{course.label}</span>
                <span className={`text-[10px] font-mono ${isActive ? "text-white/40" : "text-stone-300"}`}>{course.code}</span>
              </Link>
            )
          })}
        </nav>

        <div className="px-3 py-3 border-t border-stone-100">
          <div className="flex items-center gap-2.5 px-2">
            <div className="w-7 h-7 rounded-full bg-stone-800 text-white text-[10px] flex items-center justify-center font-medium">{initials}</div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-stone-600 truncate">{profile.full_name}</p>
              <p className="text-[10px] text-stone-400">Elev · NA26a</p>
            </div>
            <button onClick={signOut} className="text-stone-300 hover:text-stone-600 transition">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" /></svg>
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col bg-stone-50 overflow-hidden">
        {children}
      </main>
    </div>
  )
}