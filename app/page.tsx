"use client"

import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { StuDeskLogo } from "@/components/Logo"

export default function LandingPage() {
  const { profile, loading } = useAuth()
  const router = useRouter()
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    if (!loading && profile) {
      if (!profile.is_approved) router.push("/auth/pending")
      else if (profile.role === "admin") router.push("/admin")
      else if (profile.role === "teacher") router.push("/teacher")
      else router.push("/student")
    }
  }, [profile, loading, router])

  useEffect(() => {
    const h = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", h, { passive: true })
    return () => window.removeEventListener("scroll", h)
  }, [])

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-black"><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /></div>

  const pastHero = scrollY > (typeof window !== "undefined" ? window.innerHeight * 0.3 : 300)

  return (
    <div style={{ fontFamily: 'var(--font-body)' }}>

      {/* Nav */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${pastHero ? "bg-white/90 backdrop-blur-md border-b border-stone-200/50" : "bg-transparent"}`}>
        <div className="flex justify-between items-center px-10 py-5 max-w-7xl mx-auto">
          <Link href="/"><StuDeskLogo size="md" theme={pastHero ? "dark" : "light"} /></Link>
          <div className="flex items-center gap-6">
            <Link href="/auth?mode=login" className={`text-sm transition ${pastHero ? "text-stone-500 hover:text-stone-900" : "text-white/50 hover:text-white"}`}>Logga in</Link>
            <Link href="/auth?mode=register" className={`text-sm px-6 py-2.5 rounded-full transition font-medium ${pastHero ? "bg-stone-900 text-white hover:bg-black" : "bg-white text-stone-900 hover:bg-white/90"}`}>Kom igång</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-black">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-cover bg-center opacity-35" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1758685848697-b5fb55f87407?w=1920&q=80')` }} />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
        </div>
        <div className="relative z-10 max-w-6xl mx-auto px-10 pt-32 pb-20 w-full">
          <div className="max-w-3xl">
            <p className="text-sm text-white/30 tracking-[0.15em] uppercase mb-8">AI-driven läroplattform</p>
            <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] leading-[1.05] text-white font-medium tracking-[0.01em]">
              Varje elev<br />förtjänar en<br /><em>personlig</em> lärare.
            </h1>
            <p className="text-lg text-white/35 mt-8 max-w-md leading-relaxed">
              StuDesk ger varje elev en AI-tutor som förstår kursplanen — och ger läraren insikter att agera på.
            </p>
            <div className="flex items-center gap-5 mt-12">
              <Link href="/auth?mode=register" className="inline-flex items-center gap-3 bg-white text-stone-900 px-7 py-3 rounded-full text-sm font-medium hover:bg-white/90 transition">
                Kom igång
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" /></svg>
              </Link>
              <span className="text-xs text-white/20">Gratis att testa</span>
            </div>
          </div>
        </div>
        {/* Scroll hint */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <div className="w-px h-12 bg-gradient-to-b from-transparent via-white/20 to-transparent" />
        </div>
      </section>

      {/* Transition — gradient to white */}
      <div className="h-32 bg-gradient-to-b from-black to-stone-50" />

      {/* Statement — offset layout */}
      <section className="bg-stone-50 pb-32">
        <div className="max-w-6xl mx-auto px-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            <div className="md:col-span-7">
              <p className="text-4xl md:text-5xl lg:text-6xl leading-[1.15] tracking-[0.02em] text-stone-800 font-medium">
                Skolan har inte<br />förändrats på<br />hundra år.
              </p>
            </div>
            <div className="md:col-span-5 md:pt-6">
              <p className="text-lg text-stone-400 leading-relaxed">
                Lärare arbetar reaktivt. Elever får hjälp för sent.
                Skolledning fattar beslut utan data. StuDesk förändrar det.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features — vertical stagger */}
      <section className="bg-white py-24">
        <div className="max-w-6xl mx-auto px-10 space-y-24">

          {/* Eleven */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
            <div className="md:col-span-5">
              <p className="text-[14px] text-stone-400 tracking-[0.15em] uppercase mb-4">01 — Eleven</p>
              <h3 className="text-2xl md:text-3xl font-medium text-stone-800 tracking-[0.02em] leading-[1.2] mb-5">
                Din egen AI-tutor som förstår vad du behöver.
              </h3>
              <p className="text-sm text-stone-500 leading-relaxed">
                StuDesk vet skillnaden mellan E och A i det svenska betygssystemet.
                AI:n anpassar sig efter ditt målbetyg, testar dig och visar exakt
                vad du behöver öva på — dygnet runt.
              </p>
            </div>
            <div className="md:col-span-7 md:col-start-6">
              <div className="relative rounded-2xl overflow-hidden aspect-[16/10]">
                <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=900&q=80')` }} />
                <div className="absolute inset-0 bg-black/10" />
              </div>
            </div>
          </div>

          {/* Läraren — omvänd */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
            <div className="md:col-span-7 order-2 md:order-1">
              <div className="relative rounded-2xl overflow-hidden aspect-[16/10]">
                <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=900&q=80')` }} />
                <div className="absolute inset-0 bg-black/10" />
              </div>
            </div>
            <div className="md:col-span-5 order-1 md:order-2">
              <p className="text-[14px] text-stone-400 tracking-[0.15em] uppercase mb-4">02 — Läraren</p>
              <h3 className="text-2xl md:text-3xl font-medium text-stone-800 tracking-[0.02em] leading-[1.2] mb-5">
                Insikter som gör undervisningen proaktiv.
              </h3>
              <p className="text-sm text-stone-500 leading-relaxed">
                Du behöver inte vänta på provresultaten för att veta var
                klassen står. StuDesk ser mönstren medan eleverna fortfarande
                lär sig — och visar dig exakt var en insats gör skillnad.
              </p>
            </div>
          </div>

          {/* Skolan */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
            <div className="md:col-span-5">
              <p className="text-[14px] text-stone-400 tracking-[0.15em] uppercase mb-4">03 — Skolan</p>
              <h3 className="text-2xl md:text-3xl font-medium text-stone-800 tracking-[0.02em] leading-[1.2] mb-5">
                Ett operativt styrsystem, inte bara en dashboard.
              </h3>
              <p className="text-sm text-stone-500 leading-relaxed">
                Realtidsdata över alla klasser och program. Signaler, åtgärder,
                mentorrapporter och schemaläggning — allt i ett flöde.
                Skolledningen ser vad som behöver göras, inte bara statistik.
              </p>
            </div>
            <div className="md:col-span-7 md:col-start-6">
              <div className="relative rounded-2xl overflow-hidden aspect-[16/10]">
                <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=900&q=80')` }} />
                <div className="absolute inset-0 bg-black/10" />
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Gradient transition */}
      <div className="h-24 bg-gradient-to-b from-white to-stone-50" />

    

      {/* Gradient transition */}
      <div className="h-24 bg-gradient-to-b from-stone-50 to-stone-950" />

      {/* CTA */}
      <section className="bg-stone-950 py-28 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)', backgroundSize: '50px 50px' }} />
        <div className="relative z-10">
          <p className="text-sm text-stone-500 tracking-[0.2em] uppercase mb-6">Redo att börja?</p>
          <p className="text-3xl md:text-5xl text-white font-medium tracking-[0.02em] leading-[1.2] mb-4">
            Framtidens klassrum<br />börjar här.
          </p>
          <p className="text-sm text-stone-500 mb-10 max-w-md mx-auto leading-relaxed">
            Anslut din skola och ge varje elev, lärare och rektor verktygen de förtjänar.
          </p>
          <Link href="/auth?mode=register" className="inline-flex items-center gap-3 bg-white text-stone-900 px-8 py-3.5 rounded-full text-sm font-medium hover:bg-stone-200 transition">
            Registrera ditt konto
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" /></svg>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <div className="bg-stone-950 border-t border-stone-800">
        <div className="max-w-6xl mx-auto px-10 py-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <StuDeskLogo size="sm" theme="light" />
            <p className="text-xs text-stone-600 mt-2">AI-driven läroplattform för den svenska skolan</p>
          </div>
          <div className="flex gap-8">
            <Link href="/auth?mode=login" className="text-xs text-stone-500 hover:text-white transition">Logga in</Link>
            <Link href="/auth?mode=register" className="text-xs text-stone-500 hover:text-white transition">Registrera</Link>
          </div>
        </div>
      </div>
    </div>
  )
}