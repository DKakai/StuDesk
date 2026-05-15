"use client"

import { useState } from "react"

type CalendarEvent = {
  id: string; title: string; courseCode: string
  type: "lesson" | "lab" | "mentor" | "test" | "presentation"
  day: number; startTime: string; endTime: string; room?: string; teacher?: string
}

const lessons: CalendarEvent[] = [
  { id: "l1", title: "Matematik 2b", courseCode: "MA2B", type: "lesson", day: 0, startTime: "08:15", endTime: "09:15", room: "R201", teacher: "Maria Lindström" },
  { id: "l2", title: "Matematik 2b", courseCode: "MA2B", type: "lesson", day: 0, startTime: "09:30", endTime: "10:30", room: "R201", teacher: "Maria Lindström" },
  { id: "l3", title: "Engelska 5", courseCode: "EN5", type: "lesson", day: 0, startTime: "13:00", endTime: "14:00", room: "R108", teacher: "Karin Holm" },
  { id: "l4", title: "Mentorstid", courseCode: "", type: "mentor", day: 0, startTime: "14:15", endTime: "15:00", room: "R201", teacher: "Maria Lindström" },

  { id: "l5", title: "Fysik 1 — Labb", courseCode: "FY1", type: "lab", day: 1, startTime: "08:15", endTime: "09:15", room: "Labbsal A", teacher: "Per Ekström" },
  { id: "l6", title: "Fysik 1 — Labb", courseCode: "FY1", type: "lab", day: 1, startTime: "09:30", endTime: "10:30", room: "Labbsal A", teacher: "Per Ekström" },
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

const daysShort = ["Mån", "Tis", "Ons", "Tors", "Fre"]
const daysFull = ["Måndag", "Tisdag", "Onsdag", "Torsdag", "Fredag"]
const dates = ["12 maj", "13 maj", "14 maj", "15 maj", "16 maj"]
const today = 2

const typeStyles: Record<string, { bg: string; border: string; text: string; accent: string }> = {
  lesson: { bg: "bg-stone-50", border: "border-stone-200", text: "text-stone-700", accent: "bg-stone-400" },
  lab:    { bg: "bg-indigo-50", border: "border-indigo-200", text: "text-indigo-700", accent: "bg-indigo-400" },
  mentor: { bg: "bg-stone-50", border: "border-stone-200", text: "text-stone-500", accent: "bg-stone-300" },
  test:   { bg: "bg-red-50", border: "border-red-200", text: "text-red-700", accent: "bg-red-400" },
  presentation: { bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-700", accent: "bg-emerald-400" },
}

type ViewMode = "week" | "day"

export default function CalendarPage() {
  const [view, setView] = useState<ViewMode>("day")
  const [selectedDay, setSelectedDay] = useState(today)

  const dayLessons = lessons.filter(l => l.day === selectedDay).sort((a, b) => a.startTime.localeCompare(b.startTime))

  const morningLessons = dayLessons.filter(l => l.startTime < "12:00")
  const afternoonLessons = dayLessons.filter(l => l.startTime >= "12:00")

  function getLesson(day: number, time: string) {
    return lessons.find(e => e.day === day && e.startTime === time)
  }

  return (
    <div className="flex-1 overflow-y-auto" style={{ fontFamily: 'var(--font-body)' }}>
      <div className="max-w-5xl mx-auto px-8">

        <div className="pt-10 pb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl tracking-tight">Kalender</h1>
            <p className="text-sm text-stone-400 mt-1">Vecka 20 · 12–16 maj 2026</p>
          </div>
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

        {/* Dagväljare */}
        <div className="flex gap-2 mb-8">
          {daysShort.map((d, i) => {
            const isSelected = view === "day" && i === selectedDay
            const isToday = i === today
            return (
              <button key={d} onClick={() => { setSelectedDay(i); setView("day") }}
                className={`flex-1 py-3.5 rounded-xl text-center transition border ${
                  isSelected
                    ? "border-stone-800 bg-stone-800"
                    : isToday
                    ? "border-stone-400 bg-white"
                    : "border-stone-200 bg-white hover:border-stone-300"
                }`}>
                <p className={`text-sm font-medium ${isSelected ? "text-white" : isToday ? "text-stone-800" : "text-stone-500"}`}>{d}</p>
                <p className={`text-[11px] mt-0.5 ${isSelected ? "text-white/50" : "text-stone-300"}`}>{dates[i]}</p>
                {isToday && !isSelected && <div className="w-1 h-1 rounded-full bg-stone-800 mx-auto mt-1.5" />}
              </button>
            )
          })}
        </div>

        {/* DAGVY */}
        {view === "day" && (
          <div className="mb-10">
            <p className="text-sm font-medium text-stone-800 mb-4">
              {daysFull[selectedDay]} {dates[selectedDay]}
              {selectedDay === today && <span className="text-[10px] bg-stone-800 text-white px-2 py-0.5 rounded-full ml-2 font-medium">Idag</span>}
            </p>

            {dayLessons.length === 0 ? (
              <div className="bg-white border border-stone-200 rounded-xl p-12 text-center">
                <p className="text-sm text-stone-400">Inga lektioner denna dag.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {morningLessons.map(ev => {
                  const s = typeStyles[ev.type]
                  return (
                    <div key={ev.id} className={`flex items-stretch rounded-xl border overflow-hidden ${s.border} ${s.bg}`}>
                      <div className={`w-1 ${s.accent} shrink-0`} />
                      <div className="flex items-center gap-5 px-5 py-4 flex-1">
                        <div className="w-20 shrink-0">
                          <p className="text-sm font-medium text-stone-700">{ev.startTime}</p>
                          <p className="text-xs text-stone-400">{ev.endTime}</p>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium ${s.text}`}>{ev.title}</p>
                          <p className="text-xs text-stone-400 mt-0.5">{ev.teacher}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-xs text-stone-400">{ev.room}</p>
                          {ev.courseCode && <p className="text-[10px] font-mono text-stone-300 mt-0.5">{ev.courseCode}</p>}
                        </div>
                      </div>
                    </div>
                  )
                })}

                {morningLessons.length > 0 && afternoonLessons.length > 0 && (
                  <div className="flex items-center gap-4 py-3 px-2">
                    <div className="flex-1 h-px bg-stone-200" />
                    <p className="text-[11px] text-stone-400 tracking-wide">Lunch</p>
                    <div className="flex-1 h-px bg-stone-200" />
                  </div>
                )}

                {afternoonLessons.map(ev => {
                  const s = typeStyles[ev.type]
                  return (
                    <div key={ev.id} className={`flex items-stretch rounded-xl border overflow-hidden ${s.border} ${s.bg}`}>
                      <div className={`w-1 ${s.accent} shrink-0`} />
                      <div className="flex items-center gap-5 px-5 py-4 flex-1">
                        <div className="w-20 shrink-0">
                          <p className="text-sm font-medium text-stone-700">{ev.startTime}</p>
                          <p className="text-xs text-stone-400">{ev.endTime}</p>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium ${s.text}`}>{ev.title}</p>
                          <p className="text-xs text-stone-400 mt-0.5">{ev.teacher}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-xs text-stone-400">{ev.room}</p>
                          {ev.courseCode && <p className="text-[10px] font-mono text-stone-300 mt-0.5">{ev.courseCode}</p>}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* VECKOVY */}
        {view === "week" && (
          <div className="mb-10">
            <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
              <table className="w-full text-sm table-fixed">
                <thead>
                  <tr className="border-b border-stone-100">
                    <th className="w-20 px-3 py-3 text-left" />
                    {daysShort.map((d, i) => (
                      <th key={d} className={`px-1 py-3 text-center ${i === today ? "bg-stone-50" : ""}`}>
                        <p className={`text-xs font-medium ${i === today ? "text-stone-800" : "text-stone-400"}`}>{d}</p>
                        <p className={`text-[10px] ${i === today ? "text-stone-500" : "text-stone-300"}`}>{dates[i]}</p>
                        {i === today && <div className="w-1 h-1 rounded-full bg-stone-800 mx-auto mt-1" />}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {["08:15", "09:30"].map(time => (
                    <tr key={time} className="border-b border-stone-50">
                      <td className="px-3 py-1 align-top pt-3">
                        <p className="text-xs text-stone-400">{time}</p>
                      </td>
                      {daysShort.map((_, dayIdx) => {
                        const ev = getLesson(dayIdx, time)
                        if (!ev) return <td key={dayIdx} className={`px-1 py-1 ${dayIdx === today ? "bg-stone-50/50" : ""}`} style={{ height: 56 }} />
                        const s = typeStyles[ev.type]
                        return (
                          <td key={dayIdx} className={`px-1 py-1 ${dayIdx === today ? "bg-stone-50/50" : ""}`} style={{ height: 56 }}>
                            <div className={`w-full px-2.5 py-2 rounded-lg border ${s.bg} ${s.border}`}>
                              <p className={`text-xs font-medium ${s.text} truncate`}>{ev.title}</p>
                              <p className="text-[10px] text-stone-400 truncate mt-0.5">{ev.room}</p>
                            </div>
                          </td>
                        )
                      })}
                    </tr>
                  ))}

                  <tr>
                    <td colSpan={6} className="py-2">
                      <div className="flex items-center gap-4 px-3">
                        <div className="flex-1 h-px bg-stone-100" />
                        <p className="text-[10px] text-stone-300 tracking-wide">Lunch</p>
                        <div className="flex-1 h-px bg-stone-100" />
                      </div>
                    </td>
                  </tr>

                  {["13:00", "14:15"].map(time => (
                    <tr key={time} className="border-b border-stone-50">
                      <td className="px-3 py-1 align-top pt-3">
                        <p className="text-xs text-stone-400">{time}</p>
                      </td>
                      {daysShort.map((_, dayIdx) => {
                        const ev = getLesson(dayIdx, time)
                        if (!ev) return <td key={dayIdx} className={`px-1 py-1 ${dayIdx === today ? "bg-stone-50/50" : ""}`} style={{ height: 56 }} />
                        const s = typeStyles[ev.type]
                        return (
                          <td key={dayIdx} className={`px-1 py-1 ${dayIdx === today ? "bg-stone-50/50" : ""}`} style={{ height: 56 }}>
                            <div className={`w-full px-2.5 py-2 rounded-lg border ${s.bg} ${s.border}`}>
                              <p className={`text-xs font-medium ${s.text} truncate`}>{ev.title}</p>
                              <p className="text-[10px] text-stone-400 truncate mt-0.5">{ev.room}</p>
                            </div>
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}