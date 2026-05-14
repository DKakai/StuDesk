"use client"
import { StuDeskLogo } from "@/components/Logo"
import ScheduleBuilder from "@/components/ScheduleBuilder"
import { useAuth } from "@/lib/auth-context"
import { supabase } from "@/lib/supabase"
import { useEffect, useState, useMemo } from "react"
import { useRouter } from "next/navigation"

// ============================================
// TYPER
// ============================================
type Profile = { id: string; full_name: string; role: string; is_approved: boolean; created_at: string }
type SchoolRole = "rektor" | "bitr_rektor" | "mentor" | "admin_staff"
type Tab = "today" | "signals" | "actions" | "absence" | "communication" | "schedule" | "classes" | "classDetail" | "teachers" | "reports" | "users" | "subjects"
type RiskLevel = "green" | "yellow" | "red"
type ActionStatus = "planned" | "active" | "overdue" | "done"
type SignalType = "attendance" | "performance" | "ai_flag" | "mentor_report" | "staffing"
type LessonSolution = "unresolved" | "substitute" | "internal" | "ai_work" | "moved" | "cancelled"

type Student = { id: string; name: string; classId: string; risk: RiskLevel; attendance: number; mastery: number; aiActivity: number; note?: string }
type ClassData = { id: string; name: string; program: string; programCode: string; year: number; mentor: string; students: Student[] }
type Signal = { id: string; type: SignalType; severity: RiskLevel; title: string; description: string; classId?: string; date: string; handled: boolean }
type Action = { id: string; title: string; student?: string; classId: string; responsible: string; deadline: string; status: ActionStatus; category: string }
type MentorReport = { id: string; classId: string; mentor: string; date: string; type: "class" | "student"; studentName?: string; summary: string; risk: RiskLevel; followUp: string; read: boolean; actions: string[] }
type Msg = { id: string; from: string; subject: string; preview: string; date: string; read: boolean; linkedClass?: string; category: string }

// ============================================
// DATA
// ============================================
function genStudents(classId: string, count: number, seed: number): Student[] {
  const fn = ["Ali","Emma","Leo","Sara","Oscar","Nora","Ahmed","Maja","Erik","Lina","Hugo","Ella","Isak","Wilma","Lucas","Olivia","Noah","Alice","Elias","Alma","William","Ebba","Oliver","Saga","Adam","Freja","Liam","Astrid","Felix","Julia"]
  const ln = ["Hassan","Ström","Andersson","Nilsson","Berg","Ek","Yusuf","Larsson","Johansson","Karlsson","Lindqvist","Eriksson","Persson","Svensson","Olsson","Hedlund","Nordin","Sundström","Holmberg","Nyström"]
  return Array.from({ length: count }, (_, i) => {
    const risk: RiskLevel = i < Math.floor(count * 0.07) ? "red" : i < Math.floor(count * 0.22) ? "yellow" : "green"
    return { id: `${classId}-${i}`, name: `${fn[(seed*7+i*3)%fn.length]} ${ln[(seed*11+i*5)%ln.length]}`, classId, risk,
      attendance: risk === "red" ? 55+(i*7)%25 : risk === "yellow" ? 75+(i*3)%15 : 88+(i*5)%12,
      mastery: risk === "red" ? 20+(i*11)%25 : risk === "yellow" ? 40+(i*7)%20 : 60+(i*9)%30,
      aiActivity: 10+(i*13)%80, note: risk === "red" ? ["Sjunkande närvaro","Riskerar F","Oroande mönster"][i%3] : undefined }
  })
}

const classes: ClassData[] = [
  { id:"na26a", name:"NA26a", program:"Naturvetenskap", programCode:"NA", year:2, mentor:"Maria Lindström", students: genStudents("na26a",28,1) },
  { id:"na26b", name:"NA26b", program:"Naturvetenskap", programCode:"NA", year:2, mentor:"Per Ekström", students: genStudents("na26b",26,2) },
  { id:"te26",  name:"TE26",  program:"Teknik", programCode:"TE", year:2, mentor:"Erik Johansson", students: genStudents("te26",31,3) },
  { id:"sa26a", name:"SA26a", program:"Samhällsvetenskap", programCode:"SA", year:2, mentor:"Anna Karlsson", students: genStudents("sa26a",25,4) },
  { id:"sa26b", name:"SA26b", program:"Samhällsvetenskap", programCode:"SA", year:2, mentor:"Karin Holm", students: genStudents("sa26b",27,5) },
  { id:"ek26",  name:"EK26",  program:"Ekonomi", programCode:"EK", year:2, mentor:"Johan Berg", students: genStudents("ek26",30,6) },
]
const allStudents = classes.flatMap(c => c.students)

const signals: Signal[] = [
  { id:"s1", type:"attendance", severity:"red", title:"NA26a — 3 elever under 70% närvaro", description:"Sjunkande trend sedan v.36. Mentor kontaktad men ingen uppföljning dokumenterad.", classId:"na26a", date:"2026-05-14", handled:false },
  { id:"s2", type:"ai_flag", severity:"yellow", title:"TE26 — Ovanligt AI-användningsmönster", description:"Flera elever kopierar svar istället för att arbeta genom problem.", classId:"te26", date:"2026-05-13", handled:false },
  { id:"s3", type:"performance", severity:"yellow", title:"Matematik 2b — Svag progression i 3 klasser", description:"NA26a, SA26a och SA26b ligger under förväntat i andragradsekvationer.", date:"2026-05-13", handled:false },
  { id:"s4", type:"staffing", severity:"red", title:"Erik Johansson — Sjukanmäld torsdag-fredag", description:"4 lektioner saknar bemanning. Vikarie behöver bokas för TE26 och EK26.", date:"2026-05-14", handled:false },
  { id:"s5", type:"mentor_report", severity:"yellow", title:"SA26a — Ny klassrapport från mentor", description:"Anna Karlsson rapporterar social oro och svag studiero under eftermiddagslektioner.", classId:"sa26a", date:"2026-05-12", handled:true },
  { id:"s6", type:"attendance", severity:"yellow", title:"EK26 — Frånvaron ökade 8% sedan förra veckan", description:"Framförallt fredagar. Kan vara mönster att bevaka.", classId:"ek26", date:"2026-05-14", handled:false },
]

const actions: Action[] = [
  { id:"a1", title:"Stödtimme Matematik 2b", student:"Ali Hassan", classId:"na26a", responsible:"Maria Lindström", deadline:"2026-05-10", status:"overdue", category:"pedagogisk" },
  { id:"a2", title:"Kontakt med vårdnadshavare", student:"Hugo Eriksson", classId:"te26", responsible:"Erik Johansson", deadline:"2026-05-12", status:"overdue", category:"kommunikation" },
  { id:"a3", title:"Specialpedagogisk kartläggning", student:"Sara Nilsson", classId:"sa26a", responsible:"Lisa Hedström", deadline:"2026-05-20", status:"active", category:"elevhälsa" },
  { id:"a4", title:"Anpassat schema Fysik 1", student:"Ahmed Yusuf", classId:"na26b", responsible:"Per Ekström", deadline:"2026-05-18", status:"active", category:"pedagogisk" },
  { id:"a5", title:"Workshop studieteknik TE26", classId:"te26", responsible:"Erik Johansson", deadline:"2026-05-22", status:"planned", category:"pedagogisk" },
  { id:"a6", title:"EHT-möte om NA26a frånvaro", classId:"na26a", responsible:"Maria Lindström", deadline:"2026-05-16", status:"planned", category:"elevhälsa" },
  { id:"a7", title:"Boka vikarie tors-fre", classId:"te26", responsible:"Admin", deadline:"2026-05-14", status:"active", category:"bemanning" },
]

const reports: MentorReport[] = [
  { id:"r1", classId:"na26a", mentor:"Maria Lindström", date:"2026-05-12", type:"class", summary:"Klassen har hög motivation men 3 elever visar tydligt sjunkande närvaro. 62% klarar inte C-nivå i andragradsekvationer.", risk:"yellow", followUp:"2026-05-19", read:false, actions:["Extra repetition andragradsekvationer","Kontakta 3 elevers vårdnadshavare"] },
  { id:"r2", classId:"te26", mentor:"Erik Johansson", date:"2026-05-10", type:"class", summary:"Hög AI-användning men analysen visar att flera elever kopierar svar. Diskuterade studieteknik med klassen.", risk:"yellow", followUp:"2026-05-17", read:false, actions:["Justera AI-inställningar","Workshop studieteknik"] },
  { id:"r3", classId:"sa26a", mentor:"Anna Karlsson", date:"2026-05-08", type:"class", summary:"Social oro i klassen. Svag studiero under eftermiddagslektioner. Två elever i konflikt. Behöver kurators insats.", risk:"yellow", followUp:"2026-05-22", read:true, actions:["Kurator kontaktas","Klassråd om trivsel"] },
  { id:"r4", classId:"ek26", mentor:"Johan Berg", date:"2026-05-06", type:"class", summary:"Klassen presterar stabilt. Ingen elev under risknivå gul. Närvaron förbättrad sedan v.36.", risk:"green", followUp:"2026-06-01", read:true, actions:[] },
]

const messages: Msg[] = [
  { id:"m1", from:"Maria Lindström", subject:"Frånvaro NA26a — behöver stöd", preview:"Tre elever har missat mer än 30% sedan...", date:"2026-05-14", read:false, linkedClass:"NA26a", category:"elevstöd" },
  { id:"m2", from:"Erik Johansson", subject:"Sjukanmälan tors-fre", preview:"Jag är sjuk och kan inte vara på plats...", date:"2026-05-14", read:false, category:"bemanning" },
  { id:"m3", from:"Anna Karlsson", subject:"Underlag SA26a till kurator", preview:"Bifogar mina anteckningar om den sociala...", date:"2026-05-12", read:false, linkedClass:"SA26a", category:"elevhälsa" },
  { id:"m4", from:"Karin Holm", subject:"SA26b — inga anmärkningar", preview:"Vill bara rapportera att klassen fungerar...", date:"2026-05-11", read:true, linkedClass:"SA26b", category:"rapport" },
  { id:"m5", from:"Johan Berg", subject:"EK26 fredagsfrånvaro", preview:"Noterar att flera elever konsekvent...", date:"2026-05-10", read:true, linkedClass:"EK26", category:"elevstöd" },
]

const todaysAbsences = [
  { id:"abs1", teacher:"Erik Johansson", type:"sick" as const, period:"Heldag", reportedAt:"07:15", note:"Feber, troligen även fredag" },
]

const affectedLessons = [
  { id:"al1", absenceId:"abs1", time:"08:15", className:"TE26", subject:"Teknik 1", room:"R305", lessonType:"lektion", critical:false, solution:"ai_work" as LessonSolution, solutionDetail:"AI-repetition: Hållfasthetslära", substituteNote:undefined as string|undefined, studentMessageSent:true },
  { id:"al2", absenceId:"abs1", time:"10:30", className:"TE26", subject:"Fysik 1", room:"Labbsal", lessonType:"labb", critical:true, solution:"moved" as LessonSolution, solutionDetail:"Flyttad till måndag v.21", substituteNote:undefined as string|undefined, studentMessageSent:true },
  { id:"al3", absenceId:"abs1", time:"13:00", className:"EK26", subject:"Matematik 2b", room:"R201", lessonType:"lektion", critical:false, solution:"substitute" as LessonSolution, solutionDetail:"Vikarie: Per Ekström (ledig 13-15)", substituteNote:"Repetitionspaket andragradsekvationer. Elever under 60% mastery börjar med grundnivå. Övriga gör fördjupning.", studentMessageSent:true },
  { id:"al4", absenceId:"abs1", time:"14:00", className:"TE26", subject:"Mentorstid", room:"R305", lessonType:"mentor", critical:false, solution:"internal" as LessonSolution, solutionDetail:"Bitr. mentor Karin Holm tar passet", substituteNote:undefined as string|undefined, studentMessageSent:false },
]

const demoSchedule = [
  { time:"08:15", slots:["Ma2b · NA26a · R201","Fy1 · TE26 · R305","","Sv1 · SA26a · R102","Ma2b · EK26 · R201"] },
  { time:"09:15", slots:["Ma2b · NA26a · R201","","Ma3c · NA26b · R201","Sv1 · SA26a · R102",""] },
  { time:"10:30", slots:["","En5 · NA26a · R108","Ma3c · NA26b · R201","","Fy1 · TE26 · R305"] },
  { time:"11:30", slots:["Mentor NA26a","En5 · NA26a · R108","","Ma2b · SA26b · R201","Fy1 · TE26 · R305"] },
  { time:"13:00", slots:["Ma3c · NA26b · R201","","Stöd · NA26a","Ma2b · SA26b · R201",""] },
  { time:"14:00", slots:["Ma3c · NA26b · R201","APT","Stöd · SA26a","","Planering"] },
]
const dayNames = ["Mån","Tis","Ons","Tors","Fre"]

// ============================================
// HELPERS
// ============================================
function cStats(c: ClassData) {
  const r = c.students.filter(s=>s.risk==="red").length, y = c.students.filter(s=>s.risk==="yellow").length
  const att = Math.round(c.students.reduce((a,s)=>a+s.attendance,0)/c.students.length)
  const mas = Math.round(c.students.reduce((a,s)=>a+s.mastery,0)/c.students.length)
  return { r, y, att, mas }
}
function Dot({ l }: { l: RiskLevel }) { return <div className={`w-2 h-2 rounded-full ${l==="red"?"bg-red-500":l==="yellow"?"bg-amber-400":"bg-emerald-500"}`} /> }
function SBadge({ s }: { s: ActionStatus }) {
  const m: Record<ActionStatus,string> = { planned:"bg-stone-100 text-stone-600", active:"bg-blue-50 text-blue-700", overdue:"bg-red-50 text-red-700", done:"bg-emerald-50 text-emerald-700" }
  const l: Record<ActionStatus,string> = { planned:"Planerad", active:"Pågående", overdue:"Försenad", done:"Klar" }
  return <span className={`text-[11px] font-medium px-2 py-0.5 rounded ${m[s]}`}>{l[s]}</span>
}
function SigIcon({ t }: { t: SignalType }) {
  const i: Record<SignalType,string> = { attendance:"Frånvaro", performance:"Progression", ai_flag:"AI-flagga", mentor_report:"Rapport", staffing:"Bemanning" }
  return <span className="text-[10px] bg-stone-100 text-stone-500 px-1.5 py-0.5 rounded">{i[t]}</span>
}
function SL({ children }: { children: string }) { return <p className="text-[10px] uppercase tracking-[0.15em] text-stone-400 mb-3 font-medium">{children}</p> }

const roleConfig: Record<SchoolRole, { label: string; desc: string; tabs: Tab[] }> = {
  rektor: { label:"Rektor", desc:"Hela skolan", tabs:["today","signals","actions","absence","communication","schedule","classes","teachers","reports","users","subjects"] },
  bitr_rektor: { label:"Biträdande rektor", desc:"Program och arbetslag", tabs:["today","signals","actions","absence","communication","schedule","classes","teachers","reports"] },
  mentor: { label:"Mentor", desc:"Dina klasser", tabs:["today","actions","communication","classes","reports"] },
  admin_staff: { label:"Skoladministratör", desc:"Schema och drift", tabs:["today","absence","communication","schedule","users"] },
}

// ============================================
// KOMPONENT
// ============================================
export default function AdminDashboard() {
  const { profile, loading, signOut } = useAuth()
  const router = useRouter()
  const [tab, setTab] = useState<Tab>("today")
  const [users, setUsers] = useState<Profile[]>([])
  const [schoolRole, setSchoolRole] = useState<SchoolRole>("rektor")
  const [selectedClass, setSelectedClass] = useState<string|null>(null)
  const [riskFilter, setRiskFilter] = useState<RiskLevel|"all">("all")

  useEffect(() => { if (!loading && (!profile || profile.role !== "admin")) router.push("/") }, [profile,loading,router])
  useEffect(() => { if (profile?.role === "admin") loadUsers() }, [profile])
  async function loadUsers() { const { data } = await supabase.from("profiles").select("*").order("created_at",{ascending:false}); setUsers(data??[]) }
  async function approveUser(id: string) { await supabase.from("profiles").update({is_approved:true}).eq("id",id); loadUsers() }

  const cfg = roleConfig[schoolRole]
  const mentorClasses = useMemo(() => classes.filter(c => c.mentor === "Maria Lindström"), [])
  const visibleClasses = schoolRole === "mentor" ? mentorClasses : classes
  const visibleSignals = schoolRole === "mentor" ? signals.filter(s => mentorClasses.some(c => c.id === s.classId)) : signals
  const visibleActions = schoolRole === "mentor" ? actions.filter(a => mentorClasses.some(c => c.id === a.classId)) : schoolRole === "admin_staff" ? actions.filter(a => a.category === "bemanning") : actions
  const visibleMessages = schoolRole === "admin_staff" ? messages.filter(m => m.category === "bemanning") : messages

  const pending = users.filter(u => !u.is_approved)
  const overdueActions = visibleActions.filter(a => a.status === "overdue")
  const unreadReports = reports.filter(r => !r.read)
  const unhandledSignals = visibleSignals.filter(s => !s.handled)
  const activeClass = classes.find(c => c.id === selectedClass)

  if (loading || !profile) return null

  const tabLabels: Record<Tab,string> = { today:"Idag", signals:"Signaler", actions:"Ärenden", absence:"Personalfrånvaro", communication:"Kommunikation", schedule:"Schema", classes:"Klasser", classDetail:"", teachers:"Personal", reports:"Rapporter", users:"Användare", subjects:"Ämnen" }
  const navGroups = [
    { title:"Arbetsflöde", ids:["today","signals","actions","absence","communication"] as Tab[] },
    { title:"Skolan", ids:["schedule","classes","teachers","reports"] as Tab[] },
    { title:"Inställningar", ids:["users","subjects"] as Tab[] },
  ]
  function openClass(id: string) { setSelectedClass(id); setTab("classDetail") }

  return (
    <div className="min-h-screen bg-stone-50 flex">
      {/* SIDEBAR */}
      <aside className="w-52 bg-white border-r border-stone-200 flex flex-col fixed inset-y-0 left-0 z-30">
        <div className="px-5 py-4 border-b border-stone-100">
          <StuDeskLogo size="md" />
          <select value={schoolRole} onChange={e=>{setSchoolRole(e.target.value as SchoolRole);setTab("today")}} className="mt-2 w-full text-[11px] bg-stone-50 border border-stone-200 rounded px-2 py-1.5 text-stone-600">
            <option value="rektor">Rektor</option><option value="bitr_rektor">Biträdande rektor</option><option value="mentor">Mentor</option><option value="admin_staff">Skoladministratör</option>
          </select>
        </div>
        <nav className="flex-1 py-3 px-2.5 overflow-y-auto">
          {navGroups.map(g => {
            const vis = g.ids.filter(id => cfg.tabs.includes(id))
            if (!vis.length) return null
            return (<div key={g.title} className="mb-4"><p className="text-[10px] uppercase tracking-[0.15em] text-stone-300 px-2 mb-1.5">{g.title}</p>
              {vis.map(id => {
                const badge = id==="signals"?unhandledSignals.length:id==="actions"?overdueActions.length:id==="communication"?visibleMessages.filter(m=>!m.read).length:id==="users"?pending.length:id==="absence"?todaysAbsences.length:0
                return (<button key={id} onClick={()=>setTab(id)} className={`w-full flex items-center justify-between px-2.5 py-2 rounded-md text-[13px] transition mb-px ${tab===id||(id==="classes"&&tab==="classDetail")?"bg-stone-900 text-white":"text-stone-500 hover:text-stone-800 hover:bg-stone-50"}`}>
                  <span>{tabLabels[id]}</span>
                  {badge>0&&<span className={`text-[10px] font-medium min-w-[18px] text-center px-1 py-px rounded-full ${tab===id?"bg-white/20 text-white":"bg-red-100 text-red-600"}`}>{badge}</span>}
                </button>)
              })}
            </div>)
          })}
        </nav>
        <div className="px-3 py-3 border-t border-stone-100"><div className="flex items-center gap-2.5 px-2">
          <div className="w-7 h-7 rounded-full bg-stone-800 text-white text-[10px] flex items-center justify-center font-medium">{profile.full_name.split(" ").map((n:string)=>n[0]).join("").slice(0,2)}</div>
          <div className="flex-1 min-w-0"><p className="text-xs text-stone-600 truncate">{profile.full_name}</p><p className="text-[10px] text-stone-400">{cfg.label}</p></div>
          <button onClick={signOut} className="text-stone-300 hover:text-stone-600"><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" /></svg></button>
        </div></div>
      </aside>

      {/* CONTENT */}
      <main className="flex-1 ml-52 overflow-y-auto min-h-screen"><div className="max-w-5xl mx-auto px-8">

        {/* ===== IDAG ===== */}
        {tab === "today" && (<>
          <div className="pt-10 pb-2"><p className="text-[11px] uppercase tracking-[0.2em] text-stone-400 mb-2">{cfg.label} · {cfg.desc}</p>
            <h1 className="text-3xl tracking-tight" style={{fontFamily:'var(--font-heading)'}}>Onsdag 14 maj</h1></div>

          {(unhandledSignals.filter(s=>s.severity==="red").length>0||overdueActions.length>0)&&(
            <div className="mt-6 mb-2"><SL>Kräver åtgärd idag</SL><div className="space-y-2">
              {unhandledSignals.filter(s=>s.severity==="red").map(s=>(<div key={s.id} className="bg-white border border-red-200 rounded-lg p-4 flex items-start justify-between"><div className="flex items-start gap-3"><Dot l="red" /><div><p className="text-sm font-medium text-stone-800">{s.title}</p><p className="text-xs text-stone-400 mt-0.5">{s.description}</p></div></div><div className="flex items-center gap-2 ml-4 shrink-0"><SigIcon t={s.type} /><button onClick={()=>s.type==="staffing"?setTab("absence"):setTab("actions")} className="text-xs bg-stone-900 text-white px-3 py-1.5 rounded-md">Hantera</button></div></div>))}
              {overdueActions.map(a=>(<div key={a.id} className="bg-white border border-red-100 rounded-lg p-4 flex items-center justify-between"><div><div className="flex items-center gap-2"><p className="text-sm font-medium text-stone-800">{a.title}</p><SBadge s="overdue" /></div><p className="text-xs text-stone-400 mt-0.5">Ansvarig: {a.responsible} · Deadline: {a.deadline}</p></div><button className="text-xs border border-stone-200 text-stone-600 px-3 py-1.5 rounded-md hover:bg-stone-50 ml-4">Påminn</button></div>))}
            </div></div>
          )}

          {unhandledSignals.filter(s=>s.severity!=="red").length>0&&(
            <div className="mt-6 mb-2"><SL>Signaler att bevaka</SL><div className="space-y-2">
              {unhandledSignals.filter(s=>s.severity!=="red").map(s=>(<div key={s.id} className="bg-white border border-stone-200 rounded-lg p-4 flex items-start justify-between hover:border-stone-300 transition"><div className="flex items-start gap-3"><Dot l={s.severity} /><div><p className="text-sm text-stone-800">{s.title}</p><p className="text-xs text-stone-400 mt-0.5">{s.description}</p></div></div><div className="flex items-center gap-2 ml-4 shrink-0"><SigIcon t={s.type} />{s.classId&&<button onClick={()=>openClass(s.classId!)} className="text-xs text-stone-400 hover:text-stone-800">Visa klass →</button>}</div></div>))}
            </div></div>
          )}

          <div className="mt-6 mb-10"><SL>Klassöversikt</SL>
            <div className="bg-white border border-stone-200 rounded-xl overflow-hidden"><table className="w-full text-sm"><thead><tr className="border-b border-stone-200 bg-stone-50/50 text-left">
              <th className="px-5 py-3 text-[10px] uppercase tracking-widest text-stone-400 font-normal">Klass</th><th className="px-2 py-3 text-[10px] uppercase tracking-widest text-stone-400 font-normal">Mentor</th><th className="px-2 py-3 text-[10px] uppercase tracking-widest text-stone-400 font-normal text-right">Elever</th><th className="px-2 py-3 text-[10px] uppercase tracking-widest text-stone-400 font-normal text-center">Risk</th><th className="px-2 py-3 text-[10px] uppercase tracking-widest text-stone-400 font-normal text-right">Närvaro</th><th className="pr-5 pl-2 py-3 text-[10px] uppercase tracking-widest text-stone-400 font-normal text-right">Mastery</th>
            </tr></thead><tbody>{visibleClasses.map(c=>{const s=cStats(c);return(
              <tr key={c.id} onClick={()=>openClass(c.id)} className="border-b border-stone-50 hover:bg-stone-50 cursor-pointer"><td className="px-5 py-3 font-medium text-stone-800">{c.name}</td><td className="px-2 py-3 text-stone-400">{c.mentor}</td><td className="px-2 py-3 text-right text-stone-600">{c.students.length}</td><td className="px-2 py-3 text-center">{s.r>0&&<span className="text-[10px] bg-red-50 text-red-600 px-1.5 py-0.5 rounded font-medium mr-1">{s.r}</span>}{s.y>0&&<span className="text-[10px] bg-amber-50 text-amber-600 px-1.5 py-0.5 rounded font-medium">{s.y}</span>}{s.r===0&&s.y===0&&<span className="text-xs text-emerald-500">●</span>}</td><td className={`px-2 py-3 text-right ${s.att<85?"text-amber-600":"text-stone-600"}`}>{s.att}%</td><td className="pr-5 pl-2 py-3 text-right text-stone-600">{s.mas}%</td></tr>
            )})}</tbody></table></div>
          </div>
        </>)}

        {/* ===== SIGNALER ===== */}
        {tab === "signals" && (<>
          <div className="pt-10 pb-6"><h1 className="text-3xl tracking-tight" style={{fontFamily:'var(--font-heading)'}}>Signaler</h1><p className="text-sm text-stone-400 mt-1">Automatiskt identifierade mönster</p></div>
          <div className="space-y-2 mb-10">{visibleSignals.sort((a,b)=>{const o:Record<RiskLevel,number>={red:0,yellow:1,green:2};return o[a.severity]-o[b.severity]}).map(s=>(
            <div key={s.id} className={`bg-white border rounded-lg p-5 flex items-start justify-between ${s.handled?"border-stone-100 opacity-60":"border-stone-200"}`}><div className="flex items-start gap-3"><Dot l={s.severity} /><div><p className="text-sm font-medium text-stone-800">{s.title}</p><p className="text-xs text-stone-400 mt-1">{s.description}</p><p className="text-[10px] text-stone-300 mt-2">{s.date}</p></div></div><div className="flex items-center gap-2 ml-4 shrink-0"><SigIcon t={s.type} />{!s.handled&&<button className="text-xs bg-stone-900 text-white px-3 py-1.5 rounded-md">Skapa insats</button>}</div></div>
          ))}</div>
        </>)}

        {/* ===== ÄRENDEN ===== */}
        {tab === "actions" && (<>
          <div className="pt-10 pb-6 flex justify-between items-end"><div><h1 className="text-3xl tracking-tight" style={{fontFamily:'var(--font-heading)'}}>Ärenden & insatser</h1><p className="text-sm text-stone-400 mt-1">{visibleActions.length} totalt · {overdueActions.length} försenade</p></div><button className="text-sm bg-stone-900 text-white px-4 py-2 rounded-lg hover:bg-black transition">Ny insats</button></div>
          <div className="space-y-2 mb-10">{visibleActions.sort((a,b)=>{const o:Record<ActionStatus,number>={overdue:0,active:1,planned:2,done:3};return o[a.status]-o[b.status]}).map(a=>{const cls=classes.find(c=>c.id===a.classId);return(
            <div key={a.id} className={`bg-white border rounded-lg p-5 flex items-center justify-between ${a.status==="overdue"?"border-red-200":"border-stone-200"}`}><div><div className="flex items-center gap-2 mb-1"><p className="text-sm font-medium text-stone-800">{a.title}</p><SBadge s={a.status} /><span className="text-[10px] bg-stone-100 text-stone-500 px-1.5 py-0.5 rounded">{a.category}</span></div><p className="text-xs text-stone-400">{a.student?`${a.student} · `:""}{cls?.name} · Ansvarig: {a.responsible} · {a.deadline}</p></div><div className="flex gap-2 ml-4">{a.status==="overdue"&&<button className="text-xs border border-stone-200 text-stone-600 px-3 py-1.5 rounded-md hover:bg-stone-50">Påminn</button>}{a.status!=="done"&&<button className="text-xs border border-stone-200 text-stone-600 px-3 py-1.5 rounded-md hover:bg-stone-50">Klar</button>}</div></div>
          )})}</div>
        </>)}

        {/* ===== PERSONALFRÅNVARO ===== */}
        {tab === "absence" && (<>
          <div className="pt-10 pb-6"><h1 className="text-3xl tracking-tight" style={{fontFamily:'var(--font-heading)'}}>Personalfrånvaro</h1><p className="text-sm text-stone-400 mt-1">Onsdag 14 maj 2026</p></div>
          {todaysAbsences.map(abs => {
            const lessons = affectedLessons.filter(l=>l.absenceId===abs.id)
            const unresolved = lessons.filter(l=>l.solution==="unresolved").length
            const solLabel: Record<LessonSolution,string> = { unresolved:"Olöst", substitute:"Vikarie", internal:"Intern ersättare", ai_work:"AI-uppgift", moved:"Flyttad", cancelled:"Inställd" }
            const solColor: Record<LessonSolution,string> = { unresolved:"bg-red-50 text-red-600", substitute:"bg-blue-50 text-blue-700", internal:"bg-blue-50 text-blue-700", ai_work:"bg-purple-50 text-purple-700", moved:"bg-amber-50 text-amber-700", cancelled:"bg-stone-100 text-stone-500" }
            return (
              <div key={abs.id} className="mb-8">
                <div className="bg-white border border-red-200 rounded-xl p-5 mb-4"><div className="flex items-center justify-between">
                  <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-full bg-red-50 text-red-600 text-sm font-medium flex items-center justify-center">{abs.teacher.split(" ").map(n=>n[0]).join("")}</div><div><p className="text-sm font-medium text-stone-800">{abs.teacher} <span className="ml-1 text-[10px] bg-red-50 text-red-600 px-1.5 py-0.5 rounded font-medium">Sjuk</span></p><p className="text-xs text-stone-400 mt-0.5">{abs.period} · Anmäld {abs.reportedAt}{abs.note&&` · ${abs.note}`}</p></div></div>
                  <div className="text-right"><p className="text-sm font-medium text-stone-800">{lessons.length} lektioner</p>{unresolved>0&&<p className="text-xs text-red-500">{unresolved} olösta</p>}</div>
                </div></div>

                <SL>Påverkade lektioner</SL>
                <div className="space-y-2">{lessons.map(lesson=>(
                  <div key={lesson.id} className={`bg-white border rounded-lg p-4 ${lesson.solution==="unresolved"?"border-red-200":"border-stone-200"}`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono text-stone-400 w-12">{lesson.time}</span>
                        <span className="text-sm font-medium text-stone-800">{lesson.subject}</span>
                        <span className="text-xs text-stone-400">{lesson.className} · {lesson.room}</span>
                        {lesson.critical&&<span className="text-[10px] bg-red-50 text-red-600 px-1.5 py-0.5 rounded font-medium">Kritisk</span>}
                        {lesson.lessonType!=="lektion"&&<span className="text-[10px] bg-stone-100 text-stone-500 px-1.5 py-0.5 rounded">{lesson.lessonType==="labb"?"Labb":lesson.lessonType==="prov"?"Prov":"Mentor"}</span>}
                      </div>
                      <span className={`text-[11px] font-medium px-2 py-0.5 rounded ${solColor[lesson.solution]}`}>{solLabel[lesson.solution]}</span>
                    </div>
                    {lesson.solutionDetail&&<p className="text-xs text-stone-500 ml-12">{lesson.solutionDetail}</p>}
                    {lesson.substituteNote&&<div className="ml-12 mt-2 p-3 bg-stone-50 rounded-lg border border-stone-100"><p className="text-[10px] uppercase tracking-widest text-stone-400 mb-1">Instruktioner till vikarie</p><p className="text-xs text-stone-600">{lesson.substituteNote}</p></div>}
                    <div className="flex items-center gap-3 mt-3 ml-12">
                      {lesson.studentMessageSent?<span className="text-[10px] text-emerald-600">✓ Elever informerade</span>:<button className="text-xs border border-stone-200 text-stone-600 px-3 py-1 rounded-md hover:bg-stone-50">Meddela elever</button>}
                      {lesson.solution==="unresolved"&&<button className="text-xs bg-stone-900 text-white px-3 py-1 rounded-md">Välj lösning</button>}
                    </div>
                  </div>
                ))}</div>
              </div>
            )
          })}
          {todaysAbsences.length===0&&<div className="bg-white border border-stone-200 rounded-xl p-12 text-center mb-10"><p className="text-sm text-stone-400">Ingen personalfrånvaro rapporterad idag.</p></div>}
        </>)}

        {/* ===== KOMMUNIKATION ===== */}
        {tab === "communication" && (<>
          <div className="pt-10 pb-6 flex justify-between items-end"><div><h1 className="text-3xl tracking-tight" style={{fontFamily:'var(--font-heading)'}}>Kommunikation</h1><p className="text-sm text-stone-400 mt-1">{visibleMessages.filter(m=>!m.read).length} olästa</p></div><button className="text-sm bg-stone-900 text-white px-4 py-2 rounded-lg hover:bg-black transition">Nytt meddelande</button></div>
          <div className="bg-white border border-stone-200 rounded-xl overflow-hidden mb-10">{visibleMessages.map((m,i)=>(
            <div key={m.id} className={`flex items-center justify-between px-5 py-4 hover:bg-stone-50 transition cursor-pointer ${i>0?"border-t border-stone-100":""} ${!m.read?"bg-blue-50/30":""}`}><div className="flex items-center gap-3 flex-1 min-w-0">{!m.read?<div className="w-1.5 h-1.5 bg-blue-500 rounded-full shrink-0" />:<div className="w-1.5 shrink-0" />}<div className="min-w-0"><p className="text-sm text-stone-800"><span className={!m.read?"font-medium":""}>{m.subject}</span></p><p className="text-xs text-stone-400 mt-0.5 truncate">{m.from} · {m.preview}</p></div></div><div className="flex items-center gap-2 ml-4"><span className="text-[10px] bg-stone-100 text-stone-500 px-1.5 py-0.5 rounded">{m.category}</span>{m.linkedClass&&<span className="text-[10px] bg-stone-100 text-stone-500 px-1.5 py-0.5 rounded">{m.linkedClass}</span>}<p className="text-xs text-stone-300">{m.date}</p></div></div>
          ))}</div>
        </>)}

{/* ===== SCHEMA ===== */}
        {tab === "schedule" && (<>
          <div className="pt-10 pb-6">
            <h1 className="text-3xl tracking-tight" style={{fontFamily:'var(--font-heading)'}}>Schemaläggning</h1>
            <p className="text-sm text-stone-400 mt-1">Grundschema · HT26</p>
          </div>
          <div className="mb-10">
            <ScheduleBuilder />
          </div>
        </>)}
        {tab === "classes" && (<>
          <div className="pt-10 pb-6"><h1 className="text-3xl tracking-tight" style={{fontFamily:'var(--font-heading)'}}>Klasser</h1><p className="text-sm text-stone-400 mt-1">{visibleClasses.length} klasser · {visibleClasses.reduce((a,c)=>a+c.students.length,0)} elever</p></div>
          <div className="bg-white border border-stone-200 rounded-xl overflow-hidden mb-10"><table className="w-full text-sm"><thead><tr className="border-b border-stone-200 bg-stone-50/50 text-left"><th className="px-5 py-3 text-[10px] uppercase tracking-widest text-stone-400 font-normal">Klass</th><th className="px-2 py-3 text-[10px] uppercase tracking-widest text-stone-400 font-normal">Program</th><th className="px-2 py-3 text-[10px] uppercase tracking-widest text-stone-400 font-normal">Mentor</th><th className="px-2 py-3 text-[10px] uppercase tracking-widest text-stone-400 font-normal text-right">Elever</th><th className="px-2 py-3 text-[10px] uppercase tracking-widest text-stone-400 font-normal text-center">Risk</th><th className="px-2 py-3 text-[10px] uppercase tracking-widest text-stone-400 font-normal text-right">Närvaro</th><th className="pr-5 pl-2 py-3 text-[10px] uppercase tracking-widest text-stone-400 font-normal text-right">Mastery</th></tr></thead><tbody>{visibleClasses.map(c=>{const s=cStats(c);return(
            <tr key={c.id} onClick={()=>openClass(c.id)} className="border-b border-stone-50 hover:bg-stone-50 cursor-pointer"><td className="px-5 py-3.5 font-medium text-stone-800">{c.name}</td><td className="px-2 py-3.5 text-stone-500">{c.program}</td><td className="px-2 py-3.5 text-stone-400">{c.mentor}</td><td className="px-2 py-3.5 text-right text-stone-600">{c.students.length}</td><td className="px-2 py-3.5 text-center">{s.r>0&&<span className="text-[10px] bg-red-50 text-red-600 px-1.5 py-0.5 rounded font-medium mr-1">{s.r}</span>}{s.y>0&&<span className="text-[10px] bg-amber-50 text-amber-600 px-1.5 py-0.5 rounded font-medium">{s.y}</span>}{s.r===0&&s.y===0&&<span className="text-xs text-emerald-500">●</span>}</td><td className={`px-2 py-3.5 text-right ${s.att<85?"text-amber-600":"text-stone-600"}`}>{s.att}%</td><td className="pr-5 pl-2 py-3.5 text-right text-stone-600">{s.mas}%</td></tr>
          )})}</tbody></table></div>
        </>)}

        {/* ===== KLASSDETALJ ===== */}
        {tab === "classDetail" && activeClass && (()=>{
          const s=cStats(activeClass); const cAct=actions.filter(a=>a.classId===activeClass.id); const cRep=reports.filter(r=>r.classId===activeClass.id)
          const sorted=[...activeClass.students].sort((a,b)=>{const o:Record<RiskLevel,number>={red:0,yellow:1,green:2};return o[a.risk]-o[b.risk]})
          return(<>
            <div className="pt-10 pb-6"><button onClick={()=>setTab("classes")} className="text-xs text-stone-400 hover:text-stone-600 mb-3 flex items-center gap-1"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>Tillbaka</button>
              <div className="flex items-center gap-4"><span className="text-sm font-mono bg-stone-800 text-white px-3 py-1.5 rounded">{activeClass.name}</span><div><h1 className="text-2xl tracking-tight" style={{fontFamily:'var(--font-heading)'}}>{activeClass.program}</h1><p className="text-sm text-stone-400">Mentor: {activeClass.mentor} · {activeClass.students.length} elever</p></div></div></div>
            <div className="grid grid-cols-4 gap-px bg-stone-200 border border-stone-200 rounded-xl overflow-hidden mb-8">
              <div className="p-4 bg-white"><p className="text-[10px] uppercase tracking-widest text-stone-400 mb-1">Närvaro</p><p className={`text-xl font-medium ${s.att<85?"text-amber-600":"text-stone-900"}`}>{s.att}%</p></div>
              <div className="p-4 bg-white"><p className="text-[10px] uppercase tracking-widest text-stone-400 mb-1">Mastery</p><p className="text-xl font-medium text-stone-900">{s.mas}%</p></div>
              <div className="p-4 bg-white"><p className="text-[10px] uppercase tracking-widest text-stone-400 mb-1">Risk</p><p className="text-xl font-medium"><span className={s.r>0?"text-red-600":"text-stone-300"}>{s.r} röd</span> <span className="text-stone-300">·</span> <span className="text-amber-500">{s.y} gul</span></p></div>
              <div className="p-4 bg-white"><p className="text-[10px] uppercase tracking-widest text-stone-400 mb-1">Insatser</p><p className="text-xl font-medium text-stone-900">{cAct.length}</p></div>
            </div>
            <div className="flex items-center justify-between mb-3"><SL>Elever</SL><select value={riskFilter} onChange={e=>setRiskFilter(e.target.value as any)} className="text-xs border border-stone-200 rounded px-2 py-1 bg-white text-stone-600"><option value="all">Alla</option><option value="red">Röd</option><option value="yellow">Gul</option><option value="green">Grön</option></select></div>
            <div className="bg-white border border-stone-200 rounded-xl overflow-hidden mb-8"><table className="w-full text-sm"><thead><tr className="border-b border-stone-200 bg-stone-50/50 text-left"><th className="pl-5 pr-2 py-3 w-6"></th><th className="px-2 py-3 text-[10px] uppercase tracking-widest text-stone-400 font-normal">Namn</th><th className="px-2 py-3 text-[10px] uppercase tracking-widest text-stone-400 font-normal text-right">Närvaro</th><th className="px-2 py-3 text-[10px] uppercase tracking-widest text-stone-400 font-normal text-right">Mastery</th><th className="px-2 py-3 text-[10px] uppercase tracking-widest text-stone-400 font-normal text-right">AI</th><th className="px-2 py-3 text-[10px] uppercase tracking-widest text-stone-400 font-normal">Anmärkning</th><th className="pr-5 py-3"></th></tr></thead>
            <tbody>{sorted.filter(st=>riskFilter==="all"||st.risk===riskFilter).map(st=>(
              <tr key={st.id} className="border-b border-stone-50 hover:bg-stone-50"><td className="pl-5 pr-2 py-3"><Dot l={st.risk} /></td><td className="px-2 py-3 font-medium text-stone-800">{st.name}</td><td className={`px-2 py-3 text-right ${st.attendance<80?"text-red-600 font-medium":"text-stone-600"}`}>{st.attendance}%</td><td className="px-2 py-3 text-right text-stone-600">{st.mastery}%</td><td className="px-2 py-3 text-right text-stone-400">{st.aiActivity}</td><td className="px-2 py-3 text-xs text-stone-400">{st.note||"—"}</td><td className="pr-5 py-3 text-right">{st.risk!=="green"&&<button className="text-xs text-stone-400 hover:text-stone-800">Insats</button>}</td></tr>
            ))}</tbody></table></div>
            {cAct.length>0&&<><SL>Insatser</SL><div className="space-y-2 mb-8">{cAct.map(a=><div key={a.id} className={`bg-white border rounded-lg p-4 flex items-center justify-between ${a.status==="overdue"?"border-red-200":"border-stone-200"}`}><div><div className="flex items-center gap-2"><p className="text-sm font-medium text-stone-800">{a.title}</p><SBadge s={a.status} /></div><p className="text-xs text-stone-400 mt-0.5">{a.student||""} · {a.responsible} · {a.deadline}</p></div></div>)}</div></>}
            {cRep.length>0&&<><SL>Mentorrapporter</SL><div className="space-y-2 mb-10">{cRep.map(r=><div key={r.id} className="bg-white border border-stone-200 rounded-lg p-4"><div className="flex items-center justify-between mb-2"><div className="flex items-center gap-2"><Dot l={r.risk} /><p className="text-sm font-medium text-stone-800">{r.type==="class"?"Klassrapport":r.studentName}</p>{!r.read&&<span className="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded">Ny</span>}</div><p className="text-xs text-stone-300">{r.date}</p></div><p className="text-xs text-stone-500 leading-relaxed">{r.summary}</p></div>)}</div></>}
          </>)
        })()}

        {/* ===== PERSONAL ===== */}
        {tab === "teachers" && (<>
          <div className="pt-10 pb-6"><h1 className="text-3xl tracking-tight" style={{fontFamily:'var(--font-heading)'}}>Personal</h1></div>
          <div className="space-y-2 mb-10">{[
            {name:"Maria Lindström",subjects:"Matematik",cls:["NA26a","NA26b","SA26a"],hours:22,mentoring:"NA26a",sick:false},
            {name:"Per Ekström",subjects:"Fysik, Matematik",cls:["NA26b","TE26"],hours:20,mentoring:"NA26b",sick:false},
            {name:"Erik Johansson",subjects:"Teknik, Matematik",cls:["TE26","EK26"],hours:24,mentoring:"TE26",sick:true},
            {name:"Anna Karlsson",subjects:"Samhällskunskap",cls:["SA26a","SA26b"],hours:18,mentoring:"SA26a",sick:false},
            {name:"Karin Holm",subjects:"Historia, Svenska",cls:["SA26b","NA26a"],hours:20,mentoring:"SA26b",sick:false},
            {name:"Johan Berg",subjects:"Företagsekonomi",cls:["EK26"],hours:16,mentoring:"EK26",sick:false},
          ].map(t=>(<div key={t.name} className={`bg-white border rounded-lg p-5 flex items-center justify-between hover:border-stone-300 transition ${t.sick?"border-red-200":"border-stone-200"}`}><div className="flex items-center gap-4"><div className="w-9 h-9 rounded-full bg-stone-100 text-stone-600 text-xs font-medium flex items-center justify-center">{t.name.split(" ").map(n=>n[0]).join("")}</div><div><p className="text-sm font-medium text-stone-800">{t.name} {t.sick&&<span className="text-[10px] bg-red-50 text-red-600 px-1.5 py-0.5 rounded font-medium ml-2">Sjuk</span>}</p><p className="text-xs text-stone-400 mt-0.5">{t.subjects} · Mentor: {t.mentoring}</p></div></div><div className="flex items-center gap-6 text-right"><div><p className="text-xs text-stone-400">Klasser</p><p className="text-sm text-stone-600">{t.cls.join(", ")}</p></div><div><p className="text-xs text-stone-400">Tim/v</p><p className={`text-sm ${t.hours>22?"text-amber-600 font-medium":"text-stone-600"}`}>{t.hours}</p></div></div></div>))}</div>
        </>)}

        {/* ===== RAPPORTER ===== */}
        {tab === "reports" && (<>
          <div className="pt-10 pb-6"><h1 className="text-3xl tracking-tight" style={{fontFamily:'var(--font-heading)'}}>Rapporter</h1></div>
          <div className="space-y-3 mb-10">{reports.map(r=>(<div key={r.id} className={`bg-white border rounded-xl overflow-hidden ${r.read?"border-stone-100":"border-stone-300"}`}><div className="p-5"><div className="flex items-center justify-between mb-2"><div className="flex items-center gap-2"><Dot l={r.risk} /><span className="text-[11px] font-mono bg-stone-100 text-stone-600 px-1.5 py-0.5 rounded">{classes.find(c=>c.id===r.classId)?.name}</span><p className="text-sm font-medium text-stone-800">{r.type==="class"?"Klassrapport":r.studentName}</p>{!r.read&&<span className="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded">Ny</span>}</div><p className="text-xs text-stone-300">{r.date} · {r.mentor}</p></div><p className="text-sm text-stone-600 leading-relaxed mb-2">{r.summary}</p><p className="text-xs text-stone-400">Uppföljning: <span className="text-stone-600 font-medium">{r.followUp}</span></p></div>{r.actions.length>0&&<div className="border-t border-stone-100 px-5 py-3 bg-stone-50/50"><p className="text-[10px] uppercase tracking-widest text-stone-400 mb-1">Åtgärder</p>{r.actions.map((a,i)=><p key={i} className="text-xs text-stone-600 py-0.5">→ {a}</p>)}</div>}</div>))}</div>
        </>)}

        {/* ===== ANVÄNDARE ===== */}
        {tab === "users" && (<>
          <div className="pt-10 pb-6"><h1 className="text-3xl tracking-tight" style={{fontFamily:'var(--font-heading)'}}>Användare</h1></div>
          {pending.length>0&&<div className="mb-8"><SL>Väntande</SL><div className="space-y-2">{pending.map(u=>(<div key={u.id} className="bg-white border border-stone-200 rounded-lg p-4 flex items-center justify-between"><div className="flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-stone-100 text-stone-500 text-[10px] font-medium flex items-center justify-center">{u.full_name.split(" ").map(n=>n[0]).join("").slice(0,2)}</div><div><p className="text-sm font-medium text-stone-800">{u.full_name}</p><p className="text-xs text-stone-400">{u.role==="teacher"?"Lärare":"Elev"}</p></div></div><button onClick={()=>approveUser(u.id)} className="text-xs bg-stone-900 text-white px-4 py-1.5 rounded-md">Godkänn</button></div>))}</div></div>}
          <SL>Aktiva</SL><div className="bg-white border border-stone-200 rounded-xl overflow-hidden mb-10"><table className="w-full text-sm"><thead><tr className="border-b border-stone-100 bg-stone-50/50"><th className="px-5 py-3 text-[10px] uppercase tracking-widest text-stone-400 font-normal text-left">Namn</th><th className="px-2 py-3 text-[10px] uppercase tracking-widest text-stone-400 font-normal text-left">Roll</th><th className="px-2 py-3 text-[10px] uppercase tracking-widest text-stone-400 font-normal text-left">Registrerad</th></tr></thead><tbody>{users.filter(u=>u.is_approved).map(u=><tr key={u.id} className="border-b border-stone-50 hover:bg-stone-50"><td className="px-5 py-3 font-medium text-stone-800">{u.full_name}</td><td className="px-2 py-3 text-stone-500">{u.role==="admin"?"Admin":u.role==="teacher"?"Lärare":"Elev"}</td><td className="px-2 py-3 text-stone-400">{new Date(u.created_at).toLocaleDateString("sv-SE")}</td></tr>)}</tbody></table></div>
        </>)}

        {/* ===== ÄMNEN ===== */}
        {tab === "subjects" && (<>
          <div className="pt-10 pb-6 flex justify-between items-end"><h1 className="text-3xl tracking-tight" style={{fontFamily:'var(--font-heading)'}}>Ämnen & kurser</h1><button className="text-sm bg-stone-900 text-white px-4 py-2 rounded-lg">Lägg till</button></div>
          <div className="space-y-3 mb-10">{[{s:"Matematik",c:["Matematik 1c","Matematik 2b","Matematik 3c"]},{s:"Svenska",c:["Svenska 1","Svenska 2","Svenska 3"]},{s:"Engelska",c:["Engelska 5","Engelska 6"]},{s:"Fysik",c:["Fysik 1","Fysik 2"]},{s:"Samhällskunskap",c:["Samhällskunskap 1b","Samhällskunskap 2"]},{s:"Historia",c:["Historia 1b","Historia 2a"]},{s:"Företagsekonomi",c:["Företagsekonomi 1","Företagsekonomi 2"]},{s:"Teknik",c:["Teknik 1","Konstruktion 1"]}].map(x=><div key={x.s} className="bg-white border border-stone-200 rounded-lg px-5 py-4"><p className="text-sm font-medium text-stone-800 mb-2">{x.s}</p><div className="flex gap-2 flex-wrap">{x.c.map(c=><span key={c} className="text-xs bg-stone-50 border border-stone-200 text-stone-600 px-2.5 py-1 rounded-md">{c}</span>)}</div></div>)}</div>
        </>)}

      </div></main>
    </div>
  )
}
