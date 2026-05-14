"use client"

import { useState, useRef, useEffect } from "react"
import { useParams } from "next/navigation"

type Message = { role: "user" | "assistant"; content: string }

const courseInfo: Record<string, { name: string; code: string; topic: string; grade: string; target: string; mastery: number }> = {
  "matematik-2b": { name: "Matematik 2b", code: "MA2B", topic: "Andragradsekvationer", grade: "C", target: "B", mastery: 45 },
  "svenska-1": { name: "Svenska 1", code: "SV1", topic: "Argumenterande text", grade: "B", target: "A", mastery: 62 },
  "engelska-5": { name: "Engelska 5", code: "EN5", topic: "Oral presentation", grade: "A", target: "A", mastery: 71 },
  "fysik-1": { name: "Fysik 1", code: "FY1", topic: "Krafter och rörelse", grade: "D", target: "C", mastery: 28 },
  "historia-1b": { name: "Historia 1b", code: "HI1B", topic: "Industriella revolutionen", grade: "C", target: "C", mastery: 53 },
}

const quickPrompts: Record<string, string[]> = {
  "matematik-2b": ["Förklara pq-formeln steg för steg", "Ge mig en övningsuppgift", "Vad krävs för betyg B?"],
  "svenska-1": ["Hur skriver jag en bra tes?", "Ge feedback på min text", "Vad krävs för betyg A?"],
  "engelska-5": ["Help me practice my presentation", "Explain grammar rules", "What do I need for grade A?"],
  "fysik-1": ["Förklara Newtons andra lag", "Ge mig en räkneuppgift", "Vad krävs för betyg C?"],
  "historia-1b": ["Vad orsakade industriella revolutionen?", "Hjälp mig jämföra epoker", "Vad krävs för betyg C?"],
}

export default function CoursePage() {
  const params = useParams()
  const courseId = params.courseId as string
  const info = courseInfo[courseId] ?? { name: courseId, code: "—", topic: "—", grade: "—", target: "—", mastery: 0 }
  const prompts = quickPrompts[courseId] ?? ["Hjälp mig förstå ämnet", "Ge mig en uppgift", "Vad krävs?"]

  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: `Hej! Jag är din AI-tutor för ${info.name}. Just nu jobbar vi med ${info.topic}. Vad vill du ha hjälp med?` },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [conversationId, setConversationId] = useState<string | null>(null)
  const chatEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }) }, [messages])
  useEffect(() => {
    if (textareaRef.current) { textareaRef.current.style.height = "24px"; textareaRef.current.style.height = textareaRef.current.scrollHeight + "px" }
  }, [input])

  async function sendMessage() {
    const text = input.trim()
    if (!text || isLoading) return
    setMessages(prev => [...prev, { role: "user", content: text }])
    setInput("")
    setIsLoading(true)
    try {
      const res = await fetch("/api/chat", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, conversationId, courseId, topicId: null, studentId: "demo-student" }),
      })
      const data = await res.json()
      if (data.error) { setMessages(prev => [...prev, { role: "assistant", content: data.error }]) }
      else { setConversationId(data.conversationId); setMessages(prev => [...prev, { role: "assistant", content: data.message }]) }
    } catch { setMessages(prev => [...prev, { role: "assistant", content: "Kunde inte nå servern." }]) }
    finally { setIsLoading(false) }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage() }
  }

  const gradeColor = info.grade === "A" || info.grade === "B" ? "text-emerald-600" : info.grade === "C" ? "text-stone-800" : "text-amber-600"

  return (
    <div className="flex-1 flex flex-col h-full" style={{ fontFamily: 'var(--font-body)' }}>

      {/* Header */}
      <div className="bg-white border-b border-stone-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-mono bg-stone-100 text-stone-500 px-2 py-1 rounded">{info.code}</span>
          <div>
            <h1 className="text-sm font-medium text-stone-800">{info.name}</h1>
            <p className="text-xs text-stone-400">{info.topic}</p>
          </div>
        </div>
        <div className="flex items-center gap-5">
          <div className="text-right">
            <p className="text-[10px] text-stone-400 uppercase tracking-widest">Prognos</p>
            <p className={`text-lg font-medium tracking-tight ${gradeColor}`}>{info.grade}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-stone-400 uppercase tracking-widest">Mål</p>
            <p className="text-lg font-medium tracking-tight text-stone-800">{info.target}</p>
          </div>
          <div className="w-20">
            <p className="text-[10px] text-stone-400 uppercase tracking-widest mb-1">Mastery</p>
            <div className="h-1 bg-stone-100 rounded-full overflow-hidden">
              <div className="h-full bg-stone-800 rounded-full" style={{ width: `${info.mastery}%` }} />
            </div>
            <p className="text-[10px] text-stone-400 text-right mt-0.5">{info.mastery}%</p>
          </div>
        </div>
      </div>

      {/* Chat */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-medium shrink-0 ${
              msg.role === "assistant" ? "bg-stone-800 text-white" : "bg-stone-200 text-stone-600"
            }`}>
              {msg.role === "assistant" ? "AI" : "Du"}
            </div>
            <div className={`max-w-[75%] px-4 py-3 text-sm leading-relaxed ${
              msg.role === "assistant"
                ? "bg-white border border-stone-200 rounded-2xl rounded-tl-md text-stone-700"
                : "bg-stone-800 text-white rounded-2xl rounded-tr-md"
            }`}>
              {msg.role === "assistant" && <p className="text-[10px] text-stone-400 uppercase tracking-widest mb-1">StuDesk AI</p>}
              <div className="whitespace-pre-wrap">{msg.content}</div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3">
            <div className="w-7 h-7 rounded-full bg-stone-800 text-white flex items-center justify-center text-[10px] font-medium shrink-0">AI</div>
            <div className="bg-white border border-stone-200 rounded-2xl rounded-tl-md px-4 py-3 flex gap-1">
              <div className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce" />
              <div className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
              <div className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <div className="px-6 py-4 border-t border-stone-100 bg-white">
        <div className="flex gap-2 mb-3">
          {prompts.map((p, i) => (
            <button key={i} onClick={() => setInput(p)}
              className="text-xs text-stone-500 border border-stone-200 px-3 py-1.5 rounded-full hover:bg-stone-50 hover:border-stone-300 transition truncate">
              {p}
            </button>
          ))}
        </div>
        <div className="flex items-end gap-2 bg-stone-50 border border-stone-200 rounded-xl p-2 focus-within:ring-1 focus-within:ring-stone-900 focus-within:border-stone-900 transition">
          <textarea ref={textareaRef} value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKeyDown}
            placeholder="Skriv din fråga..."
            rows={1}
            className="flex-1 bg-transparent border-none outline-none text-sm text-stone-800 placeholder-stone-400 px-2 py-1.5 resize-none max-h-32 overflow-y-auto"
            style={{ minHeight: "24px" }} />
          <button onClick={sendMessage} disabled={isLoading || !input.trim()}
            className="p-2 bg-stone-800 text-white rounded-lg hover:bg-black transition shrink-0 disabled:opacity-30">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" /></svg>
          </button>
        </div>
      </div>
    </div>
  )
}