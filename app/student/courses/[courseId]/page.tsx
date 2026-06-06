"use client"

import { useState } from "react"
import { useParams } from "next/navigation"

const courseData: Record<string, { name: string; code: string; teacher: string; color: { bg: string; border: string; text: string } }> = {
  "matematik-2b":      { name: "Matematik 2b",       code: "MA2B", teacher: "Maria Lindström", color: { bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-700" } },
  "svenska-1":         { name: "Svenska 1",           code: "SV1",  teacher: "Karin Holm",      color: { bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-700" } },
  "engelska-5":        { name: "Engelska 5",          code: "EN5",  teacher: "Karin Holm",      color: { bg: "bg-violet-50", border: "border-violet-200", text: "text-violet-700" } },
  "fysik-1":           { name: "Fysik 1",             code: "FY1",  teacher: "Per Ekström",     color: { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700" } },
  "historia-1b":       { name: "Historia 1b",         code: "HI1B", teacher: "Karin Holm",      color: { bg: "bg-sky-50", border: "border-sky-200", text: "text-sky-700" } },
  "samhallskunskap-1b":{ name: "Samhällskunskap 1b",  code: "SH1B", teacher: "Anna Karlsson",  color: { bg: "bg-rose-50", border: "border-rose-200", text: "text-rose-700" } },
}

type Tab = "overview" | "anslag" | "uppgifter" | "omdomen" | "moduler" | "innehall" | "kursplan" | "betygsmatris"

const tabs: { id: Tab; label: string }[] = [
  { id: "overview", label: "Översikt" },
  { id: "anslag", label: "Anslag" },
  { id: "uppgifter", label: "Uppgifter" },
  { id: "omdomen", label: "Omdömen" },
  { id: "moduler", label: "Moduler" },
  { id: "innehall", label: "Kursinnehåll" },
  { id: "kursplan", label: "Kursplan" },
  { id: "betygsmatris", label: "Betygsmatris" },
]

const demoAnnouncements = [
  { id: 1, title: "Provdatum ändrat", date: "12 maj", text: "Provet i andragradsekvationer flyttas till måndag 19 maj. Samma sal (R201)." },
  { id: 2, title: "Extratid inför provet", date: "9 maj", text: "Jag finns tillgänglig i R201 torsdag 15 maj kl 15–16 för frågor." },
  { id: 3, title: "Välkomna till kursen", date: "20 jan", text: "Hej alla! Ser fram emot terminen. Kursboken finns att hämta i biblioteket." },
]

const demoAssignments = [
  { id: 1, title: "Övningsuppgifter — Andragradsekvationer", due: "15 maj", status: "upcoming" as const },
  { id: 2, title: "Inlämning — Funktioner och grafer", due: "28 apr", status: "submitted" as const },
  { id: 3, title: "Gruppuppgift — Statistik", due: "14 apr", status: "graded" as const, grade: "B" },
]

const demoModules = [
  { id: 1, title: "Algebra och ekvationer", weeks: "v.3–6", status: "done" as const, topics: ["Första- och andragradsekvationer", "Faktorisering", "Formler"] },
  { id: 2, title: "Funktioner och grafer", weeks: "v.7–11", status: "done" as const, topics: ["Linjära funktioner", "Andragradsfunktioner", "Grafisk lösning"] },
  { id: 3, title: "Andragradsekvationer fördjupning", weeks: "v.12–16", status: "active" as const, topics: ["Pq-formeln", "Diskriminanten", "Tillämpningar"] },
  { id: 4, title: "Geometri", weeks: "v.17–20", status: "upcoming" as const, topics: ["Area och volym", "Pythagoras sats", "Trigonometri"] },
  { id: 5, title: "Sannolikhet och statistik", weeks: "v.21–24", status: "upcoming" as const, topics: ["Kombinatorik", "Sannolikhet", "Normalfördelning"] },
]

const demoContent = [
  { id: 1, type: "Kursbok", title: "Matematik 5000 2b", author: "Lena Alfredsson m.fl.", note: "Natur & Kultur, 2021" },
  { id: 2, type: "Digital resurs", title: "GeoGebra", author: "", note: "geogebra.org — grafritning och visualisering" },
  { id: 3, type: "Formelblad", title: "Formelblad MA2B", author: "", note: "Delas ut vid prov. Finns även på kurshemsidan." },
]

const demoGrades = [
  { id: 1, area: "Algebra och ekvationer", grade: "C", comment: "Behärskar grunderna väl. Utveckla algebraiska resonemang." },
  { id: 2, area: "Funktioner och grafer", grade: "B", comment: "Bra grafisk förståelse. Starka kopplingar mellan uttryck och graf." },
]

export default function CoursePage() {
  const params = useParams()
  const courseId = params.courseId as string
  const course = courseData[courseId]
  const [activeTab, setActiveTab] = useState<Tab>("overview")

  if (!course) return <div className="flex-1 flex items-center justify-center"><p className="text-stone-400">Kursen hittades inte.</p></div>

  const c = course.color

  return (
    <div className="flex-1 flex overflow-hidden" style={{ fontFamily: 'var(--font-body)' }}>

      {/* Kurs-sidebar */}
      <div className="w-48 bg-white border-r border-stone-200 flex flex-col shrink-0">
        <div className={`px-5 py-5 border-b ${c.border} ${c.bg}`}>
          <p className={`text-xs font-mono ${c.text} opacity-60`}>{course.code}</p>
          <h2 className={`text-sm font-bold ${c.text} mt-1`}>{course.name}</h2>
          <p className="text-[11px] text-stone-400 mt-1">{course.teacher}</p>
        </div>
        <nav className="flex-1 py-3 px-2">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`w-full text-left px-3 py-2 rounded-md text-[13px] transition mb-0.5 ${
                activeTab === tab.id ? "bg-stone-100 text-stone-800 font-medium" : "text-stone-500 hover:text-stone-700 hover:bg-stone-50"
              }`}>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Innehåll */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-8 py-10">

          {/* ÖVERSIKT */}
          {activeTab === "overview" && (
            <div>
              <h1 className="text-2xl font-semibold text-stone-800 tracking-tight">{course.name}</h1>
              <p className="text-sm text-stone-400 mt-1">{course.teacher} · {course.code}</p>

              {/* Aktuellt moment */}
              <div className={`mt-8 p-5 rounded-xl border-2 ${c.border} ${c.bg}`}>
                <p className="text-[10px] uppercase tracking-[0.15em] text-stone-400 font-medium">Aktuellt moment</p>
                <p className={`text-sm font-bold ${c.text} mt-2`}>Andragradsekvationer fördjupning</p>
                <p className="text-xs text-stone-500 mt-1">Vecka 12–16 · Pq-formeln, diskriminanten, tillämpningar</p>
              </div>

              {/* Senaste anslag */}
              <div className="mt-8">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[10px] uppercase tracking-[0.15em] text-stone-400 font-medium">Senaste anslag</p>
                  <button onClick={() => setActiveTab("anslag")} className="text-[11px] text-stone-400 hover:text-stone-600 transition">Visa alla</button>
                </div>
                <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
                  {demoAnnouncements.slice(0, 2).map((a, i) => (
                    <div key={a.id} className={`px-5 py-3.5 ${i > 0 ? "border-t border-stone-100" : ""}`}>
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-stone-700">{a.title}</p>
                        <p className="text-[10px] text-stone-300">{a.date}</p>
                      </div>
                      <p className="text-xs text-stone-400 mt-1 leading-relaxed">{a.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Kommande uppgifter */}
              <div className="mt-8">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[10px] uppercase tracking-[0.15em] text-stone-400 font-medium">Kommande uppgifter</p>
                  <button onClick={() => setActiveTab("uppgifter")} className="text-[11px] text-stone-400 hover:text-stone-600 transition">Visa alla</button>
                </div>
                <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
                  {demoAssignments.filter(a => a.status === "upcoming").map((a, i) => (
                    <div key={a.id} className={`flex items-center justify-between px-5 py-3.5 ${i > 0 ? "border-t border-stone-100" : ""}`}>
                      <p className="text-sm text-stone-700">{a.title}</p>
                      <p className="text-xs text-red-500 font-medium">{a.due}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Moduler snabbvy */}
              <div className="mt-8">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[10px] uppercase tracking-[0.15em] text-stone-400 font-medium">Kursmoduler</p>
                  <button onClick={() => setActiveTab("moduler")} className="text-[11px] text-stone-400 hover:text-stone-600 transition">Visa alla</button>
                </div>
                <div className="flex gap-2">
                  {demoModules.map(m => (
                    <div key={m.id} className={`flex-1 p-3 rounded-lg border text-center ${
                      m.status === "done" ? "border-emerald-200 bg-emerald-50" :
                      m.status === "active" ? `${c.border} ${c.bg}` :
                      "border-stone-200 bg-white"
                    }`}>
                      <p className={`text-[10px] font-medium ${
                        m.status === "done" ? "text-emerald-600" :
                        m.status === "active" ? c.text :
                        "text-stone-400"
                      }`}>{m.id}</p>
                      <p className={`text-[9px] mt-0.5 ${
                        m.status === "done" ? "text-emerald-500" :
                        m.status === "active" ? "text-stone-500" :
                        "text-stone-300"
                      }`}>{m.status === "done" ? "Klar" : m.status === "active" ? "Pågår" : m.weeks}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ANSLAG */}
          {activeTab === "anslag" && (
            <div>
              <h1 className="text-2xl font-semibold text-stone-800 tracking-tight">Anslag</h1>
              <p className="text-sm text-stone-400 mt-1">{course.name}</p>
              <div className="mt-6 space-y-3">
                {demoAnnouncements.map(a => (
                  <div key={a.id} className="bg-white border border-stone-200 rounded-xl px-5 py-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-stone-700">{a.title}</p>
                      <p className="text-[11px] text-stone-300">{a.date}</p>
                    </div>
                    <p className="text-sm text-stone-500 mt-2 leading-relaxed">{a.text}</p>
                    <p className="text-[11px] text-stone-300 mt-3">{course.teacher}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* UPPGIFTER */}
          {activeTab === "uppgifter" && (
            <div>
              <h1 className="text-2xl font-semibold text-stone-800 tracking-tight">Uppgifter</h1>
              <p className="text-sm text-stone-400 mt-1">{course.name}</p>
              <div className="mt-6 bg-white border border-stone-200 rounded-xl overflow-hidden">
                {demoAssignments.map((a, i) => (
                  <div key={a.id} className={`flex items-center gap-4 px-5 py-4 ${i > 0 ? "border-t border-stone-100" : ""}`}>
                    <div className={`w-2 h-2 rounded-full ${
                      a.status === "upcoming" ? "bg-amber-400" :
                      a.status === "submitted" ? "bg-blue-400" :
                      "bg-emerald-400"
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-stone-700">{a.title}</p>
                      <p className="text-[11px] text-stone-400 mt-0.5">
                        {a.status === "upcoming" ? "Att lämna in" : a.status === "submitted" ? "Inskickad" : "Bedömd"}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className={`text-xs ${a.status === "upcoming" ? "text-red-500 font-medium" : "text-stone-400"}`}>{a.due}</p>
                      {a.grade && <p className="text-xs font-semibold text-emerald-600 mt-0.5">{a.grade}</p>}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-3 mt-4">
                <span className="flex items-center gap-1.5 text-[10px] text-stone-400"><div className="w-2 h-2 rounded-full bg-amber-400" />Att lämna in</span>
                <span className="flex items-center gap-1.5 text-[10px] text-stone-400"><div className="w-2 h-2 rounded-full bg-blue-400" />Inskickad</span>
                <span className="flex items-center gap-1.5 text-[10px] text-stone-400"><div className="w-2 h-2 rounded-full bg-emerald-400" />Bedömd</span>
              </div>
            </div>
          )}

          {/* OMDÖMEN */}
          {activeTab === "omdomen" && (
            <div>
              <h1 className="text-2xl font-semibold text-stone-800 tracking-tight">Omdömen</h1>
              <p className="text-sm text-stone-400 mt-1">{course.name}</p>
              <div className="mt-6 space-y-3">
                {demoGrades.map(g => (
                  <div key={g.id} className="bg-white border border-stone-200 rounded-xl px-5 py-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-stone-700">{g.area}</p>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                        g.grade === "A" ? "bg-emerald-50 text-emerald-700" :
                        g.grade === "B" ? "bg-blue-50 text-blue-700" :
                        g.grade === "C" ? "bg-amber-50 text-amber-700" :
                        "bg-stone-50 text-stone-600"
                      }`}>{g.grade}</span>
                    </div>
                    <p className="text-sm text-stone-500 mt-2 leading-relaxed">{g.comment}</p>
                    <p className="text-[11px] text-stone-300 mt-2">{course.teacher}</p>
                  </div>
                ))}
                {demoGrades.length === 0 && <p className="text-sm text-stone-400 py-8 text-center">Inga omdömen ännu.</p>}
              </div>
            </div>
          )}

          {/* MODULER */}
          {activeTab === "moduler" && (
            <div>
              <h1 className="text-2xl font-semibold text-stone-800 tracking-tight">Moduler</h1>
              <p className="text-sm text-stone-400 mt-1">{course.name}</p>
              <div className="mt-6 space-y-3">
                {demoModules.map(m => (
                  <div key={m.id} className={`bg-white border rounded-xl px-5 py-4 ${
                    m.status === "active" ? `${c.border} ${c.bg}` : "border-stone-200"
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                          m.status === "done" ? "bg-emerald-100 text-emerald-600" :
                          m.status === "active" ? `${c.bg} ${c.text}` :
                          "bg-stone-100 text-stone-400"
                        }`}>{m.id}</div>
                        <div>
                          <p className={`text-sm font-medium ${m.status === "active" ? c.text : m.status === "done" ? "text-stone-700" : "text-stone-400"}`}>{m.title}</p>
                          <p className="text-[11px] text-stone-400 mt-0.5">{m.weeks}</p>
                        </div>
                      </div>
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                        m.status === "done" ? "bg-emerald-100 text-emerald-600" :
                        m.status === "active" ? `${c.bg} ${c.text} border ${c.border}` :
                        "bg-stone-100 text-stone-400"
                      }`}>
                        {m.status === "done" ? "Avklarad" : m.status === "active" ? "Pågår" : "Kommande"}
                      </span>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {m.topics.map(t => (
                        <span key={t} className="text-[11px] text-stone-500 bg-stone-50 px-2 py-1 rounded">{t}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* KURSINNEHÅLL */}
          {activeTab === "innehall" && (
            <div>
              <h1 className="text-2xl font-semibold text-stone-800 tracking-tight">Kursinnehåll</h1>
              <p className="text-sm text-stone-400 mt-1">{course.name}</p>
              <div className="mt-6 space-y-3">
                {demoContent.map(item => (
                  <div key={item.id} className="bg-white border border-stone-200 rounded-xl px-5 py-4">
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-medium text-stone-400 bg-stone-50 px-2 py-0.5 rounded">{item.type}</span>
                      <p className="text-sm font-medium text-stone-700">{item.title}</p>
                    </div>
                    {item.author && <p className="text-xs text-stone-500 mt-1.5">{item.author}</p>}
                    <p className="text-xs text-stone-400 mt-1">{item.note}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* KURSPLAN */}
          {activeTab === "kursplan" && (
            <div>
              <h1 className="text-2xl font-semibold text-stone-800 tracking-tight">Kursplan</h1>
              <p className="text-sm text-stone-400 mt-1">{course.name} · {course.code}</p>
              <div className="mt-6 bg-white border border-stone-200 rounded-xl px-5 py-5">
                <h3 className="text-sm font-semibold text-stone-700">Syfte</h3>
                <p className="text-sm text-stone-500 mt-2 leading-relaxed">
                  Undervisningen i ämnet matematik ska ge eleverna förutsättningar att utveckla förmåga att använda och beskriva matematiska begrepp och samband mellan begrepp, välja och använda lämpliga matematiska metoder för att göra beräkningar och lösa rutinuppgifter, samt formulera och lösa problem.
                </p>
                <h3 className="text-sm font-semibold text-stone-700 mt-6">Centralt innehåll</h3>
                <div className="mt-2 space-y-1.5">
                  {["Algebra och funktioner", "Geometri", "Sannolikhet och statistik", "Problemlösning", "Matematiska resonemang"].map(item => (
                    <div key={item} className="flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-stone-400" />
                      <p className="text-sm text-stone-500">{item}</p>
                    </div>
                  ))}
                </div>
                <h3 className="text-sm font-semibold text-stone-700 mt-6">Kunskapskrav</h3>
                <p className="text-sm text-stone-500 mt-2 leading-relaxed">
                  Se betygsmatrisen för detaljerade kunskapskrav per betygssteg.
                </p>
              </div>
              <p className="text-[11px] text-stone-300 mt-3">Källa: Skolverket · SKOLFS 2010:261</p>
            </div>
          )}

          {/* BETYGSMATRIS */}
          {activeTab === "betygsmatris" && (
            <div>
              <h1 className="text-2xl font-semibold text-stone-800 tracking-tight">Betygsmatris</h1>
              <p className="text-sm text-stone-400 mt-1">{course.name} · {course.code}</p>
              <div className="mt-6 bg-white border border-stone-200 rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-stone-50 border-b border-stone-200">
                      <th className="text-left px-5 py-3 text-xs font-semibold text-stone-600 w-1/4">Förmåga</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-stone-600">E</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-stone-600">C</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-stone-600">A</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { area: "Begrepp", e: "Grundläggande kunskaper om begrepp.", c: "Goda kunskaper om begrepp och samband.", a: "Mycket goda kunskaper om begrepp, samband och strukturer." },
                      { area: "Procedur", e: "Väljer och använder metoder med viss säkerhet.", c: "Väljer och använder metoder med säkerhet.", a: "Väljer och använder effektiva metoder med stor säkerhet." },
                      { area: "Problemlösning", e: "Löser enkla problem. Bidrar till förslag.", c: "Löser relativt komplexa problem. Formulerar förslag.", a: "Löser komplexa problem. Formulerar och väljer strategier." },
                      { area: "Resonemang", e: "Enkla resonemang. Följer andras.", c: "Välgrundade resonemang. Framför och bemöter.", a: "Välgrundade och nyanserade resonemang." },
                    ].map((row, i) => (
                      <tr key={row.area} className={i > 0 ? "border-t border-stone-100" : ""}>
                        <td className="px-5 py-3 font-medium text-stone-700 align-top">{row.area}</td>
                        <td className="px-4 py-3 text-stone-500 text-xs leading-relaxed align-top">{row.e}</td>
                        <td className="px-4 py-3 text-stone-500 text-xs leading-relaxed align-top">{row.c}</td>
                        <td className="px-4 py-3 text-stone-500 text-xs leading-relaxed align-top">{row.a}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-[11px] text-stone-300 mt-3">Källa: Skolverket · Kunskapskrav för {course.name}</p>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}