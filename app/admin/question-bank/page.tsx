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
  question_format: string
  difficulty: string
  stage: string
  question_text: string
  options: string[] | null
  correct_answer: string | null
  marking_guide: string | null
  marks: number
  created_at: string
}

const FORMAT_COLORS: Record<string, string> = {
  Quiz: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  Theory: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  Practical: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
}

const DIFFICULTY_COLORS: Record<string, string> = {
  easy: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  hard: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
}

export default function QuestionBank() {
  const router = useRouter()
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [stats, setStats] = useState({ total: 0, quiz: 0, theory: 0, practical: 0 })
  const [filters, setFilters] = useState({
    subject: "",
    educationLevel: "",
    questionFormat: "",
    stage: "",
    difficulty: "",
  })

  useEffect(() => {
    fetchQuestions()
  }, [filters])

  const fetchQuestions = async () => {
    setLoading(true)
    setError("")
    try {
      const params = new URLSearchParams()
      if (filters.subject) params.append("subject", filters.subject)
      if (filters.educationLevel) params.append("educationLevel", filters.educationLevel)
      if (filters.questionFormat) params.append("questionFormat", filters.questionFormat)
      if (filters.stage) params.append("stage", filters.stage)
      if (filters.difficulty) params.append("difficulty", filters.difficulty)

      const response = await fetch(`/api/admin/questions?${params.toString()}`)
      const data = await response.json()

      if (response.ok) {
        const questionsList = data.questions || []
        setQuestions(questionsList)
        
        // Calculate stats
        setStats({
          total: questionsList.length,
          quiz: questionsList.filter((q: Question) => q.question_format === "Quiz").length,
          theory: questionsList.filter((q: Question) => q.question_format === "Theory").length,
          practical: questionsList.filter((q: Question) => q.question_format === "Practical").length,
        })
      } else {
        setError(data.error || "Failed to load questions")
      }
    } catch (err) {
      console.error("Fetch questions error:", err)
      setError("Failed to load questions")
    } finally {
      setLoading(false)
    }
  }

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
      console.error("Delete question error:", err)
    }
  }

  const clearFilters = () => {
    setFilters({
      subject: "",
      educationLevel: "",
      questionFormat: "",
      stage: "",
      difficulty: "",
    })
  }

  const parseOptions = (options: any): string[] => {
    if (!options) return []
    if (Array.isArray(options)) return options
    if (typeof options === "string") {
      try {
        return JSON.parse(options)
      } catch {
        return []
      }
    }
    return []
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Link href="/admin/dashboard" className="text-sm text-white/80 hover:text-white mb-2 block">
            ← Back to Dashboard
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <span className="text-4xl">📚</span>
                Question Bank
              </h1>
              <p className="text-white/80 mt-1">Manage questions for all stages and formats</p>
            </div>
            <Link href="/admin/question-bank/add">
              <Button className="bg-white text-purple-600 hover:bg-white/90 font-semibold">
                + Add Question
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 border rounded-lg p-4">
            <div className="text-2xl font-bold">{stats.total}</div>
            <div className="text-sm text-muted-foreground">Total Questions</div>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">{stats.quiz}</div>
            <div className="text-sm text-blue-600 dark:text-blue-400">Quiz Questions</div>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
            <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">{stats.theory}</div>
            <div className="text-sm text-purple-600 dark:text-purple-400">Theory Questions</div>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
            <div className="text-2xl font-bold text-orange-700 dark:text-orange-300">{stats.practical}</div>
            <div className="text-sm text-orange-600 dark:text-orange-400">Practical Questions</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-card border border-border rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">Filter Questions</h2>
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <select
              value={filters.educationLevel}
              onChange={(e) => setFilters({ ...filters, educationLevel: e.target.value })}
              className="border border-border rounded-lg px-3 py-2 bg-background"
            >
              <option value="">All Levels</option>
              <option value="Primary">Primary</option>
              <option value="O-Level">O-Level</option>
              <option value="A-Level">A-Level</option>
            </select>

            <select
              value={filters.subject}
              onChange={(e) => setFilters({ ...filters, subject: e.target.value })}
              className="border border-border rounded-lg px-3 py-2 bg-background"
            >
              <option value="">All Subjects</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Science">Science</option>
              <option value="Biology">Biology</option>
              <option value="Physics">Physics</option>
              <option value="Chemistry">Chemistry</option>
              <option value="ICT">ICT</option>
              <option value="Agriculture">Agriculture</option>
            </select>

            <select
              value={filters.questionFormat}
              onChange={(e) => setFilters({ ...filters, questionFormat: e.target.value })}
              className="border border-border rounded-lg px-3 py-2 bg-background"
            >
              <option value="">All Formats</option>
              <option value="Quiz">Quiz</option>
              <option value="Theory">Theory</option>
              <option value="Practical">Practical</option>
            </select>

            <select
              value={filters.stage}
              onChange={(e) => setFilters({ ...filters, stage: e.target.value })}
              className="border border-border rounded-lg px-3 py-2 bg-background"
            >
              <option value="">All Stages</option>
              <option value="Beginner">Beginner</option>
              <option value="Theory">Theory</option>
              <option value="Practical">Practical</option>
              <option value="Final">Final</option>
            </select>

            <select
              value={filters.difficulty}
              onChange={(e) => setFilters({ ...filters, difficulty: e.target.value })}
              className="border border-border rounded-lg px-3 py-2 bg-background"
            >
              <option value="">All Difficulties</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Questions List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading questions...</p>
          </div>
        ) : questions.length === 0 ? (
          <div className="text-center py-12 bg-card border border-dashed border-border rounded-lg">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-bold mb-2">No Questions Found</h3>
            <p className="text-muted-foreground mb-6">
              {Object.values(filters).some(f => f) 
                ? "Try adjusting your filters" 
                : "Start building your question bank"}
            </p>
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
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${FORMAT_COLORS[question.question_format] || "bg-gray-100 text-gray-800"}`}>
                        {question.question_format || "Quiz"}
                      </span>
                      <span className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200 px-3 py-1 rounded-full text-xs font-semibold">
                        {question.question_type}
                      </span>
                      <span className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200 px-3 py-1 rounded-full text-xs font-semibold">
                        {question.education_level}
                      </span>
                      <span className="bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200 px-3 py-1 rounded-full text-xs font-semibold">
                        {question.subject}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${DIFFICULTY_COLORS[question.difficulty] || "bg-gray-100 text-gray-800"}`}>
                        {question.difficulty}
                      </span>
                      <span className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200 px-3 py-1 rounded-full text-xs font-semibold">
                        {question.marks} mark{question.marks !== 1 ? "s" : ""}
                      </span>
                    </div>
                    <h3 className="font-medium text-lg">{question.question_text}</h3>
                  </div>
                  <Button
                    onClick={() => handleDeleteQuestion(question.id)}
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 ml-4"
                  >
                    Delete
                  </Button>
                </div>

                {/* Quiz: Show options */}
                {question.question_format === "Quiz" && question.options && (
                  <div className="bg-muted p-4 rounded-lg mt-4">
                    <p className="text-sm font-medium text-muted-foreground mb-2">Options:</p>
                    <ul className="space-y-1">
                      {parseOptions(question.options).map((option, idx) => (
                        <li
                          key={idx}
                          className={`text-sm flex items-center gap-2 ${
                            option === question.correct_answer 
                              ? "font-bold text-green-700 dark:text-green-400" 
                              : ""
                          }`}
                        >
                          <span className="w-6">{String.fromCharCode(65 + idx)}.</span>
                          {option}
                          {option === question.correct_answer && <span className="text-green-600">✓</span>}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Theory/Practical: Show marking guide preview */}
                {(question.question_format === "Theory" || question.question_format === "Practical") && question.marking_guide && (
                  <div className="bg-muted p-4 rounded-lg mt-4">
                    <p className="text-sm font-medium text-muted-foreground mb-2">Marking Guide:</p>
                    <p className="text-sm line-clamp-3">{question.marking_guide}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
