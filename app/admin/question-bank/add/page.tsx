"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function AddQuestion() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    subject: "",
    educationLevel: "Primary",
    questionType: "Quiz",
    hardness: "1-star",
    questionText: "",
    options: ["", "", "", ""],
    correctOption: 0,
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: name === "correctOption" ? Number.parseInt(value) : value,
    })
  }

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...formData.options]
    newOptions[index] = value
    setFormData({
      ...formData,
      options: newOptions,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!formData.subject || !formData.questionText || formData.options.some((o) => !o)) {
      setError("All fields are required")
      return
    }

    setLoading(true)

    try {
      const response = await fetch("/api/admin/questions/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Failed to create question")
        return
      }

      router.push("/admin/question-bank")
    } catch (err) {
      setError("An error occurred")
      console.log("[v0] Create question error:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Add Question</h1>
          <Link href="/admin/question-bank">
            <Button variant="outline" className="text-primary border-primary-foreground bg-transparent">
              Back to Question Bank
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 py-12">
        <div className="bg-card border border-border rounded-lg p-8">
          {error && <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Subject</label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full border border-border rounded px-3 py-2"
                  required
                >
                  <option value="">Select Subject</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Integrated Science">Integrated Science</option>
                  <option value="Computer Knowledge">Computer Knowledge</option>
                  <option value="Biology">Biology</option>
                  <option value="Physics">Physics</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="ICT">ICT</option>
                  <option value="Agriculture">Agriculture</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Education Level</label>
                <select
                  name="educationLevel"
                  value={formData.educationLevel}
                  onChange={handleChange}
                  className="w-full border border-border rounded px-3 py-2"
                  required
                >
                  <option value="Primary">Primary</option>
                  <option value="O-level">O-level</option>
                  <option value="A-level">A-level</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Question Type</label>
                <select
                  name="questionType"
                  value={formData.questionType}
                  onChange={handleChange}
                  className="w-full border border-border rounded px-3 py-2"
                  required
                >
                  <option value="Quiz">Quiz</option>
                  <option value="Theory">Theory</option>
                  <option value="Practical">Practical</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Difficulty Level</label>
                <select
                  name="hardness"
                  value={formData.hardness}
                  onChange={handleChange}
                  className="w-full border border-border rounded px-3 py-2"
                  required
                >
                  <option value="1-star">1-star (Easy)</option>
                  <option value="2-star">2-star (Medium)</option>
                  <option value="3-star">3-star (Hard)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Question</label>
              <textarea
                name="questionText"
                value={formData.questionText}
                onChange={handleChange}
                placeholder="Enter the question text"
                className="w-full border border-border rounded px-3 py-2 min-h-24"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-4">Options</label>
              <div className="space-y-3">
                {formData.options.map((option, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <span className="font-semibold text-primary w-8">{String.fromCharCode(65 + index)}.</span>
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                      placeholder={`Option ${index + 1}`}
                      className="flex-1 border border-border rounded px-3 py-2"
                      required
                    />
                    <input
                      type="radio"
                      name="correctOption"
                      value={index}
                      checked={formData.correctOption === index}
                      onChange={(e) => setFormData({ ...formData, correctOption: Number.parseInt(e.target.value) })}
                      title="Mark as correct answer"
                    />
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-2">Select the radio button for the correct answer</p>
            </div>

            <div className="flex gap-4">
              <Button
                type="submit"
                disabled={loading}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {loading ? "Creating..." : "Create Question"}
              </Button>
              <Link href="/admin/question-bank">
                <Button variant="outline">Cancel</Button>
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
