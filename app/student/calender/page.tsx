"use client"

import { useState } from "react"

type CalendarEvent = {
  id: string
  title: string
  courseCode: string
  type: "lesson" | "todo" | "test" | "lab" | "assignment" | "presentation"
  day: number // 0=mån
  startTime: string
  endTime?: string
  room?: string
  teacher?: string
  done?: boolean
}

const events: CalendarEvent[] = [
  // Måndag
  { id: "l1", title: "Matematik 2b", courseCode: "MA2B", type: "lesson", day: 0, startTime: "08:15", endTime: "09:15", room: "R201", teacher: "Maria Lindström" },
  { id: "l2", title: "Matematik 2b", courseCode: "MA2B", type: "lesson", day: 0, startTime: "09:30", endTime: "10:30", room: "R201", teacher: "Maria Lindström" },
  { id: "l3", title: "Engelska 5", courseCode: "EN5", type: "lesson", day: 0, startTime: "12:30", endTime: "13:30", room: "R108", teacher: "Karin Holm" },
  { id: "l4", title: "Mentorstid", courseCode: "MA2B", type: "lesson", day: 0, startTime: "13:45", endTime: "14:45", room: "R201", teacher: "Maria Lindström" },

  // Tisdag
  { id: "l5", title: "Fysik 1", courseCode: "FY1", type: "lab", day: 1, startTime: "08:15", endTime: "09:15", room: "Labbsal A", teacher: "Per Ekström" },
  { id: "l6", title: "Fysik 1", courseCode: "FY1", type: "lab", day: 1, startTime: "09:30", endTime: "10:30", room: "Labbsal A", teacher: "Per Ekström" },
  { id: "l7", title: "Svenska 1", courseCode: "SV1", type: "lesson", day: 1, startTime: "12:30", endTime: "13:30", room: "R102", teacher: "Karin Holm" },

  // Onsdag
  { id: "l8", title: "Historia 1b", courseCode: "HI1B", type: "lesson", day: 2, startTime: "08:15", endTime: "09:15", room: "R102", teacher: "Karin Holm" },
  { id: "l9", title: "Matematik 2b", courseCode: "MA2B", type: "lesson", day: 2, startTime: "10:45", endTime: "11:45", room: "R201", teacher: "Maria Lindström" },
  { id: "l10", title: "Samhällskunskap 1b", courseCode: "SH1B", type: "lesson", day: 2, startTime: "12:30", endTime: "13:30", room: "R112", teacher: "Anna Karlsson" },

  // Torsdag
  { id: "l11", title: "Engelska 5", courseCode: "EN5", type: "lesson", day: 3, startTime: "08:15", endTime: "09:15", room: "R108", teacher: "Karin Holm" },
  { id: "l12", title: "Samhällskunskap 1b", courseCode: "SH1B", type: "lesson", day: 3, startTime: "09:30", endTime: "10:30", room: "R112", teacher: "Anna Karlsson" },
  { id: "l13", title: "Svenska 1", courseCode: "SV1", type: "lesson", day: 3, startTime: "12:30", endTime: "13:30", room: "R102", teacher: "Karin Holm" },

  // Fredag
  { id: "l14", title: "Matematik 2b", courseCode: "MA2B", type: "lesson", day: 4, startTime: "08:15", endTime: "09:15", room: "R201", teacher: "Maria Lindström" },
  { id: "l15", title: "Svenska 1", courseCode: "SV1", type: "lesson", day: 4, startTime: "09:30", endTime: "10:30", room: "R102", teacher: "Karin Holm" },
  { id: "l16", title: "Historia 1b", courseCode: "HI1B", type: "lesson", day: 4, startTime: "12:30", endTime: "13:30", room: "R102", teacher: "Karin Holm" },

  // Att göra (visas som markers på rätt dag)
  { id: "t1", title: "Övningsuppgifter — Andragradsekvationer", courseCode: "MA2B", type: "assignment", day: 3, startTime: "23:59" },
  { id: "t2", title: "Läs kapitel 8 — Krafter och rörelse", courseCode: "FY1", type: "assignment", day: 4, startTime: "23:59" },
  { id: "t3", title: "Prov — Andragradsekvationer", courseCode: "MA2B", type: "test", day: 0, startTime: "08:15", endTime: "09:15", room: "R201" },
  { id: "t4", title: "Inlämning — Argumenterande text", courseCode: "SV1", type: "assignment", day: 1, startTime: "23:59" },
  { id: "t5", title: "Labb — Kraftmätning", courseCode: "FY1", type: "lab", day: 2, startTime: "08:15", endTime: "10:30", room: "Labbsal A" },
  { id: "t6", title: "Oral presentation", courseCode: "EN5", type: "presentation", day: 3, startTime: "08:15", endTime: "09:15", room: "R108" },
]

const timeSlots = ["08:15", "09:30", "10:45", "12:30", "13:45", "15:00"]
const days = ["Måndag", "Tisdag", "Onsdag", "Torsdag", "Fredag"]
const daysShort = ["Mån", "Tis", "Ons", "Tors", "Fre"]
const dates = ["12 maj", "13 maj", "14 maj", "15 maj", "16 maj"]

const typeStyles: Record<string, { bg: string; text: string; border: string }> = {
  lesson: { bg: "bg-stone-800", text: "text-white", border: "border-stone-800" },
  lab: { bg: "bg-indigo-600", text: "text-white", border: "border-indigo-600" },
  test: { bg: "bg-red-500", text: "text-white", border: "border-red-500" },
  assignment: { bg: "bg-amber-50", text: "text-amber-800", border: "border-amber-200" },
  presentation: { bg: "bg-emerald-600", text: "text-white", border: "border-emerald-600" },
}

const typeLabels: Record<string, string> = {
  lesson: "Lektion",
  lab: "Labb",
  test: "Prov",
  assignment: "Uppgift",
  presentation: "Redovisning",
}

type ViewMode = "week" | "list"

export default function CalendarPage() {
  const [view, setView] = useState<ViewMode>("week")
  const [selectedWeek] = useState("v.20")
  const today = 2 // onsdag

  function getEventsForSlot(day: number, time: string) {
    return events.filter(e => e.day === day && e.startTime === time && e.type === "lesson")
  }

  function getTodosForDay(day: number) {
    return events.filter(e => e.day === day && e.type !== "lesson")
  }

  // Alla events sorterade för listvyn
  const allEventsSorted = [...events].sort((a, b) => {
    if (a.day !== b.day) return a.day - b.day
    return a.startTime.localeCompare(b.startTime)
  })

  return (
    <div className="flex-1 overflow-y-auto" style={{ fontFamily: 'var(--font-body)' }}>
      <div className="max-w-6xl mx-auto px-8">

        <div className="pt-10 pb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>Kalender</h1>
            <p className="text-sm text-stone-400 mt-1">Vecka 20 · 12–16 maj 2026</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex bg-stone-100 rounded-lg p-0.5">
              <button onClick={() => setView("week")}
                className={`text-xs px-3 py-1.5 rounded-md transition ${view === "week" ? "bg-white text-stone-800 shadow-sm font-medium" : "text-stone-500"}`}>
                Vecka
              </button>
              <button onClick={() => setView("list")}
                className={`text-xs px-3 py-1.5 rounded-md transition ${view === "list" ? "bg-white text-stone-800 shadow-sm font-medium" : "text-stone-500"}`}>
                Lista
              </button>
            </div>
            <select className="text-sm border border-stone-200 rounded-lg px-3 py-1.5 bg-white text-stone-600">
              <option>v.20</option><option>v.21</option><option>v.22</option>
            </select>
          </div>
        </div>

        {/* VECKOVY */}
        {view === "week" && (
          <div className="bg-white border border-stone-200 rounded-xl overflow-hidden mb-10">
            <table className="w-full text-sm table-fixed">
              <thead>
                <tr className="border-b border-stone-200 bg-stone-50/50">
                  <th className="w-16 px-3 py-3 text-[10px] uppercase tracking-widest text-stone-400 font-normal text-left">Tid</th>
                  {daysShort.map((d, i) => (
                    <th key={d} className={`px-2 py-3 text-left ${i === today ? "bg-stone-100/50" : ""}`}>
                      <p className={`text-[10px] uppercase tracking-widest font-normal ${i === today ? "text-stone-800 font-medium" : "text-stone-400"}`}>{d}</p>
                      <p className={`text-[10px] ${i === today ? "text-stone-600" : "text-stone-300"}`}>{dates[i]}</p>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {timeSlots.map(time => (
                  <tr key={time} className="border-b border-stone-50">
                    <td className="px-3 py-1 text-xs font-mono text-stone-400 align-top pt-3">{time}</td>
                    {days.map((_, dayIdx) => {
                      const lesson = getEventsForSlot(dayIdx, time)
                      const isToday = dayIdx === today
                      return (
                        <td key={dayIdx} className={`px-1 py-1 align-top ${isToday ? "bg-stone-50/50" : ""}`} style={{ height: 56 }}>
                          {lesson.map(ev => {
                            const style = typeStyles[ev.type] || typeStyles.lesson
                            return (
                              <div key={ev.id} className={`w-full text-left px-2.5 py-2 rounded-lg ${style.bg} ${style.text} border ${style.border}`}>
                                <p className="text-xs font-medium truncate">{ev.title}</p>
                                <p className="text-[10px] opacity-70 truncate mt-0.5">{ev.room}</p>
                              </div>
                            )
                          })}
                        </td>
                      )
                    })}
                  </tr>
                ))}

                {/* Att göra-rad */}
                <tr className="border-t border-stone-200 bg-stone-50/30">
                  <td className="px-3 py-3 text-[10px] uppercase tracking-widest text-stone-400 font-normal align-top">Att göra</td>
                  {days.map((_, dayIdx) => {
                    const todos = getTodosForDay(dayIdx)
                    return (
                      <td key={dayIdx} className={`px-1 py-2 align-top ${dayIdx === today ? "bg-stone-100/30" : ""}`}>
                        {todos.map(ev => {
                          const style = typeStyles[ev.type] || typeStyles.assignment
                          return (
                            <div key={ev.id} className={`w-full text-left px-2.5 py-1.5 rounded-lg mb-1 ${style.bg} ${style.text} border ${style.border}`}>
                              <p className="text-[10px] font-medium truncate">{ev.title}</p>
                              <p className="text-[9px] opacity-60 truncate">{ev.courseCode} · {typeLabels[ev.type]}</p>
                            </div>
                          )
                        })}
                      </td>
                    )
                  })}
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* LISTVY */}
        {view === "list" && (
          <div className="mb-10 space-y-6">
            {days.map((dayName, dayIdx) => {
              const dayEvents = allEventsSorted.filter(e => e.day === dayIdx)
              if (dayEvents.length === 0) return null
              return (
                <div key={dayIdx}>
                  <div className="flex items-center gap-3 mb-3">
                    <p className={`text-sm font-medium ${dayIdx === today ? "text-stone-800" : "text-stone-500"}`}>{dayName}</p>
                    <p className="text-xs text-stone-300">{dates[dayIdx]}</p>
                    {dayIdx === today && <span className="text-[10px] bg-stone-800 text-white px-2 py-0.5 rounded-full">Idag</span>}
                  </div>
                  <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
                    {dayEvents.map((ev, i) => {
                      const style = typeStyles[ev.type] || typeStyles.lesson
                      const isTask = ev.type !== "lesson"
                      return (
                        <div key={ev.id} className={`flex items-center gap-4 px-5 py-3.5 ${i > 0 ? "border-t border-stone-100" : ""}`}>
                          <div className={`w-2 h-2 rounded-full ${style.bg}`} />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-stone-800">{ev.title}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[10px] font-mono text-stone-400">{ev.courseCode}</span>
                              <span className="text-[10px] text-stone-300">·</span>
                              <span className="text-[10px] text-stone-400">{typeLabels[ev.type]}</span>
                              {ev.room && <>
                                <span className="text-[10px] text-stone-300">·</span>
                                <span className="text-[10px] text-stone-400">{ev.room}</span>
                              </>}
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            {ev.startTime !== "23:59" ? (
                              <p className="text-xs text-stone-500">{ev.startTime}{ev.endTime ? `–${ev.endTime}` : ""}</p>
                            ) : (
                              <p className="text-xs text-stone-400">Deadline</p>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Legend */}
        <div className="flex gap-4 mb-10">
          {[
            { type: "lesson", label: "Lektion" },
            { type: "lab", label: "Labb" },
            { type: "test", label: "Prov" },
            { type: "assignment", label: "Uppgift" },
            { type: "presentation", label: "Redovisning" },
          ].map(l => (
            <span key={l.type} className="flex items-center gap-1.5 text-[10px] text-stone-400">
              <div className={`w-2.5 h-2 rounded-sm ${typeStyles[l.type].bg}`} />
              {l.label}
            </span>
          ))}
        </div>

      </div>
    </div>
  )
}