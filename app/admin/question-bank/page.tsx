"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface Question {
  id: string
  subject: string
  education_level: string
  question_type: string
  hardness: string
  question_text: string
  options: string[]
  created_at: string
}

export default function QuestionBank() {
  const router = useRouter()
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    subject: "",
    educationLevel: "",
    questionType: "",
  })

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        let url = "/api/admin/questions?"
        if (filters.subject) url += `subject=${filters.subject}&`
        if (filters.educationLevel) url += `educationLevel=${filters.educationLevel}&`
        if (filters.questionType) url += `questionType=${filters.questionType}&`

        const response = await fetch(url)
        const data = await response.json()

        if (response.ok) {
          setQuestions(data.questions)
        }
      } catch (err) {
        console.log("[v0] Fetch questions error:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchQuestions()
  }, [filters])

  const handleDeleteQuestion = async (questionId: string) => {
    if (!confirm("Are you sure you want to delete this question?")) return

    try {
      const response = await fetch(`/api/admin/questions/${questionId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setQuestions(questions.filter((q) => q.id !== questionId))
      }
    } catch (err) {
      console.log("[v0] Delete question error:", err)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Question Bank</h1>
          <div className="flex gap-2">
            <Link href="/admin/question-bank/add">
              <Button className="bg-accent text-accent-foreground hover:bg-accent/90">Add Question</Button>
            </Link>
            <Link href="/admin/dashboard">
              <Button variant="outline" className="text-primary border-primary-foreground bg-transparent">
                Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Filters */}
        <div className="bg-card border border-border rounded-lg p-6 mb-8">
          <h2 className="text-lg font-bold mb-4">Filter Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <select
              value={filters.subject}
              onChange={(e) => setFilters({ ...filters, subject: e.target.value })}
              className="border border-border rounded px-3 py-2"
            >
              <option value="">All Subjects</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Integrated Science">Integrated Science</option>
              <option value="Computer Knowledge">Computer Knowledge</option>
              <option value="Biology">Biology</option>
              <option value="Physics">Physics</option>
              <option value="Chemistry">Chemistry</option>
              <option value="ICT">ICT</option>
              <option value="Agriculture">Agriculture</option>
            </select>

            <select
              value={filters.educationLevel}
              onChange={(e) => setFilters({ ...filters, educationLevel: e.target.value })}
              className="border border-border rounded px-3 py-2"
            >
              <option value="">All Levels</option>
              <option value="Primary">Primary</option>
              <option value="O-level">O-level</option>
              <option value="A-level">A-level</option>
            </select>

            <select
              value={filters.questionType}
              onChange={(e) => setFilters({ ...filters, questionType: e.target.value })}
              className="border border-border rounded px-3 py-2"
            >
              <option value="">All Types</option>
              <option value="Quiz">Quiz</option>
              <option value="Theory">Theory</option>
              <option value="Practical">Practical</option>
            </select>
          </div>
        </div>

        {/* Questions List */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading questions...</p>
          </div>
        ) : questions.length === 0 ? (
          <div className="text-center py-12 bg-card border border-border rounded-lg">
            <p className="text-muted-foreground mb-4">No questions yet</p>
            <Link href="/admin/question-bank/add">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                Create Your First Question
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {questions.map((question) => (
              <div key={question.id} className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-2">{question.question_text}</h3>
                    <div className="flex flex-wrap gap-2">
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold">
                        {question.subject}
                      </span>
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold">
                        {question.education_level}
                      </span>
                      <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs font-semibold">
                        {question.question_type}
                      </span>
                      <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-semibold">
                        {question.hardness}
                      </span>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleDeleteQuestion(question.id)}
                    variant="outline"
                    className="text-red-600 hover:bg-red-50 ml-4"
                  >
                    Delete
                  </Button>
                </div>
                <div className="bg-muted p-4 rounded mt-4">
                  <p className="text-sm text-muted-foreground mb-2">Options:</p>
                  <ul className="space-y-1">
                    {question.options.map((option, idx) => (
                      <li
                        key={idx}
                        className={`text-sm ${idx === question.options.length - 1 ? "font-bold text-green-700" : ""}`}
                      >
                        {String.fromCharCode(65 + idx)}. {option}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
