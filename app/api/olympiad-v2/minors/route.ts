/**
 * API Endpoint: Minor Profiles Management
 * GET /api/olympiad-v2/minors - List user's minors
 * POST /api/olympiad-v2/minors - Create new minor profile
 */

import { NextRequest, NextResponse } from 'next/server';
import { getParticipantSession } from '@/lib/participant-session';
import {
  createMinorProfile,
  getMinorProfilesByUser,
} from '@/lib/olympiad-v2/minors';
import type { CreateMinorProfileInput } from '@/lib/olympiad-v2/types';

/**
 * GET - List all minor profiles for the authenticated user
 */
export async function GET(request: NextRequest) {
  try {
    // Get authenticated user
    const session = await getParticipantSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user's minors
    const minors = await getMinorProfilesByUser(session.guardianId);

    return NextResponse.json({
      success: true,
      data: minors,
    });
  } catch (error) {
    console.error('Error fetching minors:', error);
    return NextResponse.json(
      { error: 'Failed to fetch minor profiles' },
      { status: 500 }
    );
  }
}

/**
 * POST - Create a new minor profile
 */
export async function POST(request: NextRequest) {
  try {
    // Get authenticated user
    const session = await getParticipantSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();

    // Validate required fields
    if (!body.full_name || !body.date_of_birth) {
      return NextResponse.json(
        { error: 'Missing required fields: full_name, date_of_birth' },
        { status: 400 }
      );
    }

    // Validate date format
    const dateOfBirth = new Date(body.date_of_birth);
    if (isNaN(dateOfBirth.getTime())) {
      return NextResponse.json(
        { error: 'Invalid date_of_birth format' },
        { status: 400 }
      );
    }

    // Create minor profile input
    const input: CreateMinorProfileInput = {
      full_name: body.full_name,
      date_of_birth: body.date_of_birth,
      gender: body.gender,
      school_name: body.school_name,
      class_grade: body.class_grade,
      national_id: body.national_id,
      student_number: body.student_number,
    };

    // Create minor profile
    const minor = await createMinorProfile(session.guardianId, input);

    return NextResponse.json({
      success: true,
      data: minor,
      message: 'Minor profile created successfully',
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating minor:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create minor profile' },
      { status: 500 }
    );
  }
}
