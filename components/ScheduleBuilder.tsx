"use client"
import { useState, useMemo } from "react"

// ============================================
// TYPER
// ============================================
type ViewMode = "class" | "teacher"
type Period = { id: string; name: string; active: boolean }
type Room = string
type LessonType = "lesson" | "lab" | "mentor" | "support" | "meeting" | "planning"

type Lesson = {
  id: string
  day: number        // 0=mån, 4=fre
  slot: number       // 0=första passet
  classId: string
  subject: string
  teacherId: string
  room: string
  type: LessonType
  temporary?: boolean  // tillfällig ändring
  note?: string
}

type Teacher = { id: string; name: string; subjects: string[]; initials: string }
type SchoolClass = { id: string; name: string; program: string }

// ============================================
// DATA
// ============================================
const periods: Period[] = [
  { id: "ht26-p1", name: "HT26 — Period 1", active: true },
  { id: "ht26-p2", name: "HT26 — Period 2", active: false },
  { id: "vt27-p1", name: "VT27 — Period 1", active: false },
]

const timeSlots = [
  { id: 0, time: "08:15–09:15", label: "08:15" },
  { id: 1, time: "09:30–10:30", label: "09:30" },
  { id: 2, time: "10:45–11:45", label: "10:45" },
  { id: 3, time: "12:30–13:30", label: "12:30" },
  { id: 4, time: "13:45–14:45", label: "13:45" },
  { id: 5, time: "15:00–16:00", label: "15:00" },
]

const days = ["Måndag", "Tisdag", "Onsdag", "Torsdag", "Fredag"]
const daysShort = ["Mån", "Tis", "Ons", "Tors", "Fre"]

const teachers: Teacher[] = [
  { id: "t1", name: "Maria Lindström", subjects: ["Matematik"], initials: "ML" },
  { id: "t2", name: "Per Ekström", subjects: ["Fysik", "Matematik"], initials: "PE" },
  { id: "t3", name: "Erik Johansson", subjects: ["Teknik", "Matematik"], initials: "EJ" },
  { id: "t4", name: "Anna Karlsson", subjects: ["Samhällskunskap"], initials: "AK" },
  { id: "t5", name: "Karin Holm", subjects: ["Historia", "Svenska"], initials: "KH" },
  { id: "t6", name: "Johan Berg", subjects: ["Företagsekonomi"], initials: "JB" },
  { id: "t7", name: "Lisa Hedström", subjects: ["Specialpedagog"], initials: "LH" },
]

const schoolClasses: SchoolClass[] = [
  { id: "na26a", name: "NA26a", program: "Naturvetenskap" },
  { id: "na26b", name: "NA26b", program: "Naturvetenskap" },
  { id: "te26", name: "TE26", program: "Teknik" },
  { id: "sa26a", name: "SA26a", program: "Samhällsvetenskap" },
  { id: "sa26b", name: "SA26b", program: "Samhällsvetenskap" },
  { id: "ek26", name: "EK26", program: "Ekonomi" },
]

const rooms = ["R201", "R202", "R203", "R305", "R108", "R102", "R112", "Labbsal A", "Labbsal B", "Idrottshall", "Aula"]

const subjects = ["Matematik 1c", "Matematik 2b", "Matematik 3c", "Svenska 1", "Svenska 2", "Engelska 5", "Engelska 6", "Fysik 1", "Fysik 2", "Samhällskunskap 1b", "Historia 1b", "Företagsekonomi 1", "Teknik 1", "Konstruktion 1", "Mentorstid", "Stödtimme"]

// Startschema
const initialLessons: Lesson[] = [
  // NA26a — Måndag
  { id:"l1", day:0, slot:0, classId:"na26a", subject:"Matematik 2b", teacherId:"t1", room:"R201", type:"lesson" },
  { id:"l2", day:0, slot:1, classId:"na26a", subject:"Matematik 2b", teacherId:"t1", room:"R201", type:"lesson" },
  { id:"l3", day:0, slot:3, classId:"na26a", subject:"Engelska 5", teacherId:"t5", room:"R108", type:"lesson" },
  { id:"l4", day:0, slot:4, classId:"na26a", subject:"Mentorstid", teacherId:"t1", room:"R201", type:"mentor" },
  // NA26a — Tisdag
  { id:"l5", day:1, slot:0, classId:"na26a", subject:"Fysik 1", teacherId:"t2", room:"Labbsal A", type:"lab" },
  { id:"l6", day:1, slot:1, classId:"na26a", subject:"Fysik 1", teacherId:"t2", room:"Labbsal A", type:"lab" },
  { id:"l7", day:1, slot:3, classId:"na26a", subject:"Svenska 1", teacherId:"t5", room:"R102", type:"lesson" },
  // NA26a — Onsdag
  { id:"l8", day:2, slot:0, classId:"na26a", subject:"Historia 1b", teacherId:"t5", room:"R102", type:"lesson" },
  { id:"l9", day:2, slot:2, classId:"na26a", subject:"Matematik 2b", teacherId:"t1", room:"R201", type:"lesson" },
  // NA26a — Torsdag
  { id:"l10", day:3, slot:0, classId:"na26a", subject:"Engelska 5", teacherId:"t5", room:"R108", type:"lesson" },
  { id:"l11", day:3, slot:1, classId:"na26a", subject:"Samhällskunskap 1b", teacherId:"t4", room:"R112", type:"lesson" },
  // NA26a — Fredag
  { id:"l12", day:4, slot:0, classId:"na26a", subject:"Matematik 2b", teacherId:"t1", room:"R201", type:"lesson" },
  { id:"l13", day:4, slot:1, classId:"na26a", subject:"Svenska 1", teacherId:"t5", room:"R102", type:"lesson" },

  // TE26
  { id:"l20", day:0, slot:0, classId:"te26", subject:"Teknik 1", teacherId:"t3", room:"R305", type:"lesson" },
  { id:"l21", day:0, slot:1, classId:"te26", subject:"Teknik 1", teacherId:"t3", room:"R305", type:"lesson" },
  { id:"l22", day:1, slot:2, classId:"te26", subject:"Matematik 2b", teacherId:"t3", room:"R201", type:"lesson" },
  { id:"l23", day:1, slot:3, classId:"te26", subject:"Fysik 1", teacherId:"t2", room:"Labbsal B", type:"lab" },
  { id:"l24", day:2, slot:0, classId:"te26", subject:"Svenska 1", teacherId:"t5", room:"R102", type:"lesson" },
  { id:"l25", day:3, slot:0, classId:"te26", subject:"Matematik 2b", teacherId:"t3", room:"R201", type:"lesson" },
  { id:"l26", day:3, slot:3, classId:"te26", subject:"Mentorstid", teacherId:"t3", room:"R305", type:"mentor" },
  { id:"l27", day:4, slot:1, classId:"te26", subject:"Fysik 1", teacherId:"t2", room:"R305", type:"lesson" },

  // EK26
  { id:"l30", day:0, slot:2, classId:"ek26", subject:"Företagsekonomi 1", teacherId:"t6", room:"R203", type:"lesson" },
  { id:"l31", day:0, slot:3, classId:"ek26", subject:"Företagsekonomi 1", teacherId:"t6", room:"R203", type:"lesson" },
  { id:"l32", day:2, slot:1, classId:"ek26", subject:"Matematik 2b", teacherId:"t3", room:"R201", type:"lesson" },
  { id:"l33", day:3, slot:2, classId:"ek26", subject:"Engelska 5", teacherId:"t5", room:"R108", type:"lesson" },
  { id:"l34", day:4, slot:0, classId:"ek26", subject:"Mentorstid", teacherId:"t6", room:"R203", type:"mentor" },
  { id:"l35", day:4, slot:3, classId:"ek26", subject:"Svenska 1", teacherId:"t5", room:"R102", type:"lesson" },

  // SA26a
  { id:"l40", day:0, slot:0, classId:"sa26a", subject:"Samhällskunskap 1b", teacherId:"t4", room:"R112", type:"lesson" },
  { id:"l41", day:1, slot:0, classId:"sa26a", subject:"Svenska 1", teacherId:"t5", room:"R102", type:"lesson" },
  { id:"l42", day:2, slot:3, classId:"sa26a", subject:"Mentorstid", teacherId:"t4", room:"R112", type:"mentor" },
  { id:"l43", day:3, slot:3, classId:"sa26a", subject:"Matematik 2b", teacherId:"t1", room:"R201", type:"lesson" },
  { id:"l44", day:4, slot:2, classId:"sa26a", subject:"Historia 1b", teacherId:"t5", room:"R102", type:"lesson" },

  // Stöd
  { id:"l50", day:2, slot:4, classId:"na26a", subject:"Stödtimme", teacherId:"t7", room:"R202", type:"support", note:"Matematik — fokus pq-formeln" },
  { id:"l51", day:3, slot:4, classId:"sa26a", subject:"Stödtimme", teacherId:"t7", room:"R202", type:"support", note:"Matematik — grundläggande algebra" },
]

// ============================================
// FÄRGER
// ============================================
const typeColors: Record<LessonType, { bg: string; text: string; border: string }> = {
  lesson:   { bg: "bg-stone-800", text: "text-white", border: "border-stone-800" },
  lab:      { bg: "bg-indigo-600", text: "text-white", border: "border-indigo-600" },
  mentor:   { bg: "bg-stone-200", text: "text-stone-700", border: "border-stone-300" },
  support:  { bg: "bg-amber-50", text: "text-amber-800", border: "border-amber-200" },
  meeting:  { bg: "bg-stone-100", text: "text-stone-600", border: "border-stone-200" },
  planning: { bg: "bg-stone-100", text: "text-stone-600", border: "border-stone-200" },
}

// ============================================
// KOMPONENT
// ============================================
export default function ScheduleBuilder() {
  const [lessons, setLessons] = useState<Lesson[]>(initialLessons)
  const [viewMode, setViewMode] = useState<ViewMode>("class")
  const [selectedId, setSelectedId] = useState<string>(schoolClasses[0].id)
  const [activePeriod, setActivePeriod] = useState(periods[0].id)
  const [showModal, setShowModal] = useState(false)
  const [editSlot, setEditSlot] = useState<{ day: number; slot: number } | null>(null)
  const [editLesson, setEditLesson] = useState<Lesson | null>(null)

  // Form state
  const [formSubject, setFormSubject] = useState("")
  const [formTeacher, setFormTeacher] = useState("")
  const [formRoom, setFormRoom] = useState("")
  const [formType, setFormType] = useState<LessonType>("lesson")
  const [formNote, setFormNote] = useState("")

  // Filtrera lektioner
  const filtered = useMemo(() => {
    if (viewMode === "class") return lessons.filter(l => l.classId === selectedId)
    return lessons.filter(l => l.teacherId === selectedId)
  }, [lessons, viewMode, selectedId])

  // Konfliktkontroll
  const conflicts = useMemo(() => {
    const c: Set<string> = new Set()
    for (let i = 0; i < lessons.length; i++) {
      for (let j = i + 1; j < lessons.length; j++) {
        const a = lessons[i], b = lessons[j]
        if (a.day === b.day && a.slot === b.slot) {
          if (a.teacherId === b.teacherId) { c.add(a.id); c.add(b.id) }
          if (a.room === b.room) { c.add(a.id); c.add(b.id) }
        }
      }
    }
    return c
  }, [lessons])

  // Statistik
  const teacherHours = useMemo(() => {
    const map = new Map<string, number>()
    lessons.forEach(l => map.set(l.teacherId, (map.get(l.teacherId) || 0) + 1))
    return map
  }, [lessons])

  function getLesson(day: number, slot: number): Lesson | undefined {
    return filtered.find(l => l.day === day && l.slot === slot)
  }

  function openCreate(day: number, slot: number) {
    setEditSlot({ day, slot })
    setEditLesson(null)
    setFormSubject("")
    setFormTeacher("")
    setFormRoom("")
    setFormType("lesson")
    setFormNote("")
    setShowModal(true)
  }

  function openEdit(lesson: Lesson) {
    setEditSlot({ day: lesson.day, slot: lesson.slot })
    setEditLesson(lesson)
    setFormSubject(lesson.subject)
    setFormTeacher(lesson.teacherId)
    setFormRoom(lesson.room)
    setFormType(lesson.type)
    setFormNote(lesson.note || "")
    setShowModal(true)
  }

  function saveLesson() {
    if (!editSlot || !formSubject || !formTeacher || !formRoom) return
    if (editLesson) {
      setLessons(prev => prev.map(l => l.id === editLesson.id ? { ...l, subject: formSubject, teacherId: formTeacher, room: formRoom, type: formType, note: formNote || undefined } : l))
    } else {
      const newLesson: Lesson = { id: `l-${Date.now()}`, day: editSlot.day, slot: editSlot.slot, classId: viewMode === "class" ? selectedId : "", subject: formSubject, teacherId: viewMode === "teacher" ? selectedId : formTeacher, room: formRoom, type: formType, note: formNote || undefined }
      if (viewMode === "teacher") newLesson.classId = schoolClasses[0].id
      setLessons(prev => [...prev, newLesson])
    }
    setShowModal(false)
  }

  function deleteLesson() {
    if (!editLesson) return
    setLessons(prev => prev.filter(l => l.id !== editLesson.id))
    setShowModal(false)
  }

  const selectedLabel = viewMode === "class"
    ? schoolClasses.find(c => c.id === selectedId)?.name
    : teachers.find(t => t.id === selectedId)?.name

  return (
    <div className="h-full flex flex-col">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          {/* Vy-toggle */}
          <div className="flex bg-stone-100 rounded-lg p-0.5">
            <button onClick={() => { setViewMode("class"); setSelectedId(schoolClasses[0].id) }}
              className={`text-xs px-3 py-1.5 rounded-md transition ${viewMode === "class" ? "bg-white text-stone-800 shadow-sm font-medium" : "text-stone-500"}`}>
              Klasschema
            </button>
            <button onClick={() => { setViewMode("teacher"); setSelectedId(teachers[0].id) }}
              className={`text-xs px-3 py-1.5 rounded-md transition ${viewMode === "teacher" ? "bg-white text-stone-800 shadow-sm font-medium" : "text-stone-500"}`}>
              Lärarschema
            </button>
          </div>

          {/* Välj klass/lärare */}
          <select value={selectedId} onChange={e => setSelectedId(e.target.value)}
            className="text-sm border border-stone-200 rounded-lg px-3 py-1.5 bg-white text-stone-700">
            {viewMode === "class"
              ? schoolClasses.map(c => <option key={c.id} value={c.id}>{c.name} — {c.program}</option>)
              : teachers.map(t => <option key={t.id} value={t.id}>{t.name} — {t.subjects.join(", ")}</option>)
            }
          </select>

          {/* Period */}
          <select value={activePeriod} onChange={e => setActivePeriod(e.target.value)}
            className="text-sm border border-stone-200 rounded-lg px-3 py-1.5 bg-white text-stone-700">
            {periods.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>

        {/* Konflikter */}
        {conflicts.size > 0 && (
          <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 border border-red-100 px-3 py-1.5 rounded-lg">
            <div className="w-2 h-2 bg-red-500 rounded-full" />
            {conflicts.size} konflikter i schemat
          </div>
        )}
      </div>

      {/* SCHEMA-GRID */}
      <div className="flex-1 bg-white border border-stone-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm table-fixed">
          <thead>
            <tr className="border-b border-stone-200 bg-stone-50/50">
              <th className="w-16 px-3 py-3 text-[10px] uppercase tracking-widest text-stone-400 font-normal text-left">Tid</th>
              {daysShort.map(d => (
                <th key={d} className="px-2 py-3 text-[10px] uppercase tracking-widest text-stone-400 font-normal text-left">{d}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {timeSlots.map(slot => (
              <tr key={slot.id} className="border-b border-stone-50">
                <td className="px-3 py-1 text-xs font-mono text-stone-400 align-top pt-3">{slot.label}</td>
                {days.map((_, dayIdx) => {
                  const lesson = getLesson(dayIdx, slot.id)
                  const hasConflict = lesson && conflicts.has(lesson.id)
                  const colors = lesson ? typeColors[lesson.type] : null
                  const teacher = lesson ? teachers.find(t => t.id === lesson.teacherId) : null
                  const cls = lesson ? schoolClasses.find(c => c.id === lesson.classId) : null

                  return (
                    <td key={dayIdx} className="px-1 py-1 align-top" style={{ height: 64 }}>
                      {lesson ? (
                        <button onClick={() => openEdit(lesson)}
                          className={`w-full text-left px-2.5 py-2 rounded-lg border transition hover:opacity-90 ${colors!.bg} ${colors!.text} ${hasConflict ? "ring-2 ring-red-500 ring-offset-1" : ""} ${lesson.temporary ? "border-dashed" : colors!.border}`}>
                          <p className="text-xs font-medium truncate">{lesson.subject}</p>
                          <p className="text-[10px] opacity-75 truncate mt-0.5">
                            {viewMode === "class" ? teacher?.initials : cls?.name} · {lesson.room}
                          </p>
                          {lesson.note && <p className="text-[10px] opacity-60 truncate mt-0.5">{lesson.note}</p>}
                          {hasConflict && <p className="text-[10px] mt-0.5 font-medium text-red-200">⚠ Konflikt</p>}
                        </button>
                      ) : (
                        <button onClick={() => openCreate(dayIdx, slot.id)}
                          className="w-full h-full min-h-[48px] rounded-lg border border-dashed border-stone-200 hover:border-stone-400 hover:bg-stone-50 transition flex items-center justify-center">
                          <span className="text-stone-300 text-lg">+</span>
                        </button>
                      )}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* LEGEND + STATS */}
      <div className="flex items-center justify-between mt-4">
        <div className="flex gap-3">
          {(["lesson", "lab", "mentor", "support"] as LessonType[]).map(t => (
            <span key={t} className="flex items-center gap-1.5 text-[10px] text-stone-500">
              <div className={`w-3 h-2 rounded-sm ${typeColors[t].bg}`} />
              {t === "lesson" ? "Lektion" : t === "lab" ? "Labb" : t === "mentor" ? "Mentor" : "Stöd"}
            </span>
          ))}
        </div>
        {viewMode === "teacher" && (
          <p className="text-xs text-stone-400">
            {selectedLabel}: <span className="font-medium text-stone-600">{teacherHours.get(selectedId) || 0} pass/vecka</span>
            {(teacherHours.get(selectedId) || 0) > 20 && <span className="text-amber-600 ml-1"> (hög belastning)</span>}
          </p>
        )}
        {viewMode === "class" && (
          <p className="text-xs text-stone-400">{filtered.length} pass/vecka</p>
        )}
      </div>

      {/* Lärarbelastning */}
      {viewMode === "class" && (
        <div className="mt-6 mb-4">
          <p className="text-[10px] uppercase tracking-[0.15em] text-stone-400 mb-2 font-medium">Lärarbelastning (alla klasser)</p>
          <div className="flex gap-2 flex-wrap">
            {teachers.filter(t => t.id !== "t7").map(t => {
              const h = teacherHours.get(t.id) || 0
              return (
                <button key={t.id} onClick={() => { setViewMode("teacher"); setSelectedId(t.id) }}
                  className="bg-white border border-stone-200 rounded-lg px-3 py-2 text-left hover:border-stone-300 transition">
                  <p className="text-xs font-medium text-stone-700">{t.name}</p>
                  <p className={`text-[11px] ${h > 20 ? "text-amber-600 font-medium" : "text-stone-400"}`}>{h} pass/v</p>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* MODAL — Skapa/Redigera lektion */}
      {showModal && editSlot && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-xl border border-stone-200 shadow-xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
                {editLesson ? "Redigera lektion" : "Ny lektion"}
              </h3>
              <p className="text-xs text-stone-400">{daysShort[editSlot.day]} {timeSlots[editSlot.slot].time}</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[11px] uppercase tracking-widest text-stone-400 mb-1">Ämne / kurs</label>
                <select value={formSubject} onChange={e => setFormSubject(e.target.value)}
                  className="w-full text-sm border border-stone-200 rounded-lg px-3 py-2 bg-white">
                  <option value="">Välj ämne...</option>
                  {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-widest text-stone-400 mb-1">Lärare</label>
                <select value={formTeacher} onChange={e => setFormTeacher(e.target.value)}
                  className="w-full text-sm border border-stone-200 rounded-lg px-3 py-2 bg-white">
                  <option value="">Välj lärare...</option>
                  {teachers.map(t => <option key={t.id} value={t.id}>{t.name} — {t.subjects.join(", ")}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] uppercase tracking-widest text-stone-400 mb-1">Sal</label>
                  <select value={formRoom} onChange={e => setFormRoom(e.target.value)}
                    className="w-full text-sm border border-stone-200 rounded-lg px-3 py-2 bg-white">
                    <option value="">Välj sal...</option>
                    {rooms.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-widest text-stone-400 mb-1">Typ</label>
                  <select value={formType} onChange={e => setFormType(e.target.value as LessonType)}
                    className="w-full text-sm border border-stone-200 rounded-lg px-3 py-2 bg-white">
                    <option value="lesson">Lektion</option>
                    <option value="lab">Labb</option>
                    <option value="mentor">Mentorstid</option>
                    <option value="support">Stödtimme</option>
                    <option value="meeting">Möte</option>
                    <option value="planning">Planering</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-widest text-stone-400 mb-1">Anteckning (valfri)</label>
                <input type="text" value={formNote} onChange={e => setFormNote(e.target.value)} placeholder="T.ex. fokus på pq-formeln"
                  className="w-full text-sm border border-stone-200 rounded-lg px-3 py-2" />
              </div>

              {/* Konfliktvarning */}
              {formTeacher && editSlot && (() => {
                const conflicting = lessons.find(l =>
                  l.day === editSlot.day && l.slot === editSlot.slot &&
                  (l.teacherId === formTeacher || l.room === formRoom) &&
                  l.id !== editLesson?.id
                )
                if (!conflicting) return null
                const t = teachers.find(t => t.id === conflicting.teacherId)
                return (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
                    Konflikt: {t?.name} undervisar redan {conflicting.subject} i {conflicting.room} vid denna tid.
                  </div>
                )
              })()}
            </div>

            <div className="flex items-center justify-between mt-6">
              <div>
                {editLesson && (
                  <button onClick={deleteLesson} className="text-xs text-red-500 hover:text-red-700 transition">
                    Ta bort lektion
                  </button>
                )}
              </div>
              <div className="flex gap-2">
                <button onClick={() => setShowModal(false)} className="text-sm border border-stone-200 text-stone-600 px-4 py-2 rounded-lg hover:bg-stone-50 transition">
                  Avbryt
                </button>
                <button onClick={saveLesson} disabled={!formSubject || !formTeacher || !formRoom}
                  className="text-sm bg-stone-900 text-white px-4 py-2 rounded-lg hover:bg-black transition disabled:opacity-40">
                  {editLesson ? "Spara" : "Lägg till"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
