"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const SUBJECTS_BY_LEVEL: Record<string, string[]> = {
  Primary: ["Mathematics", "Science", "ICT"],
  "O-Level": ["Mathematics", "Biology", "Chemistry", "Physics", "ICT", "Agriculture"],
  "A-Level": ["Mathematics", "Biology", "Chemistry", "Physics", "ICT", "Agriculture"],
}

const QUESTION_TYPES_BY_FORMAT: Record<string, { value: string; label: string }[]> = {
  Quiz: [
    { value: "MCQ", label: "Multiple Choice (Single Answer)" },
    { value: "MULTIPLE_SELECT", label: "Multiple Choice (Multiple Answers)" },
    { value: "TRUE_FALSE", label: "True/False" },
    { value: "NUMERIC", label: "Numeric Answer" },
  ],
  Theory: [
    { value: "SHORT_ANSWER", label: "Short Answer" },
    { value: "ESSAY", label: "Essay/Long Answer" },
    { value: "STRUCTURED", label: "Structured (Multi-part)" },
  ],
  Practical: [
    { value: "FILE_UPLOAD", label: "File Upload" },
    { value: "ESSAY", label: "Written Report" },
    { value: "STRUCTURED", label: "Structured Task" },
  ],
}

const STAGES = ["Beginner", "Theory", "Practical", "Final"]

export default function AddQuestion() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    subject: "",
    educationLevel: "Primary",
    questionFormat: "Quiz",
    questionType: "MCQ",
    stage: "Beginner",
    difficulty: "medium",
    questionText: "",
    options: ["", "", "", ""],
    correctOption: 0,
    correctOptions: [] as number[],
    correctAnswer: "",
    markingGuide: "",
    wordLimit: 500,
    fileTypes: ["pdf", "doc", "docx"],
    maxFileSize: 10,
    subQuestions: [{ text: "", marks: 1 }],
    explanation: "",
    marks: 1,
    topic: "",
    subtopic: "",
  })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    
    // Reset question type when format changes
    if (name === "questionFormat") {
      const newTypes = QUESTION_TYPES_BY_FORMAT[value]
      setFormData({
        ...formData,
        [name]: value,
        questionType: newTypes[0]?.value || "MCQ",
      })
    } else if (name === "educationLevel") {
      // Reset subject when level changes
      setFormData({
        ...formData,
        [name]: value,
        subject: "",
      })
    } else {
      setFormData({
        ...formData,
        [name]: name === "correctOption" || name === "marks" || name === "wordLimit" || name === "maxFileSize" 
          ? Number(value) 
          : value,
      })
    }
  }

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...formData.options]
    newOptions[index] = value
    setFormData({ ...formData, options: newOptions })
  }

  const addOption = () => {
    setFormData({ ...formData, options: [...formData.options, ""] })
  }

  const removeOption = (index: number) => {
    if (formData.options.length <= 2) return
    const newOptions = formData.options.filter((_, i) => i !== index)
    setFormData({ 
      ...formData, 
      options: newOptions,
      correctOption: formData.correctOption >= newOptions.length ? 0 : formData.correctOption
    })
  }

  const handleMultiSelectToggle = (index: number) => {
    const current = formData.correctOptions
    if (current.includes(index)) {
      setFormData({ ...formData, correctOptions: current.filter(i => i !== index) })
    } else {
      setFormData({ ...formData, correctOptions: [...current, index] })
    }
  }

  const handleSubQuestionChange = (index: number, field: string, value: string | number) => {
    const newSubQuestions = [...formData.subQuestions]
    newSubQuestions[index] = { ...newSubQuestions[index], [field]: value }
    setFormData({ ...formData, subQuestions: newSubQuestions })
  }

  const addSubQuestion = () => {
    setFormData({ 
      ...formData, 
      subQuestions: [...formData.subQuestions, { text: "", marks: 1 }] 
    })
  }

  const removeSubQuestion = (index: number) => {
    if (formData.subQuestions.length <= 1) return
    setFormData({ 
      ...formData, 
      subQuestions: formData.subQuestions.filter((_, i) => i !== index) 
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    // Validation based on question format
    if (!formData.subject || !formData.questionText) {
      setError("Subject and question text are required")
      return
    }

    if (formData.questionFormat === "Quiz") {
      if (formData.questionType === "MCQ" || formData.questionType === "MULTIPLE_SELECT") {
        if (formData.options.some(o => !o.trim())) {
          setError("All options must be filled")
          return
        }
        if (formData.questionType === "MULTIPLE_SELECT" && formData.correctOptions.length < 1) {
          setError("Select at least one correct answer")
          return
        }
      }
      if (formData.questionType === "NUMERIC" && !formData.correctAnswer) {
        setError("Numeric answer is required")
        return
      }
    }

    if ((formData.questionFormat === "Theory" || formData.questionFormat === "Practical") && !formData.markingGuide) {
      setError("Marking guide is required for Theory/Practical questions")
      return
    }

    setLoading(true)

    try {
      // Build request body based on question format
      const body: any = {
        questionText: formData.questionText,
        questionFormat: formData.questionFormat,
        questionType: formData.questionType,
        subject: formData.subject,
        educationLevel: formData.educationLevel,
        stage: formData.stage,
        difficulty: formData.difficulty,
        marks: formData.marks,
        explanation: formData.explanation,
        topic: formData.topic,
        subtopic: formData.subtopic,
      }

      // Add format-specific fields
      if (formData.questionFormat === "Quiz") {
        if (formData.questionType === "MCQ" || formData.questionType === "MULTIPLE_SELECT" || formData.questionType === "TRUE_FALSE") {
          body.options = formData.questionType === "TRUE_FALSE" ? ["True", "False"] : formData.options
          if (formData.questionType === "MULTIPLE_SELECT") {
            body.correct_answers = formData.correctOptions.map(i => formData.options[i])
          } else if (formData.questionType === "TRUE_FALSE") {
            body.correctOption = formData.correctOption
          } else {
            body.correctOption = formData.correctOption
          }
        } else if (formData.questionType === "NUMERIC") {
          body.correctAnswer = formData.correctAnswer
        }
      } else if (formData.questionFormat === "Theory") {
        body.markingGuide = formData.markingGuide
        body.wordLimit = formData.wordLimit
        if (formData.questionType === "STRUCTURED") {
          body.subQuestions = formData.subQuestions
        }
      } else if (formData.questionFormat === "Practical") {
        body.markingGuide = formData.markingGuide
        if (formData.questionType === "FILE_UPLOAD") {
          body.fileTypes = formData.fileTypes
          body.maxFileSize = formData.maxFileSize
        }
        if (formData.questionType === "STRUCTURED") {
          body.subQuestions = formData.subQuestions
        }
      }

      const response = await fetch("/api/admin/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Failed to create question")
        return
      }

      setSuccess("Question created successfully!")
      setTimeout(() => router.push("/admin/question-bank"), 1500)
    } catch (err) {
      setError("An error occurred while creating the question")
      console.error("Create question error:", err)
    } finally {
      setLoading(false)
    }
  }

  const availableSubjects = SUBJECTS_BY_LEVEL[formData.educationLevel] || []
  const availableQuestionTypes = QUESTION_TYPES_BY_FORMAT[formData.questionFormat] || []

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <Link href="/admin/question-bank" className="text-sm text-white/80 hover:text-white mb-1 block">
              ← Back to Question Bank
            </Link>
            <h1 className="text-2xl font-bold">Add New Question</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-card border border-border rounded-lg p-8">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 p-4 rounded-lg mb-6 flex items-center gap-2">
              <span>❌</span> {error}
            </div>
          )}
          {success && (
            <div className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 p-4 rounded-lg mb-6 flex items-center gap-2">
              <span>✅</span> {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Info Section */}
            <div className="space-y-4">
              <h2 className="text-lg font-bold border-b pb-2">Basic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Education Level *</label>
                  <select
                    name="educationLevel"
                    value={formData.educationLevel}
                    onChange={handleChange}
                    className="w-full border border-border rounded-lg px-3 py-2 bg-background"
                    required
                  >
                    <option value="Primary">Primary</option>
                    <option value="O-Level">O-Level</option>
                    <option value="A-Level">A-Level</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Subject *</label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full border border-border rounded-lg px-3 py-2 bg-background"
                    required
                  >
                    <option value="">Select Subject</option>
                    {availableSubjects.map(subject => (
                      <option key={subject} value={subject}>{subject}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Stage *</label>
                  <select
                    name="stage"
                    value={formData.stage}
                    onChange={handleChange}
                    className="w-full border border-border rounded-lg px-3 py-2 bg-background"
                    required
                  >
                    {STAGES.map(stage => (
                      <option key={stage} value={stage}>{stage}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Question Format Section */}
            <div className="space-y-4">
              <h2 className="text-lg font-bold border-b pb-2">Question Format</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Format *</label>
                  <div className="flex gap-2">
                    {["Quiz", "Theory", "Practical"].map(format => (
                      <button
                        key={format}
                        type="button"
                        onClick={() => handleChange({ target: { name: "questionFormat", value: format } } as any)}
                        className={`flex-1 py-2 px-3 rounded-lg border text-sm font-medium transition ${
                          formData.questionFormat === format
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-background border-border hover:bg-muted"
                        }`}
                      >
                        {format}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Question Type *</label>
                  <select
                    name="questionType"
                    value={formData.questionType}
                    onChange={handleChange}
                    className="w-full border border-border rounded-lg px-3 py-2 bg-background"
                    required
                  >
                    {availableQuestionTypes.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Difficulty *</label>
                  <select
                    name="difficulty"
                    value={formData.difficulty}
                    onChange={handleChange}
                    className="w-full border border-border rounded-lg px-3 py-2 bg-background"
                    required
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Question Text */}
            <div className="space-y-4">
              <h2 className="text-lg font-bold border-b pb-2">Question Content</h2>
              <div>
                <label className="block text-sm font-medium mb-2">Question Text *</label>
                <textarea
                  name="questionText"
                  value={formData.questionText}
                  onChange={handleChange}
                  placeholder="Enter the question text..."
                  className="w-full border border-border rounded-lg px-3 py-2 min-h-32 bg-background"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Marks</label>
                  <input
                    type="number"
                    name="marks"
                    value={formData.marks}
                    onChange={handleChange}
                    min="1"
                    className="w-full border border-border rounded-lg px-3 py-2 bg-background"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Topic (Optional)</label>
                  <input
                    type="text"
                    name="topic"
                    value={formData.topic}
                    onChange={handleChange}
                    placeholder="e.g., Algebra, Photosynthesis"
                    className="w-full border border-border rounded-lg px-3 py-2 bg-background"
                  />
                </div>
              </div>
            </div>

            {/* Quiz-specific: Options */}
            {formData.questionFormat === "Quiz" && (formData.questionType === "MCQ" || formData.questionType === "MULTIPLE_SELECT") && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold border-b pb-2">Answer Options</h2>
                <div className="space-y-3">
                  {formData.options.map((option, index) => (
                    <div key={index} className="flex gap-2 items-center">
                      <span className="font-semibold text-primary w-8">{String.fromCharCode(65 + index)}.</span>
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => handleOptionChange(index, e.target.value)}
                        placeholder={`Option ${index + 1}`}
                        className="flex-1 border border-border rounded-lg px-3 py-2 bg-background"
                        required
                      />
                      {formData.questionType === "MULTIPLE_SELECT" ? (
                        <input
                          type="checkbox"
                          checked={formData.correctOptions.includes(index)}
                          onChange={() => handleMultiSelectToggle(index)}
                          className="w-5 h-5"
                          title="Mark as correct"
                        />
                      ) : (
                        <input
                          type="radio"
                          name="correctOption"
                          value={index}
                          checked={formData.correctOption === index}
                          onChange={handleChange}
                          className="w-5 h-5"
                          title="Mark as correct"
                        />
                      )}
                      {formData.options.length > 2 && (
                        <button
                          type="button"
                          onClick={() => removeOption(index)}
                          className="text-red-500 hover:text-red-700 px-2"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <Button type="button" variant="outline" onClick={addOption} className="text-sm">
                  + Add Option
                </Button>
                <p className="text-xs text-muted-foreground">
                  {formData.questionType === "MULTIPLE_SELECT" 
                    ? "Check all correct answers" 
                    : "Select the radio button for the correct answer"}
                </p>
              </div>
            )}

            {/* Quiz-specific: True/False */}
            {formData.questionFormat === "Quiz" && formData.questionType === "TRUE_FALSE" && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold border-b pb-2">Correct Answer</h2>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="correctOption"
                      value={0}
                      checked={formData.correctOption === 0}
                      onChange={handleChange}
                      className="w-5 h-5"
                    />
                    <span className="font-medium">True</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="correctOption"
                      value={1}
                      checked={formData.correctOption === 1}
                      onChange={handleChange}
                      className="w-5 h-5"
                    />
                    <span className="font-medium">False</span>
                  </label>
                </div>
              </div>
            )}

            {/* Quiz-specific: Numeric */}
            {formData.questionFormat === "Quiz" && formData.questionType === "NUMERIC" && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold border-b pb-2">Correct Answer</h2>
                <div>
                  <label className="block text-sm font-medium mb-2">Numeric Answer *</label>
                  <input
                    type="text"
                    name="correctAnswer"
                    value={formData.correctAnswer}
                    onChange={handleChange}
                    placeholder="Enter the correct numeric answer"
                    className="w-full border border-border rounded-lg px-3 py-2 bg-background"
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Enter the exact numeric value (e.g., 42, 3.14, -5)
                  </p>
                </div>
              </div>
            )}

            {/* Theory/Practical: Marking Guide */}
            {(formData.questionFormat === "Theory" || formData.questionFormat === "Practical") && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold border-b pb-2">Marking Guide</h2>
                <div>
                  <label className="block text-sm font-medium mb-2">Marking Guide / Model Answer *</label>
                  <textarea
                    name="markingGuide"
                    value={formData.markingGuide}
                    onChange={handleChange}
                    placeholder="Enter the marking guide or model answer for markers..."
                    className="w-full border border-border rounded-lg px-3 py-2 min-h-32 bg-background"
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    This will be shown to markers when grading student responses
                  </p>
                </div>

                {formData.questionFormat === "Theory" && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Word Limit</label>
                    <input
                      type="number"
                      name="wordLimit"
                      value={formData.wordLimit}
                      onChange={handleChange}
                      min="50"
                      className="w-full border border-border rounded-lg px-3 py-2 bg-background"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Practical: File Upload */}
            {formData.questionFormat === "Practical" && formData.questionType === "FILE_UPLOAD" && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold border-b pb-2">File Upload Settings</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Allowed File Types</label>
                    <div className="flex flex-wrap gap-2">
                      {["pdf", "doc", "docx", "jpg", "png", "py", "js", "html", "css"].map(type => (
                        <label key={type} className="flex items-center gap-1 text-sm">
                          <input
                            type="checkbox"
                            checked={formData.fileTypes.includes(type)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFormData({ ...formData, fileTypes: [...formData.fileTypes, type] })
                              } else {
                                setFormData({ ...formData, fileTypes: formData.fileTypes.filter(t => t !== type) })
                              }
                            }}
                          />
                          .{type}
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Max File Size (MB)</label>
                    <input
                      type="number"
                      name="maxFileSize"
                      value={formData.maxFileSize}
                      onChange={handleChange}
                      min="1"
                      max="50"
                      className="w-full border border-border rounded-lg px-3 py-2 bg-background"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Structured Questions */}
            {formData.questionType === "STRUCTURED" && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold border-b pb-2">Sub-Questions</h2>
                <div className="space-y-3">
                  {formData.subQuestions.map((sq, index) => (
                    <div key={index} className="flex gap-2 items-start p-3 bg-muted rounded-lg">
                      <span className="font-semibold text-primary mt-2">({String.fromCharCode(97 + index)})</span>
                      <div className="flex-1 space-y-2">
                        <textarea
                          value={sq.text}
                          onChange={(e) => handleSubQuestionChange(index, "text", e.target.value)}
                          placeholder={`Sub-question ${index + 1}`}
                          className="w-full border border-border rounded-lg px-3 py-2 bg-background min-h-16"
                        />
                        <div className="flex items-center gap-2">
                          <label className="text-sm">Marks:</label>
                          <input
                            type="number"
                            value={sq.marks}
                            onChange={(e) => handleSubQuestionChange(index, "marks", parseInt(e.target.value))}
                            min="1"
                            className="w-20 border border-border rounded px-2 py-1 bg-background"
                          />
                        </div>
                      </div>
                      {formData.subQuestions.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeSubQuestion(index)}
                          className="text-red-500 hover:text-red-700 px-2 mt-2"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <Button type="button" variant="outline" onClick={addSubQuestion} className="text-sm">
                  + Add Sub-Question
                </Button>
              </div>
            )}

            {/* Explanation */}
            <div className="space-y-4">
              <h2 className="text-lg font-bold border-b pb-2">Additional Information (Optional)</h2>
              <div>
                <label className="block text-sm font-medium mb-2">Explanation</label>
                <textarea
                  name="explanation"
                  value={formData.explanation}
                  onChange={handleChange}
                  placeholder="Explain the answer (shown to students after submission)"
                  className="w-full border border-border rounded-lg px-3 py-2 min-h-20 bg-background"
                />
              </div>
            </div>

            {/* Submit */}
            <div className="flex gap-4 pt-4 border-t">
              <Button
                type="submit"
                disabled={loading}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {loading ? "Creating..." : "Create Question"}
              </Button>
              <Link href="/admin/question-bank">
                <Button type="button" variant="outline">Cancel</Button>
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
