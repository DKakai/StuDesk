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

// Bygg unika tidsslots från all data
function buildTimeSlots() {
  const allTimes = [...new Set(lessons.map(l => l.startTime))].sort()
  const morning = allTimes.filter(t => timeToMin(t) < 720)
  const afternoon = allTimes.filter(t => timeToMin(t) >= 720)
  return { morning, afternoon }
}

type ViewMode = "week" | "day"

export default function CalendarPage() {
  const [view, setView] = useState<ViewMode>("day")
  const [selectedDay, setSelectedDay] = useState(today)

  const dayLessons = lessons.filter(l => l.day === selectedDay).sort((a, b) => a.startTime.localeCompare(b.startTime))
  const lunch = findLunch(dayLessons)
  const morningLessons = lunch ? dayLessons.filter(l => timeToMin(l.startTime) < timeToMin(lunch.before)) : dayLessons
  const afternoonLessons = lunch ? dayLessons.filter(l => timeToMin(l.startTime) >= timeToMin(lunch.before)) : []

  const { morning, afternoon } = buildTimeSlots()

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

  function WeekCell({ day, time }: { day: number; time: string }) {
    const ev = lessons.find(l => l.day === day && l.startTime === time)
    if (!ev) return <td className={`px-1 py-1 ${day === today ? "bg-stone-50/80" : ""}`} />
    const c = getColor(ev.courseCode)
    return (
      <td className={`px-1 py-1 ${day === today ? "bg-stone-50/80" : ""}`}>
        <button onClick={() => { setSelectedDay(day); setView("day") }}
          className={`w-full text-left px-3 py-3 rounded-lg border-l-[3px] transition hover:shadow-md ${c.bg} ${c.border}`}>
          <p className={`text-sm font-semibold ${c.text} truncate`}>{ev.title}</p>
          <p className="text-xs text-stone-500 mt-1">{ev.startTime}–{ev.endTime}</p>
          <p className="text-xs text-stone-400 mt-0.5">{ev.room}</p>
        </button>
      </td>
    )
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
            <table className="w-full table-fixed">
              <thead>
                <tr className="border-b border-stone-200 bg-stone-50">
                  <th className="w-20 py-4 px-3 text-left">
                    <p className="text-xs text-stone-400">Tid</p>
                  </th>
                  {daysShort.map((d, i) => (
                    <th key={d} className={`py-4 px-1 text-center ${i === today ? "bg-stone-100" : ""}`}>
                      <button onClick={() => { setSelectedDay(i); setView("day") }} className="hover:opacity-70 transition">
                        <p className={`text-xs ${i === today ? "text-stone-800 font-semibold" : "text-stone-400"}`}>{d}</p>
                        <p className={`text-sm font-medium mt-0.5 ${i === today ? "text-stone-800" : "text-stone-600"}`}>{dates[i]}</p>
                      </button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* Förmiddag */}
                {morning.map(time => (
                  <tr key={time} className="border-b border-stone-50">
                    <td className="px-3 py-1 align-top pt-3">
                      <p className="text-sm text-stone-400">{time}</p>
                    </td>
                    {[0,1,2,3,4].map(day => <WeekCell key={day} day={day} time={time} />)}
                  </tr>
                ))}

                {/* Lunch */}
                <tr className="bg-stone-50/50">
                  <td className="px-3 py-3">
                    <p className="text-xs text-stone-400 font-medium">Lunch</p>
                  </td>
                  {[0,1,2,3,4].map(day => {
                    const dayL = lessons.filter(l => l.day === day).sort((a, b) => a.startTime.localeCompare(b.startTime))
                    const gap = findLunch(dayL)
                    return (
                      <td key={day} className={`px-2 py-3 text-center ${day === today ? "bg-stone-100/30" : ""}`}>
                        <p className="text-xs text-stone-300">{gap ? `${gap.after}–${gap.before}` : "—"}</p>
                      </td>
                    )
                  })}
                </tr>

                {/* Eftermiddag */}
                {afternoon.map(time => (
                  <tr key={time} className="border-b border-stone-50">
                    <td className="px-3 py-1 align-top pt-3">
                      <p className="text-sm text-stone-400">{time}</p>
                    </td>
                    {[0,1,2,3,4].map(day => <WeekCell key={day} day={day} time={time} />)}
                  </tr>
                ))}
              </tbody>
            </table>
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