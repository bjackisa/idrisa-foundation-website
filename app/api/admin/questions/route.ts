import { NextRequest, NextResponse } from 'next/server'
import { ensureQuestionBankTable, sql } from '@/lib/olympiad-v2/database'

export async function GET(request: NextRequest) {
  try {
    // Ensure table exists
    await ensureQuestionBankTable()

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const subject = searchParams.get('subject')
    const educationLevel = searchParams.get('educationLevel') || searchParams.get('education_level')
    const questionType = searchParams.get('questionType') || searchParams.get('question_type')
    const questionFormat = searchParams.get('questionFormat') || searchParams.get('question_format')
    const difficulty = searchParams.get('difficulty')
    const stage = searchParams.get('stage')
    const offset = (page - 1) * limit

    // Build dynamic query
    let whereClause = 'WHERE is_active = true'
    const params: any[] = []
    let paramIndex = 1

    if (subject) {
      whereClause += ` AND subject = $${paramIndex++}`
      params.push(subject)
    }
    if (educationLevel) {
      whereClause += ` AND education_level = $${paramIndex++}`
      params.push(educationLevel)
    }
    if (questionType) {
      whereClause += ` AND question_type = $${paramIndex++}`
      params.push(questionType)
    }
    if (questionFormat) {
      whereClause += ` AND question_format = $${paramIndex++}`
      params.push(questionFormat)
    }
    if (difficulty) {
      whereClause += ` AND difficulty = $${paramIndex++}`
      params.push(difficulty)
    }
    if (stage) {
      whereClause += ` AND stage = $${paramIndex++}`
      params.push(stage)
    }

    // Get questions
    const questions = await sql.query(
      `SELECT * FROM question_bank ${whereClause} ORDER BY created_at DESC LIMIT $${paramIndex++} OFFSET $${paramIndex}`,
      [...params, limit, offset]
    )

    // Get total count
    const countResult = await sql.query(
      `SELECT COUNT(*) as total FROM question_bank ${whereClause}`,
      params
    )

    return NextResponse.json({
      questions: questions,
      pagination: {
        page,
        limit,
        total: parseInt(countResult[0]?.total || '0'),
        totalPages: Math.ceil(parseInt(countResult[0]?.total || '0') / limit)
      }
    })
  } catch (error) {
    console.error('Failed to fetch questions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch questions', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Ensure table exists
    await ensureQuestionBankTable()

    const body = await request.json()
    
    const {
      // Core fields
      question_text,
      questionText,
      question_type,
      questionType,
      question_format,
      questionFormat,
      subject,
      education_level,
      educationLevel,
      stage,
      difficulty,
      hardness,
      
      // Quiz/MCQ specific
      options,
      correct_answer,
      correctAnswer,
      correctOption,
      correct_answers,
      
      // Theory/Practical specific
      marking_guide,
      markingGuide,
      word_limit,
      wordLimit,
      
      // File upload specific
      file_types,
      fileTypes,
      max_file_size,
      maxFileSize,
      
      // Structured questions
      sub_questions,
      subQuestions,
      
      // Metadata
      explanation,
      marks,
      time_limit_seconds,
      topic,
      subtopic,
      tags
    } = body

    // Normalize field names (support both camelCase and snake_case)
    const finalQuestionText = question_text || questionText
    const finalQuestionType = question_type || questionType || 'MCQ'
    const finalQuestionFormat = question_format || questionFormat || 'Quiz'
    const finalEducationLevel = education_level || educationLevel || 'Primary'
    const finalStage = stage || 'Beginner'
    const finalDifficulty = difficulty || hardness || 'medium'
    
    // Handle correct answer based on question type
    let finalCorrectAnswer = correct_answer || correctAnswer
    let finalCorrectAnswers = correct_answers
    
    // For MCQ with correctOption index
    if (finalQuestionType === 'MCQ' && correctOption !== undefined && Array.isArray(options)) {
      finalCorrectAnswer = options[correctOption]
    }

    // Validation
    if (!finalQuestionText || !subject) {
      return NextResponse.json(
        { error: 'Missing required fields: question_text and subject are required' },
        { status: 400 }
      )
    }

    // Quiz questions need correct answer
    if (finalQuestionFormat === 'Quiz' && !finalCorrectAnswer && !finalCorrectAnswers) {
      return NextResponse.json(
        { error: 'Quiz questions require a correct answer' },
        { status: 400 }
      )
    }

    // MCQ questions need options
    if ((finalQuestionType === 'MCQ' || finalQuestionType === 'MULTIPLE_SELECT') && 
        (!options || !Array.isArray(options) || options.length < 2)) {
      return NextResponse.json(
        { error: 'MCQ questions must have at least 2 options' },
        { status: 400 }
      )
    }

    const result = await sql`
      INSERT INTO question_bank (
        question_text,
        question_type,
        question_format,
        subject,
        education_level,
        stage,
        difficulty,
        options,
        correct_answer,
        correct_answers,
        marking_guide,
        word_limit,
        file_types,
        max_file_size,
        sub_questions,
        explanation,
        marks,
        time_limit_seconds,
        topic,
        subtopic,
        tags,
        is_active,
        created_by_admin_id
      )
      VALUES (
        ${finalQuestionText},
        ${finalQuestionType},
        ${finalQuestionFormat},
        ${subject},
        ${finalEducationLevel},
        ${finalStage},
        ${finalDifficulty},
        ${options ? JSON.stringify(options) : null},
        ${finalCorrectAnswer || null},
        ${finalCorrectAnswers ? JSON.stringify(finalCorrectAnswers) : null},
        ${marking_guide || markingGuide || null},
        ${word_limit || wordLimit || null},
        ${file_types || fileTypes ? JSON.stringify(file_types || fileTypes) : null},
        ${max_file_size || maxFileSize || null},
        ${sub_questions || subQuestions ? JSON.stringify(sub_questions || subQuestions) : null},
        ${explanation || null},
        ${marks || 1},
        ${time_limit_seconds || 60},
        ${topic || null},
        ${subtopic || null},
        ${tags ? JSON.stringify(tags) : null},
        true,
        'admin-1'
      )
      RETURNING *
    `

    return NextResponse.json({
      question: result[0],
      message: 'Question created successfully'
    })
  } catch (error) {
    console.error('Failed to create question:', error)
    return NextResponse.json(
      { error: 'Failed to create question', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
