"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { StuDeskLogo } from "@/components/Logo"
import { useEffect, useState } from "react"

const courses = [
  { id: "matematik-2b", label: "Matematik 2b", code: "MA2B" },
  { id: "svenska-1", label: "Svenska 1", code: "SV1" },
  { id: "engelska-5", label: "Engelska 5", code: "EN5" },
  { id: "fysik-1", label: "Fysik 1", code: "FY1" },
  { id: "historia-1b", label: "Historia 1b", code: "HI1B" },
  { id: "samhallskunskap-1b", label: "Samhällskunskap 1b", code: "SH1B" },
]

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { profile, loading, signOut } = useAuth()
  const router = useRouter()

  const isCoursePage = pathname?.includes("/courses/")
  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => {
    setCollapsed(!!isCoursePage)
  }, [isCoursePage])

  useEffect(() => {
    if (!loading && (!profile || profile.role !== "student")) router.push("/")
  }, [profile, loading, router])

  if (loading || !profile) return <div className="min-h-screen flex items-center justify-center bg-stone-50"><div className="w-5 h-5 border-2 border-stone-800 border-t-transparent rounded-full animate-spin" /></div>

  const initials = profile.full_name.split(" ").map((n: string) => n[0]).join("").slice(0, 2)

  return (
    <div className="h-screen flex overflow-hidden" style={{ fontFamily: 'var(--font-body)' }}>
      <aside className={`bg-white border-r border-stone-200 flex flex-col flex-shrink-0 transition-all duration-300 ${collapsed ? "w-16" : "w-52"}`}>

        {/* Logo */}
        <div className={`border-b border-stone-100 flex items-center ${collapsed ? "px-3 py-4 justify-center" : "px-5 py-4"}`}>
          {collapsed ? (
            <button onClick={() => setCollapsed(false)} className="hover:opacity-70 transition">
              <StuDeskLogo size="sm" iconOnly />
            </button>
          ) : (
            <StuDeskLogo size="md" />
          )}
        </div>

        <nav className={`flex-1 py-3 overflow-y-auto ${collapsed ? "px-1.5" : "px-2.5"}`}>

          {/* Översikt */}
          {!collapsed && <p className="text-[10px] uppercase tracking-[0.15em] text-stone-300 px-2 mb-1.5">Översikt</p>}

          {collapsed ? (
            <div className="flex flex-col items-center gap-1 mb-3">
              <Link href="/student" className={`w-10 h-10 rounded-lg flex items-center justify-center transition ${pathname === "/student" ? "bg-stone-900 text-white" : "text-stone-400 hover:bg-stone-100 hover:text-stone-600"}`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg>
              </Link>
              <Link href="/student/calendar" className={`w-10 h-10 rounded-lg flex items-center justify-center transition ${pathname === "/student/calendar" ? "bg-stone-900 text-white" : "text-stone-400 hover:bg-stone-100 hover:text-stone-600"}`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>
              </Link>
            </div>
          ) : (
            <>
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
            </>
          )}

          {/* Kurser */}
          {!collapsed && <p className="text-[10px] uppercase tracking-[0.15em] text-stone-300 px-2 mb-1.5 mt-4">Kurser</p>}
          {collapsed && <div className="border-t border-stone-100 my-2" />}

          {courses.map((course) => {
            const href = `/student/courses/${course.id}`
            const isActive = pathname?.includes(course.id)

            if (collapsed) {
              return (
                <Link key={course.id} href={href}
                  className={`w-10 h-10 rounded-lg flex items-center justify-center mx-auto mb-1 transition text-[10px] font-mono font-bold ${
                    isActive ? "bg-stone-900 text-white" : "text-stone-400 hover:bg-stone-100 hover:text-stone-600"
                  }`}
                  title={course.label}>
                  {course.code.slice(0, 2)}
                </Link>
              )
            }

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

        {/* Profil */}
        <div className="px-3 py-3 border-t border-stone-100">
          {collapsed ? (
            <div className="flex flex-col items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-stone-800 text-white text-[10px] flex items-center justify-center font-medium">{initials}</div>
              <button onClick={() => setCollapsed(false)} className="text-stone-300 hover:text-stone-600 transition">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" /></svg>
              </button>
            </div>
          ) : (
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
          )}
        </div>
      </aside>

      <main className="flex-1 flex flex-col bg-stone-50 overflow-hidden">
        {children}
      </main>
    </div>
  )
}