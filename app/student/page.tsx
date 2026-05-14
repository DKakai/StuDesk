"use client"

import Link from "next/link"
import { useState } from "react"

type TodoItem = {
  id: string; title: string; courseCode: string
  type: "assignment" | "test" | "reading" | "lab" | "presentation"
  dueDate: string; dueDay: string; dueDetail: string; done: boolean
}

const initialTodos: TodoItem[] = [
  { id: "t1", title: "Övningsuppgifter — Andragradsekvationer", courseCode: "MA2B", type: "assignment", dueDate: "2026-05-15", dueDay: "Imorgon", dueDetail: "15 maj", done: false },
  { id: "t2", title: "Läs kapitel 8 — Krafter och rörelse", courseCode: "FY1", type: "reading", dueDate: "2026-05-16", dueDay: "Fredag", dueDetail: "16 maj", done: false },
  { id: "t3", title: "Prov — Andragradsekvationer", courseCode: "MA2B", type: "test", dueDate: "2026-05-19", dueDay: "Måndag", dueDetail: "19 maj", done: false },
  { id: "t4", title: "Inlämning — Argumenterande text", courseCode: "SV1", type: "assignment", dueDate: "2026-05-20", dueDay: "Tisdag", dueDetail: "20 maj", done: false },
  { id: "t5", title: "Labb — Kraftmätning", courseCode: "FY1", type: "lab", dueDate: "2026-05-21", dueDay: "Onsdag", dueDetail: "21 maj", done: false },
  { id: "t6", title: "Oral presentation — My future career", courseCode: "EN5", type: "presentation", dueDate: "2026-05-22", dueDay: "Torsdag", dueDetail: "22 maj", done: false },
  { id: "t7", title: "Läs kapitel 12 — Industriella revolutionen", courseCode: "HI1B", type: "reading", dueDate: "2026-05-16", dueDay: "Fredag", dueDetail: "16 maj", done: true },
  { id: "t8", title: "Quiz — Newtons lagar", courseCode: "FY1", type: "test", dueDate: "2026-05-14", dueDay: "Idag", dueDetail: "14 maj", done: true },
]

const courses = [
  { id: "matematik-2b", name: "Matematik 2b", code: "MA2B", teacher: "Maria Lindström", currentTopic: "Andragradsekvationer", todoCount: 2, image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&q=80" },
  { id: "svenska-1", name: "Svenska 1", code: "SV1", teacher: "Karin Holm", currentTopic: "Argumenterande text", todoCount: 1, image: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=600&q=80" },
  { id: "engelska-5", name: "Engelska 5", code: "EN5", teacher: "Karin Holm", currentTopic: "Oral presentation", todoCount: 1, image: "https://images.unsplash.com/photo-1543109740-4bdb38fda756?w=600&q=80" },
  { id: "fysik-1", name: "Fysik 1", code: "FY1", teacher: "Per Ekström", currentTopic: "Krafter och rörelse", todoCount: 2, image: "https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=600&q=80" },
  { id: "historia-1b", name: "Historia 1b", code: "HI1B", teacher: "Karin Holm", currentTopic: "Industriella revolutionen", todoCount: 0, image: "https://images.unsplash.com/photo-1461360370896-922624d12571?w=600&q=80" },
  { id: "samhallskunskap-1b", name: "Samhällskunskap 1b", code: "SH1B", teacher: "Anna Karlsson", currentTopic: "Demokrati och mänskliga rättigheter", todoCount: 0, image: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=600&q=80" },
]

const typeLabels: Record<string, string> = { assignment: "Uppgift", test: "Prov", reading: "Läsning", lab: "Labb", presentation: "Redovisning" }

export default function StudentHome() {
  const [todos, setTodos] = useState(initialTodos)
  const [showAllTodos, setShowAllTodos] = useState(false)

  function toggleTodo(id: string) { setTodos(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t)) }

  const activeTodos = todos.filter(t => !t.done).sort((a, b) => a.dueDate.localeCompare(b.dueDate))
  const doneTodos = todos.filter(t => t.done)
  const visibleTodos = showAllTodos ? activeTodos : activeTodos.slice(0, 2)
  const hiddenCount = activeTodos.length - 2

  return (
    <div className="flex-1 overflow-y-auto" style={{ fontFamily: 'var(--font-body)' }}>
      <div className="max-w-4xl mx-auto px-8">

        <div className="pt-10 pb-8">
          <h1 className="text-3xl tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>Hem</h1>
          <p className="text-sm text-stone-400 mt-1">Onsdag 14 maj 2026</p>
        </div>

        {/* ATT GÖRA */}
        <div className="mb-10">
          <p className="text-[10px] uppercase tracking-[0.15em] text-stone-400 mb-3 font-medium">Att göra</p>
          <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
            {visibleTodos.map((todo, i) => {
              const isUrgent = todo.dueDay === "Idag" || todo.dueDay === "Imorgon"
              return (
                <div key={todo.id} className={`flex items-center gap-4 px-5 py-3.5 ${i > 0 ? "border-t border-stone-100" : ""} hover:bg-stone-50 transition`}>
                  <button onClick={() => toggleTodo(todo.id)} className="w-5 h-5 rounded-full border-2 border-stone-300 hover:border-stone-500 transition shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-stone-800">{todo.title}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] font-mono text-stone-400">{todo.courseCode}</span>
                      <span className="text-[10px] text-stone-300">·</span>
                      <span className="text-[10px] text-stone-400">{typeLabels[todo.type]}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className={`text-xs ${isUrgent ? "text-red-500 font-medium" : "text-stone-500"}`}>{todo.dueDay}</p>
                    <p className="text-[10px] text-stone-300">{todo.dueDetail}</p>
                  </div>
                </div>
              )
            })}
            {!showAllTodos && hiddenCount > 0 && (
              <button onClick={() => setShowAllTodos(true)} className="w-full px-5 py-3 border-t border-stone-100 text-xs text-stone-400 hover:text-stone-600 hover:bg-stone-50 transition text-center">
                Visa {hiddenCount} till
              </button>
            )}
            {showAllTodos && activeTodos.length > 2 && (
              <button onClick={() => setShowAllTodos(false)} className="w-full px-5 py-3 border-t border-stone-100 text-xs text-stone-400 hover:text-stone-600 hover:bg-stone-50 transition text-center">
                Visa mindre
              </button>
            )}
            {activeTodos.length === 0 && (
              <div className="px-5 py-8 text-center"><p className="text-sm text-stone-400">Inga uppgifter att göra. Bra jobbat!</p></div>
            )}
          </div>
          {doneTodos.length > 0 && (
            <details className="mt-2">
              <summary className="text-xs text-stone-400 cursor-pointer hover:text-stone-600 transition px-1 py-1">{doneTodos.length} avklarade</summary>
              <div className="bg-white border border-stone-100 rounded-xl overflow-hidden mt-1">
                {doneTodos.map((todo, i) => (
                  <div key={todo.id} className={`flex items-center gap-4 px-5 py-3 ${i > 0 ? "border-t border-stone-50" : ""} opacity-50`}>
                    <button onClick={() => toggleTodo(todo.id)} className="w-5 h-5 rounded-full border-2 border-stone-300 bg-stone-200 flex items-center justify-center shrink-0">
                      <svg className="w-3 h-3 text-stone-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    </button>
                    <p className="text-sm text-stone-500 line-through flex-1">{todo.title}</p>
                  </div>
                ))}
              </div>
            </details>
          )}
        </div>

        {/* KURSER */}
        <div className="mb-10">
          <p className="text-[10px] uppercase tracking-[0.15em] text-stone-400 mb-3 font-medium">Mina kurser</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.map(course => (
              <Link key={course.id} href={`/student/courses/${course.id}`}
                className="bg-white border border-stone-200 rounded-xl overflow-hidden hover:border-stone-300 hover:shadow-sm transition group">
                <div className="h-24 relative overflow-hidden">
                  <div className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500" style={{ backgroundImage: `url('${course.image}')` }} />
                  <div className="absolute inset-0 bg-black/30" />
                  <div className="absolute bottom-3 left-4"><span className="text-white/70 text-[10px] font-mono">{course.code}</span></div>
                  {course.todoCount > 0 && (
                    <div className="absolute top-3 right-3 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-sm"><span className="text-[10px] font-medium text-stone-800">{course.todoCount}</span></div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-medium text-stone-800 group-hover:text-black transition">{course.name}</h3>
                  <p className="text-xs text-stone-400 mt-1">{course.teacher}</p>
                  <div className="flex items-center gap-1.5 mt-3">
                    <div className="w-1.5 h-1.5 bg-stone-300 rounded-full" />
                    <p className="text-[11px] text-stone-400">{course.currentTopic}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
