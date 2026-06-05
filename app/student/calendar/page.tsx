"use client"

import React from "react"
import { useState } from "react"

type Lesson = {
  id: string; title: string; courseCode: string; type: "lesson" | "lab" | "mentor"
  day: number; startTime: string; endTime: string; room: string; teacher: string
}

const subjectColors: Record<string, { bg: string; border: string; text: string }> = {
  MA2B: { bg: "bg-blue-50",    border: "border-blue-200",    text: "text-blue-700" },
  SV1:  { bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-700" },
  EN5:  { bg: "bg-violet-50",  border: "border-violet-200",  text: "text-violet-700" },
  FY1:  { bg: "bg-amber-50",   border: "border-amber-200",   text: "text-amber-700" },
  HI1B: { bg: "bg-sky-50",     border: "border-sky-200",     text: "text-sky-700" },
  SH1B: { bg: "bg-rose-50",    border: "border-rose-200",    text: "text-rose-700" },
  "":   { bg: "bg-stone-50",   border: "border-stone-200",   text: "text-stone-500" },
}

const lessons: Lesson[] = [
  { id:"l1", title:"Matematik 2b", courseCode:"MA2B", type:"lesson", day:0, startTime:"08:15", endTime:"09:15", room:"R201", teacher:"Maria Lindström" },
  { id:"l2", title:"Matematik 2b", courseCode:"MA2B", type:"lesson", day:0, startTime:"09:30", endTime:"10:30", room:"R201", teacher:"Maria Lindström" },
  { id:"l3", title:"Engelska 5",   courseCode:"EN5",  type:"lesson", day:0, startTime:"13:00", endTime:"14:00", room:"R108", teacher:"Karin Holm" },
  { id:"l4", title:"Mentorstid",   courseCode:"",     type:"mentor", day:0, startTime:"14:15", endTime:"15:00", room:"R201", teacher:"Maria Lindström" },

  { id:"l5", title:"Fysik 1 — Labb",  courseCode:"FY1", type:"lab",    day:1, startTime:"08:15", endTime:"09:15", room:"Labbsal A", teacher:"Per Ekström" },
  { id:"l6", title:"Fysik 1 — Labb",  courseCode:"FY1", type:"lab",    day:1, startTime:"09:30", endTime:"10:30", room:"Labbsal A", teacher:"Per Ekström" },
  { id:"l7", title:"Svenska 1",       courseCode:"SV1", type:"lesson", day:1, startTime:"12:15", endTime:"13:15", room:"R102", teacher:"Karin Holm" },
  { id:"l8", title:"Historia 1b",     courseCode:"HI1B",type:"lesson", day:1, startTime:"14:15", endTime:"15:15", room:"R102", teacher:"Karin Holm" },

  { id:"l9",  title:"Historia 1b",        courseCode:"HI1B",type:"lesson", day:2, startTime:"08:15", endTime:"09:15", room:"R102", teacher:"Karin Holm" },
  { id:"l10", title:"Matematik 2b",       courseCode:"MA2B",type:"lesson", day:2, startTime:"09:30", endTime:"10:30", room:"R201", teacher:"Maria Lindström" },
  { id:"l11", title:"Samhällskunskap 1b", courseCode:"SH1B",type:"lesson", day:2, startTime:"13:00", endTime:"14:00", room:"R112", teacher:"Anna Karlsson" },

  { id:"l12", title:"Engelska 5",          courseCode:"EN5", type:"lesson", day:3, startTime:"08:15", endTime:"09:15", room:"R108", teacher:"Karin Holm" },
  { id:"l13", title:"Samhällskunskap 1b",  courseCode:"SH1B",type:"lesson", day:3, startTime:"09:30", endTime:"10:30", room:"R112", teacher:"Anna Karlsson" },
  { id:"l14", title:"Svenska 1",           courseCode:"SV1", type:"lesson", day:3, startTime:"13:00", endTime:"14:00", room:"R102", teacher:"Karin Holm" },

  { id:"l15", title:"Matematik 2b", courseCode:"MA2B",type:"lesson", day:4, startTime:"08:15", endTime:"09:15", room:"R201", teacher:"Maria Lindström" },
  { id:"l16", title:"Svenska 1",    courseCode:"SV1", type:"lesson", day:4, startTime:"09:30", endTime:"10:30", room:"R102", teacher:"Karin Holm" },
  { id:"l17", title:"Historia 1b",  courseCode:"HI1B",type:"lesson", day:4, startTime:"13:00", endTime:"14:00", room:"R102", teacher:"Karin Holm" },
]

const daysShort = ["Mån", "Tis", "Ons", "Tors", "Fre"]
const daysFull = ["Måndag", "Tisdag", "Onsdag", "Torsdag", "Fredag"]
const dates = ["12 maj", "13 maj", "14 maj", "15 maj", "16 maj"]
const today = 2

function getColor(code: string) { return subjectColors[code] || subjectColors[""] }
function timeToMin(t: string) { const [h, m] = t.split(":").map(Number); return h * 60 + m }

function findLunch(dayLessons: Lesson[]): { after: string; before: string } | null {
  const sorted = [...dayLessons].sort((a, b) => a.startTime.localeCompare(b.startTime))
  let biggest = 0
  let result: { after: string; before: string } | null = null
  for (let i = 0; i < sorted.length - 1; i++) {
    const gap = timeToMin(sorted[i + 1].startTime) - timeToMin(sorted[i].endTime)
    if (gap > biggest && gap >= 30) { biggest = gap; result = { after: sorted[i].endTime, before: sorted[i + 1].startTime } }
  }
  return result
}

// Bygg alla unika tidpunkter (start + slut) → sorterade
function getAllTimes() {
  const times = new Set<string>()
  lessons.forEach(l => { times.add(l.startTime); times.add(l.endTime) })
  return [...times].sort()
}

type ViewMode = "week" | "day"

export default function CalendarPage() {
  const [view, setView] = useState<ViewMode>("day")
  const [selectedDay, setSelectedDay] = useState(today)

  const dayLessons = lessons.filter(l => l.day === selectedDay).sort((a, b) => a.startTime.localeCompare(b.startTime))
  const lunch = findLunch(dayLessons)
  const morningLessons = lunch ? dayLessons.filter(l => timeToMin(l.startTime) < timeToMin(lunch.before)) : dayLessons
  const afternoonLessons = lunch ? dayLessons.filter(l => timeToMin(l.startTime) >= timeToMin(lunch.before)) : []

  const allTimes = getAllTimes()

  function LessonCard({ ev }: { ev: Lesson }) {
    const c = getColor(ev.courseCode)
    return (
      <div className={`flex items-center rounded-xl border-2 ${c.border} ${c.bg}`}>
        <div className="w-24 shrink-0 py-4 pl-5">
          <p className="text-sm font-medium text-stone-700">{ev.startTime}</p>
          <p className="text-xs text-stone-400">{ev.endTime}</p>
        </div>
        <div className="flex-1 py-4 min-w-0">
          <div className="flex items-center gap-2">
            <p className={`text-sm font-semibold ${c.text}`}>{ev.title}</p>
            {ev.type === "lab" && <span className={`text-[9px] ${c.text} opacity-60 border ${c.border} rounded px-1.5 py-0.5`}>Labb</span>}
            {ev.type === "mentor" && <span className="text-[9px] text-stone-400 border border-stone-200 rounded px-1.5 py-0.5">Mentor</span>}
          </div>
          <p className="text-xs text-stone-400 mt-0.5">{ev.teacher}</p>
        </div>
        <div className="text-right shrink-0 pr-5 py-4">
          <p className="text-xs text-stone-500">{ev.room}</p>
          {ev.courseCode && <p className="text-[10px] font-mono text-stone-300 mt-0.5">{ev.courseCode}</p>}
        </div>
      </div>
    )
  }

  // Hitta vilken lektion som pågår vid en viss tid för en dag
  function getLessonAt(day: number, time: string) {
    return lessons.find(l => l.day === day && l.startTime === time)
  }

  // Kolla om en tid är en starttid för någon lektion den dagen
  function isStartTime(day: number, time: string) {
    return lessons.some(l => l.day === day && l.startTime === time)
  }

  // Kolla om en lektion pågår vid denna tid (inte start, inte slut, mitt i)
  function isOccupied(day: number, time: string) {
    return lessons.some(l => l.day === day && timeToMin(l.startTime) < timeToMin(time) && timeToMin(l.endTime) > timeToMin(time))
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

        {/* DAGVY */}
        {view === "day" && (<>
          <div className="flex gap-2 mb-8">
            {daysShort.map((d, i) => {
              const isSelected = i === selectedDay
              const isToday = i === today
              const count = lessons.filter(l => l.day === i).length
              return (
                <button key={d} onClick={() => setSelectedDay(i)}
                  className={`flex-1 py-3.5 rounded-xl text-center transition border ${
                    isSelected ? "border-stone-800 bg-stone-800"
                    : isToday ? "border-stone-400 bg-white"
                    : "border-stone-200 bg-white hover:border-stone-300"
                  }`}>
                  <p className={`text-sm font-medium ${isSelected ? "text-white" : isToday ? "text-stone-800" : "text-stone-500"}`}>{d}</p>
                  <p className={`text-[11px] mt-0.5 ${isSelected ? "text-white/50" : "text-stone-300"}`}>{dates[i]}</p>
                  <p className={`text-[10px] mt-1 ${isSelected ? "text-white/30" : "text-stone-300"}`}>{count} pass</p>
                </button>
              )
            })}
          </div>

          <p className="text-sm font-medium text-stone-800 mb-5">
            {daysFull[selectedDay]} {dates[selectedDay]}
            {selectedDay === today && <span className="text-[10px] bg-stone-800 text-white px-2 py-0.5 rounded-full ml-2">Idag</span>}
          </p>

          {dayLessons.length === 0 ? (
            <div className="bg-white border border-stone-200 rounded-xl p-12 text-center mb-10">
              <p className="text-sm text-stone-400">Inga lektioner denna dag.</p>
            </div>
          ) : (
            <div className="mb-10 space-y-3">
              {morningLessons.map(ev => <LessonCard key={ev.id} ev={ev} />)}
              {lunch && (
                <div className="flex items-center gap-4 py-2">
                  <div className="flex-1 h-px bg-stone-200" />
                  <p className="text-[11px] text-stone-300">Lunch · {lunch.after}–{lunch.before}</p>
                  <div className="flex-1 h-px bg-stone-200" />
                </div>
              )}
              {afternoonLessons.map(ev => <LessonCard key={ev.id} ev={ev} />)}
            </div>
          )}
        </>)}

        {/* VECKOVY */}
        {view === "week" && (
          <div className="bg-white border border-stone-200 rounded-xl overflow-hidden mb-10">

            {/* Header */}
            <div className="flex border-b border-stone-200 bg-stone-50">
              <div className="w-16 shrink-0" />
              {daysShort.map((d, i) => (
                <button key={d} onClick={() => { setSelectedDay(i); setView("day") }}
                  className={`flex-1 py-3 text-center border-l transition hover:bg-stone-100 ${
                    i === today ? "bg-stone-200/60 border-stone-200" : "border-stone-100"
                  }`}>
                  <p className={`text-xs ${i === today ? "text-stone-900 font-bold" : "text-stone-500 font-medium"}`}>{d}</p>
                  <p className={`text-xs mt-0.5 ${i === today ? "text-stone-600" : "text-stone-400"}`}>{dates[i]}</p>
                </button>
              ))}
            </div>

            {/* Tidslinjer med block */}
            <div className="relative">
              {allTimes.map((time, idx) => {
                const isLunchBreak = allTimes[idx - 1] && (timeToMin(time) - timeToMin(allTimes[idx - 1])) > 60
                const hasAnyLesson = [0,1,2,3,4].some(d => getLessonAt(d, time))
                const isAnyEnd = [0,1,2,3,4].some(d => lessons.some(l => l.day === d && l.endTime === time))
                const isOnlyEnd = isAnyEnd && !hasAnyLesson

                return (
                  <React.Fragment key={time}>
                    {/* Lunchlinje */}
                    {isLunchBreak && (
                      <div className="flex items-center bg-stone-50/80 py-2">
                        <div className="w-16 shrink-0 pr-2 text-right">
                          <p className="text-[10px] text-stone-300 font-medium">Lunch</p>
                        </div>
                        <div className="flex-1 h-px bg-stone-200" />
                      </div>
                    )}

                    {/* Tidslinje */}
                    <div className="flex items-start">
                      {/* Tidskolumn */}
                      <div className="w-16 shrink-0 pr-2 text-right" style={{ marginTop: -6 }}>
                        <p className={`text-xs ${hasAnyLesson || isOnlyEnd ? "text-stone-500 font-medium" : "text-stone-300"}`}>{time}</p>
                      </div>

                      {/* Linje + celler */}
                      <div className="flex-1">
                        <div className="border-t border-stone-100" />

                        {/* Block-rad — bara om det finns lektioner som startar här */}
                        {hasAnyLesson && (
                          <div className="flex">
                            {[0,1,2,3,4].map(day => {
                              const ev = getLessonAt(day, time)
                              if (!ev) return (
                                <div key={day} className={`flex-1 border-l h-16 ${
                                  day === today ? "bg-blue-50/30 border-blue-100" : "border-stone-50"
                                }`} />
                              )
                              const c = getColor(ev.courseCode)
                              return (
                                <div key={day} className={`flex-1 border-l p-1 ${
                                  day === today ? "bg-blue-50/30 border-blue-100" : "border-stone-50"
                                }`}>
                                  <button onClick={() => { setSelectedDay(day); setView("day") }}
                                    className={`w-full text-left px-3 py-2.5 rounded-lg border-l-[3px] h-full transition hover:shadow-md ${c.bg} ${c.border}`}>
                                    <p className={`text-xs font-semibold ${c.text} truncate`}>{ev.title}</p>
                                    <p className="text-[10px] text-stone-400 truncate mt-0.5">{ev.room}</p>
                                  </button>
                                </div>
                              )
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  </React.Fragment>
                )
              })}
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
                <div className={`w-3 h-2 rounded-sm border-2 ${c.bg} ${c.border}`} />
                {l.label}
              </span>
            )
          })}
        </div>

      </div>
    </div>
  )
}