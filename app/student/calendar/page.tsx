"use client"
import React from "react"
import { useState } from "react"

type Lesson = {
  id: string; title: string; courseCode: string; type: "lesson" | "lab" | "mentor"
  day: number; startTime: string; endTime: string; room: string; teacher: string
}

const subjectColors: Record<string, { bg: string; border: string; text: string; accent: string }> = {
  MA2B: { bg: "bg-blue-50",    border: "border-blue-200",    text: "text-blue-700",    accent: "bg-blue-400" },
  SV1:  { bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-700", accent: "bg-emerald-400" },
  EN5:  { bg: "bg-violet-50",  border: "border-violet-200",  text: "text-violet-700",  accent: "bg-violet-400" },
  FY1:  { bg: "bg-amber-50",   border: "border-amber-200",   text: "text-amber-700",   accent: "bg-amber-400" },
  HI1B: { bg: "bg-sky-50",     border: "border-sky-200",     text: "text-sky-700",     accent: "bg-sky-400" },
  SH1B: { bg: "bg-rose-50",    border: "border-rose-200",    text: "text-rose-700",    accent: "bg-rose-400" },
  "":   { bg: "bg-stone-50",   border: "border-stone-200",   text: "text-stone-500",   accent: "bg-stone-300" },
}

const lessons: Lesson[] = [
  { id:"l1", title:"Matematik 2b", courseCode:"MA2B", type:"lesson", day:0, startTime:"08:15", endTime:"09:15", room:"R201", teacher:"Maria Lindström" },
  { id:"l2", title:"Matematik 2b", courseCode:"MA2B", type:"lesson", day:0, startTime:"09:30", endTime:"10:30", room:"R201", teacher:"Maria Lindström" },
  { id:"l3", title:"Engelska 5",   courseCode:"EN5",  type:"lesson", day:0, startTime:"13:00", endTime:"14:00", room:"R108", teacher:"Karin Holm" },
  { id:"l4", title:"Mentorstid",   courseCode:"",     type:"mentor", day:0, startTime:"14:15", endTime:"15:00", room:"R201", teacher:"Maria Lindström" },

  { id:"l5", title:"Fysik 1 — Labb",  courseCode:"FY1", type:"lab",    day:1, startTime:"08:15", endTime:"09:15", room:"Labbsal A", teacher:"Per Ekström" },
  { id:"l6", title:"Fysik 1 — Labb",  courseCode:"FY1", type:"lab",    day:1, startTime:"09:30", endTime:"10:30", room:"Labbsal A", teacher:"Per Ekström" },
  { id:"l7", title:"Svenska 1",       courseCode:"SV1", type:"lesson", day:1, startTime:"12:15", endTime:"13:15", room:"R102", teacher:"Karin Holm" },
  { id:"l8", title:"Historia 1b",     courseCode:"HI1B",type:"lesson", day:1, startTime:"13:30", endTime:"14:30", room:"R102", teacher:"Karin Holm" },

  { id:"l9",  title:"Historia 1b",        courseCode:"HI1B",type:"lesson", day:2, startTime:"08:15", endTime:"09:15", room:"R102", teacher:"Karin Holm" },
  { id:"l10", title:"Matematik 2b",       courseCode:"MA2B",type:"lesson", day:2, startTime:"09:30", endTime:"10:30", room:"R201", teacher:"Maria Lindström" },
  { id:"l11", title:"Samhällskunskap 1b", courseCode:"SH1B",type:"lesson", day:2, startTime:"13:00", endTime:"14:00", room:"R112", teacher:"Anna Karlsson" },

  { id:"l12", title:"Engelska 5",          courseCode:"EN5", type:"lesson", day:3, startTime:"08:15", endTime:"09:15", room:"R108", teacher:"Karin Holm" },
  { id:"l13", title:"Samhällskunskap 1b",  courseCode:"SH1B",type:"lesson", day:3, startTime:"09:30", endTime:"10:30", room:"R112", teacher:"Anna Karlsson" },
  { id:"l14", title:"Svenska 1",           courseCode:"SV1", type:"lesson", day:3, startTime:"13:00", endTime:"14:00", room:"R102", teacher:"Karin Holm" },

  { id:"l15", title:"Matematik 2b", courseCode:"MA2B",type:"lesson", day:4, startTime:"08:15", endTime:"09:15", room:"R201", teacher:"Maria Lindström" },
  { id:"l16", title:"Svenska 1",    courseCode:"SV1", type:"lesson", day:4, startTime:"10:00", endTime:"11:00", room:"R102", teacher:"Karin Holm" },
  { id:"l17", title:"Historia 1b",  courseCode:"HI1B",type:"lesson", day:4, startTime:"13:00", endTime:"14:00", room:"R102", teacher:"Karin Holm" },
]

const daysShort = ["Mån", "Tis", "Ons", "Tors", "Fre"]
const daysFull = ["Måndag", "Tisdag", "Onsdag", "Torsdag", "Fredag"]
const dates = ["12 maj", "13 maj", "14 maj", "15 maj", "16 maj"]
const today = 2

function getColor(code: string) {
  return subjectColors[code] || subjectColors[""]
}

function findLunchGap(dayLessons: Lesson[]): { after: string; before: string } | null {
  const sorted = [...dayLessons].sort((a, b) => a.startTime.localeCompare(b.startTime))
  let biggestGap = 0
  let gapAfter = ""
  let gapBefore = ""
  for (let i = 0; i < sorted.length - 1; i++) {
    const endMinutes = timeToMin(sorted[i].endTime)
    const startMinutes = timeToMin(sorted[i + 1].startTime)
    const gap = startMinutes - endMinutes
    if (gap > biggestGap && gap >= 30) {
      biggestGap = gap
      gapAfter = sorted[i].endTime
      gapBefore = sorted[i + 1].startTime
    }
  }
  return biggestGap >= 30 ? { after: gapAfter, before: gapBefore } : null
}

function timeToMin(t: string) {
  const [h, m] = t.split(":").map(Number)
  return h * 60 + m
}

type ViewMode = "week" | "day"

export default function CalendarPage() {
  const [view, setView] = useState<ViewMode>("day")
  const [selectedDay, setSelectedDay] = useState(today)

  const dayLessons = lessons.filter(l => l.day === selectedDay).sort((a, b) => a.startTime.localeCompare(b.startTime))
  const lunch = findLunchGap(dayLessons)

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
            const dayCount = lessons.filter(l => l.day === i).length
            return (
              <button key={d} onClick={() => { setSelectedDay(i); setView("day") }}
                className={`flex-1 py-3.5 rounded-xl text-center transition border ${
                  isSelected ? "border-stone-800 bg-stone-800"
                  : isToday ? "border-stone-400 bg-white"
                  : "border-stone-200 bg-white hover:border-stone-300"
                }`}>
                <p className={`text-sm font-medium ${isSelected ? "text-white" : isToday ? "text-stone-800" : "text-stone-500"}`}>{d}</p>
                <p className={`text-[11px] mt-0.5 ${isSelected ? "text-white/50" : "text-stone-300"}`}>{dates[i]}</p>
                <p className={`text-[10px] mt-1 ${isSelected ? "text-white/30" : "text-stone-300"}`}>{dayCount} lektioner</p>
              </button>
            )
          })}
        </div>

        {/* DAGVY */}
        {view === "day" && (
          <div className="mb-10">
            <p className="text-sm font-medium text-stone-800 mb-5">
              {daysFull[selectedDay]} {dates[selectedDay]}
              {selectedDay === today && <span className="text-[10px] bg-stone-800 text-white px-2 py-0.5 rounded-full ml-2">Idag</span>}
            </p>

            {dayLessons.length === 0 ? (
              <div className="bg-white border border-stone-200 rounded-xl p-12 text-center">
                <p className="text-sm text-stone-400">Inga lektioner.</p>
              </div>
            ) : (
              <div className="relative">
                {/* Tidslinje */}
                <div className="absolute left-[38px] top-0 bottom-0 w-px bg-stone-100" />

                <div className="space-y-3">
                  {dayLessons.map((ev, idx) => {
                    const c = getColor(ev.courseCode)
                    const showLunch = lunch && idx > 0 && dayLessons[idx - 1].endTime <= lunch.after && ev.startTime >= lunch.before

                    return (
                      <div key={ev.id}>
                        {showLunch && (
                          <div className="flex items-center gap-4 py-4 pl-[26px]">
                            <div className="w-6 h-6 rounded-full bg-stone-100 flex items-center justify-center">
                              <span className="text-[9px] text-stone-400">☕</span>
                            </div>
                            <div className="flex-1 flex items-center gap-3">
                              <div className="flex-1 h-px bg-stone-100" />
                              <p className="text-[11px] text-stone-300">Lunch · {lunch.after}–{lunch.before}</p>
                              <div className="flex-1 h-px bg-stone-100" />
                            </div>
                          </div>
                        )}

                        <div className="flex gap-4">
                          {/* Tid */}
                          <div className="w-[52px] shrink-0 text-right pt-4 relative">
                            <div className="absolute right-[-9px] top-5 w-3 h-3 rounded-full border-2 border-white bg-stone-300 z-10" />
                            <p className="text-xs font-medium text-stone-600">{ev.startTime}</p>
                            <p className="text-[10px] text-stone-300">{ev.endTime}</p>
                          </div>

                          {/* Kort */}
                          <div className={`flex-1 rounded-xl border overflow-hidden transition hover:shadow-sm ${c.border} ${c.bg}`}>
                            <div className="flex items-center px-5 py-4">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <p className={`text-sm font-medium ${c.text}`}>{ev.title}</p>
                                  {ev.type === "lab" && <span className={`text-[9px] ${c.text} opacity-60 border ${c.border} rounded px-1.5 py-0.5`}>Labb</span>}
                                  {ev.type === "mentor" && <span className="text-[9px] text-stone-400 border border-stone-200 rounded px-1.5 py-0.5">Mentor</span>}
                                </div>
                                <p className="text-xs text-stone-400 mt-1">{ev.teacher}</p>
                              </div>
                              <div className="text-right shrink-0">
                                <p className="text-xs text-stone-500">{ev.room}</p>
                                {ev.courseCode && <p className="text-[10px] font-mono text-stone-300 mt-0.5">{ev.courseCode}</p>}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
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
                    <th className="w-16" />
                    {daysShort.map((d, i) => (
                      <th key={d} className={`px-1 py-3 text-center ${i === today ? "bg-stone-50" : ""}`}>
                        <p className={`text-xs font-medium ${i === today ? "text-stone-800" : "text-stone-400"}`}>{d}</p>
                        <p className={`text-[10px] ${i === today ? "text-stone-500" : "text-stone-300"}`}>{dates[i]}</p>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(() => {
                    const allTimes = [...new Set(lessons.map(l => l.startTime))].sort()
                    const rows: React.ReactElement[] = []
                    let lunchInserted = false

                    allTimes.forEach(time => {
                      const timeMin = timeToMin(time)

                      if (!lunchInserted && timeMin >= 720) {
                        lunchInserted = true
                        rows.push(
                          <tr key="lunch">
                            <td colSpan={6} className="py-2">
                              <div className="flex items-center gap-3 px-3">
                                <div className="flex-1 h-px bg-stone-100" />
                                <p className="text-[10px] text-stone-300">Lunch</p>
                                <div className="flex-1 h-px bg-stone-100" />
                              </div>
                            </td>
                          </tr>
                        )
                      }

                      rows.push(
                        <tr key={time} className="border-b border-stone-50">
                          <td className="px-3 py-1 align-top pt-3">
                            <p className="text-[11px] text-stone-400">{time}</p>
                          </td>
                          {daysShort.map((_, dayIdx) => {
                            const ev = lessons.find(l => l.day === dayIdx && l.startTime === time)
                            if (!ev) return <td key={dayIdx} className={`px-1 py-1 ${dayIdx === today ? "bg-stone-50/50" : ""}`} style={{ height: 52 }} />
                            const c = getColor(ev.courseCode)
                            return (
                              <td key={dayIdx} className={`px-1 py-1 ${dayIdx === today ? "bg-stone-50/50" : ""}`} style={{ height: 52 }}>
                                <button onClick={() => { setSelectedDay(dayIdx); setView("day") }}
                                  className={`w-full text-left px-2 py-2 rounded-lg border transition hover:shadow-sm ${c.bg} ${c.border}`}>
                                  <p className={`text-[11px] font-medium ${c.text} truncate`}>{ev.title}</p>
                                  <p className="text-[9px] text-stone-400 truncate mt-0.5">{ev.room} · {ev.startTime}</p>
                                </button>
                              </td>
                            )
                          })}
                        </tr>
                      )
                    })
                    return rows
                  })()}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Legend */}
        <div className="flex flex-wrap gap-3 mb-10">
          {[
            { code: "MA2B", label: "Matematik" },
            { code: "SV1", label: "Svenska" },
            { code: "EN5", label: "Engelska" },
            { code: "FY1", label: "Fysik" },
            { code: "HI1B", label: "Historia" },
            { code: "SH1B", label: "Samhällskunskap" },
          ].map(l => {
            const c = getColor(l.code)
            return (
              <span key={l.code} className="flex items-center gap-1.5 text-[10px] text-stone-400">
                <div className={`w-3 h-2 rounded-sm border ${c.bg} ${c.border}`} />
                {l.label}
              </span>
            )
          })}
        </div>

      </div>
    </div>
  )
}