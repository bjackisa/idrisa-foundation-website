"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface Question {
  id: string
  question_text: string
  options: string[]
  correct_option: number
}

interface ExamData {
  questions: Question[]
  duration: number
  phase: string
}

export default function ExamPage() {
  const params = useParams()
  const olympiadId = params.olympiadId as string
  const studentId = params.studentId as string

  const [exam, setExam] = useState<ExamData | null>(null)
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchExam = async () => {
      try {
        const response = await fetch(`/api/participant/exam/${olympiadId}/${studentId}`)
        const data = await response.json()

        if (response.ok) {
          setExam(data)
          setTimeRemaining(data.duration * 60) // Convert minutes to seconds
        }
      } catch (err) {
        console.log("[v0] Fetch exam error:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchExam()
  }, [olympiadId, studentId])

  // Timer effect
  useEffect(() => {
    if (!timeRemaining || timeRemaining <= 0 || submitted) return

    const timer = setInterval(() => {
      setTimeRemaining((prev) => (prev && prev > 0 ? prev - 1 : 0))
    }, 1000)

    // Auto-submit when time runs out
    if (timeRemaining === 0) {
      handleSubmit()
    }

    return () => clearInterval(timer)
  }, [timeRemaining, submitted])

  const handleAnswerChange = (questionId: string, optionIndex: number) => {
    setAnswers({
      ...answers,
      [questionId]: optionIndex,
    })
  }

  const handleSubmit = async () => {
    if (submitted) return

    try {
      const response = await fetch(`/api/participant/exam/${olympiadId}/${studentId}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      })

      if (response.ok) {
        setSubmitted(true)
      }
    } catch (err) {
      console.log("[v0] Submit exam error:", err)
    }
  }

  if (loading) {
    return <div className="text-center py-12">Loading exam...</div>
  }

  if (!exam) {
    return <div className="text-center py-12 text-red-600">Failed to load exam</div>
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="bg-card border border-border rounded-lg p-8 max-w-md text-center">
          <h2 className="text-2xl font-bold mb-4">Exam Submitted!</h2>
          <p className="text-muted-foreground mb-6">
            Your answers have been recorded. Your results will be available after the competition phase ends.
          </p>
          <Link href="/participant/dashboard">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 w-full">
              Return to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const currentQuestion = exam.questions[currentQuestionIndex]
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header with Timer */}
      <header className="bg-primary text-primary-foreground sticky top-0 z-50 shadow-md">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{exam.phase} Exam</h1>
            <p className="text-sm text-primary-foreground/80">
              Question {currentQuestionIndex + 1} of {exam.questions.length}
            </p>
          </div>
          <div
            className={`text-3xl font-bold px-6 py-2 rounded-lg ${timeRemaining && timeRemaining < 300 ? "bg-red-600" : "bg-primary-foreground/20"}`}
          >
            {timeRemaining !== null ? formatTime(timeRemaining) : "Loading..."}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-card border border-border rounded-lg p-8 mb-6">
          <h2 className="text-xl font-bold mb-6">{currentQuestion.question_text}</h2>

          <div className="space-y-4">
            {currentQuestion.options.map((option, index) => (
              <label
                key={index}
                className="flex items-start gap-4 p-4 border border-border rounded-lg cursor-pointer hover:bg-muted transition"
              >
                <input
                  type="radio"
                  name={currentQuestion.id}
                  value={index}
                  checked={answers[currentQuestion.id] === index}
                  onChange={() => handleAnswerChange(currentQuestion.id, index)}
                  className="mt-1"
                />
                <span className="text-lg">
                  <strong>{String.fromCharCode(65 + index)}.</strong> {option}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex gap-4 justify-between">
          <Button
            onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
            disabled={currentQuestionIndex === 0}
            variant="outline"
          >
            Previous
          </Button>

          <div className="text-sm text-muted-foreground">
            {currentQuestionIndex + 1} / {exam.questions.length} answered
          </div>

          {currentQuestionIndex === exam.questions.length - 1 ? (
            <Button onClick={handleSubmit} className="bg-green-600 text-white hover:bg-green-700">
              Submit Exam
            </Button>
          ) : (
            <Button
              onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Next
            </Button>
          )}
        </div>

        {/* Question Progress */}
        <div className="mt-8">
          <p className="text-sm font-semibold mb-3">Question Progress</p>
          <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
            {exam.questions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentQuestionIndex(idx)}
                className={`w-8 h-8 rounded text-xs font-semibold transition ${
                  idx === currentQuestionIndex
                    ? "bg-primary text-white"
                    : answers[q.id] !== undefined
                      ? "bg-green-500 text-white"
                      : "bg-muted text-muted-foreground"
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
