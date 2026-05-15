"use client"

import { useState } from "react"

type CalendarEvent = {
  id: string
  title: string
  courseCode: string
  type: "lesson" | "lab" | "mentor" | "test" | "assignment" | "presentation"
  day: number
  startTime: string
  endTime?: string
  room?: string
  teacher?: string
}

const lessons: CalendarEvent[] = [
  { id: "l1", title: "Matematik 2b", courseCode: "MA2B", type: "lesson", day: 0, startTime: "08:15", endTime: "09:15", room: "R201", teacher: "Maria Lindström" },
  { id: "l2", title: "Matematik 2b", courseCode: "MA2B", type: "lesson", day: 0, startTime: "09:30", endTime: "10:30", room: "R201", teacher: "Maria Lindström" },
  { id: "l3", title: "Engelska 5", courseCode: "EN5", type: "lesson", day: 0, startTime: "13:00", endTime: "14:00", room: "R108", teacher: "Karin Holm" },
  { id: "l4", title: "Mentorstid", courseCode: "", type: "mentor", day: 0, startTime: "14:15", endTime: "15:00", room: "R201", teacher: "Maria Lindström" },

  { id: "l5", title: "Fysik 1", courseCode: "FY1", type: "lab", day: 1, startTime: "08:15", endTime: "09:15", room: "Labbsal A", teacher: "Per Ekström" },
  { id: "l6", title: "Fysik 1", courseCode: "FY1", type: "lab", day: 1, startTime: "09:30", endTime: "10:30", room: "Labbsal A", teacher: "Per Ekström" },
  { id: "l7", title: "Svenska 1", courseCode: "SV1", type: "lesson", day: 1, startTime: "13:00", endTime: "14:00", room: "R102", teacher: "Karin Holm" },

  { id: "l8", title: "Historia 1b", courseCode: "HI1B", type: "lesson", day: 2, startTime: "08:15", endTime: "09:15", room: "R102", teacher: "Karin Holm" },
  { id: "l9", title: "Matematik 2b", courseCode: "MA2B", type: "lesson", day: 2, startTime: "09:30", endTime: "10:30", room: "R201", teacher: "Maria Lindström" },
  { id: "l10", title: "Samhällskunskap 1b", courseCode: "SH1B", type: "lesson", day: 2, startTime: "13:00", endTime: "14:00", room: "R112", teacher: "Anna Karlsson" },

  { id: "l11", title: "Engelska 5", courseCode: "EN5", type: "lesson", day: 3, startTime: "08:15", endTime: "09:15", room: "R108", teacher: "Karin Holm" },
  { id: "l12", title: "Samhällskunskap 1b", courseCode: "SH1B", type: "lesson", day: 3, startTime: "09:30", endTime: "10:30", room: "R112", teacher: "Anna Karlsson" },
  { id: "l13", title: "Svenska 1", courseCode: "SV1", type: "lesson", day: 3, startTime: "13:00", endTime: "14:00", room: "R102", teacher: "Karin Holm" },

  { id: "l14", title: "Matematik 2b", courseCode: "MA2B", type: "lesson", day: 4, startTime: "08:15", endTime: "09:15", room: "R201", teacher: "Maria Lindström" },
  { id: "l15", title: "Svenska 1", courseCode: "SV1", type: "lesson", day: 4, startTime: "09:30", endTime: "10:30", room: "R102", teacher: "Karin Holm" },
  { id: "l16", title: "Historia 1b", courseCode: "HI1B", type: "lesson", day: 4, startTime: "13:00", endTime: "14:00", room: "R102", teacher: "Karin Holm" },
]

const todos: CalendarEvent[] = [
  { id: "t1", title: "Övningsuppgifter", courseCode: "MA2B", type: "assignment", day: 3, startTime: "" },
  { id: "t2", title: "Läs kapitel 8", courseCode: "FY1", type: "assignment", day: 4, startTime: "" },
]

const timeSlots = [
  { time: "08:15", label: "08:15" },
  { time: "09:30", label: "09:30" },
  { time: "10:30", label: "10:30", isBreak: true, breakLabel: "Lunch" },
  { time: "13:00", label: "13:00" },
  { time: "14:15", label: "14:15" },
]

const daysShort = ["Mån", "Tis", "Ons", "Tors", "Fre"]
const dates = ["12 maj", "13 maj", "14 maj", "15 maj", "16 maj"]
const today = 2

const typeStyles: Record<string, { bg: string; border: string; text: string }> = {
  lesson:       { bg: "bg-stone-50",    border: "border-stone-300",  text: "text-stone-700" },
  lab:          { bg: "bg-indigo-50",   border: "border-indigo-300", text: "text-indigo-700" },
  mentor:       { bg: "bg-stone-50",    border: "border-stone-300",  text: "text-stone-500" },
  test:         { bg: "bg-red-50",      border: "border-red-300",    text: "text-red-700" },
  assignment:   { bg: "bg-amber-50",    border: "border-amber-300",  text: "text-amber-700" },
  presentation: { bg: "bg-emerald-50",  border: "border-emerald-300",text: "text-emerald-700" },
}

type ViewMode = "week" | "day"

export default function CalendarPage() {
  const [view, setView] = useState<ViewMode>("week")
  const [selectedDay, setSelectedDay] = useState(today)

  function getLesson(day: number, time: string) {
    return lessons.find(e => e.day === day && e.startTime === time)
  }

  function getTodos(day: number) {
    return todos.filter(e => e.day === day)
  }

  const dayLessons = lessons.filter(l => l.day === selectedDay).sort((a, b) => a.startTime.localeCompare(b.startTime))
  const dayTodos = getTodos(selectedDay)

  return (
    <div className="flex-1 overflow-y-auto" style={{ fontFamily: 'var(--font-body)' }}>
      <div className="max-w-5xl mx-auto px-8">

        <div className="pt-10 pb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl tracking-tight">Kalender</h1>
            <p className="text-sm text-stone-400 mt-1">Vecka 20 · 12–16 maj 2026</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex bg-stone-100 rounded-lg p-0.5">
              <button onClick={() => setView("week")}
                className={`text-xs px-3 py-1.5 rounded-md transition ${view === "week" ? "bg-white text-stone-800 shadow-sm font-medium" : "text-stone-500"}`}>
                Vecka
              </button>
              <button onClick={() => setView("day")}
                className={`text-xs px-3 py-1.5 rounded-md transition ${view === "day" ? "bg-white text-stone-800 shadow-sm font-medium" : "text-stone-500"}`}>
                Dag
              </button>
            </div>
          </div>
        </div>

        {/* Dagväljare */}
        <div className="flex gap-2 mb-6">
          {daysShort.map((d, i) => (
            <button key={d} onClick={() => { setSelectedDay(i); if (view === "week") setView("week") }}
              className={`flex-1 py-3 rounded-xl text-center transition border ${
                i === today && view === "week"
                  ? "border-stone-300 bg-stone-50"
                  : i === selectedDay && view === "day"
                  ? "border-stone-800 bg-stone-800 text-white"
                  : "border-stone-200 bg-white hover:border-stone-300"
              }`}>
              <p className={`text-xs font-medium ${i === selectedDay && view === "day" ? "text-white" : i === today ? "text-stone-800" : "text-stone-500"}`}>{d}</p>
              <p className={`text-[10px] mt-0.5 ${i === selectedDay && view === "day" ? "text-white/60" : "text-stone-300"}`}>{dates[i]}</p>
              {getTodos(i).length > 0 && (
                <div className={`w-1 h-1 rounded-full mx-auto mt-1.5 ${i === selectedDay && view === "day" ? "bg-white/50" : "bg-amber-400"}`} />
              )}
            </button>
          ))}
        </div>

        {/* VECKOVY */}
        {view === "week" && (
          <div className="bg-white border border-stone-200 rounded-xl overflow-hidden mb-10">
            <table className="w-full text-sm table-fixed">
              <thead>
                <tr className="border-b border-stone-100">
                  <th className="w-14 px-3 py-3 text-[10px] uppercase tracking-widest text-stone-300 font-normal text-left" />
                  {daysShort.map((d, i) => (
                    <th key={d} className={`px-1 py-3 text-[10px] uppercase tracking-widest font-normal text-center ${i === today ? "text-stone-800 font-medium" : "text-stone-400"}`}>{d}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {timeSlots.map((slot) => {
                  if (slot.isBreak) {
                    return (
                      <tr key={slot.time} className="border-b border-stone-50">
                        <td colSpan={6} className="py-2 text-center">
                          <p className="text-[10px] text-stone-300 tracking-widest uppercase">{slot.breakLabel} · 10:30–13:00</p>
                        </td>
                      </tr>
                    )
                  }
                  return (
                    <tr key={slot.time} className="border-b border-stone-50">
                      <td className="px-3 py-1 text-[11px] font-mono text-stone-300 align-top pt-3">{slot.label}</td>
                      {daysShort.map((_, dayIdx) => {
                        const ev = getLesson(dayIdx, slot.time)
                        if (!ev) return <td key={dayIdx} className="px-1 py-1" style={{ height: 52 }} />
                        const s = typeStyles[ev.type]
                        return (
                          <td key={dayIdx} className="px-1 py-1" style={{ height: 52 }}>
                            <div className={`w-full px-2.5 py-2 rounded-lg border ${s.bg} ${s.border} ${s.text}`}>
                              <p className="text-xs font-medium truncate">{ev.title}</p>
                              <p className="text-[10px] opacity-60 truncate mt-0.5">{ev.room}</p>
                            </div>
                          </td>
                        )
                      })}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* DAGVY */}
        {view === "day" && (
          <div className="mb-10">
            <div className="space-y-2">
              {dayLessons.map((ev) => {
                const s = typeStyles[ev.type]
                const isAfternoon = ev.startTime >= "13:00"
                const prevLesson = dayLessons[dayLessons.indexOf(ev) - 1]
                const showLunch = isAfternoon && prevLesson && prevLesson.startTime < "12:00"

                return (
                  <div key={ev.id}>
                    {showLunch && (
                      <div className="py-4 text-center">
                        <p className="text-[10px] text-stone-300 tracking-widest uppercase">Lunch · 10:30–13:00</p>
                      </div>
                    )}
                    <div className={`flex items-center gap-4 p-4 rounded-xl border ${s.bg} ${s.border}`}>
                      <div className="text-right w-14 shrink-0">
                        <p className="text-xs font-mono text-stone-500">{ev.startTime}</p>
                        <p className="text-[10px] font-mono text-stone-300">{ev.endTime}</p>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium ${s.text}`}>{ev.title}</p>
                        <p className="text-xs text-stone-400 mt-0.5">{ev.teacher}{ev.room ? ` · ${ev.room}` : ""}</p>
                      </div>
                      {ev.courseCode && <span className="text-[10px] font-mono text-stone-300">{ev.courseCode}</span>}
                    </div>
                  </div>
                )
              })}

              {dayLessons.length === 0 && (
                <div className="bg-white border border-stone-200 rounded-xl p-12 text-center">
                  <p className="text-sm text-stone-400">Inga lektioner denna dag.</p>
                </div>
              )}
            </div>

            {/* Att göra för denna dag */}
            {dayTodos.length > 0 && (
              <div className="mt-6">
                <p className="text-[10px] uppercase tracking-[0.15em] text-stone-400 mb-2 font-medium">Deadline denna dag</p>
                {dayTodos.map(t => {
                  const s = typeStyles[t.type]
                  return (
                    <div key={t.id} className={`flex items-center gap-4 p-3 rounded-lg border ${s.bg} ${s.border} mb-1.5`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${s.border.replace("border", "bg")}`} />
                      <div className="flex-1">
                        <p className={`text-xs font-medium ${s.text}`}>{t.title}</p>
                        <p className="text-[10px] text-stone-400">{t.courseCode}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* Legend */}
        <div className="flex gap-4 mb-10">
          {[
            { type: "lesson", label: "Lektion" },
            { type: "lab", label: "Labb" },
            { type: "assignment", label: "Uppgift" },
          ].map(l => (
            <span key={l.type} className="flex items-center gap-1.5 text-[10px] text-stone-400">
              <div className={`w-3 h-2 rounded-sm border ${typeStyles[l.type].bg} ${typeStyles[l.type].border}`} />
              {l.label}
            </span>
          ))}
        </div>

      </div>
    </div>
  )
}