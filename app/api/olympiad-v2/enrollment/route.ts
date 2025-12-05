/**
 * API Endpoint: Enrollment Management
 * POST /api/olympiad-v2/enrollment/check - Check enrollment eligibility
 * POST /api/olympiad-v2/enrollment/enroll - Enroll participant
 */

import { NextRequest, NextResponse } from 'next/server';
import { getParticipantSession } from '@/lib/participant-session';
import {
  checkEnrollmentEligibility,
  enrollParticipant,
  getParticipantSubjects,
} from '@/lib/olympiad-v2/enrollment';
import { sendEnrollmentConfirmation } from '@/lib/olympiad-v2/notifications';
import { getEditionById } from '@/lib/olympiad-v2/editions';
import type { EnrollmentInput } from '@/lib/olympiad-v2/types';

/**
 * POST - Check enrollment eligibility or enroll participant
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
    const { action, ...enrollmentData } = body;

    // Validate required fields
    if (!enrollmentData.edition_id || !enrollmentData.participant_type || !enrollmentData.education_level || !enrollmentData.subjects) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate participant type
    if (enrollmentData.participant_type === 'MINOR' && !enrollmentData.minor_profile_id) {
      return NextResponse.json(
        { error: 'minor_profile_id required for MINOR participant type' },
        { status: 400 }
      );
    }

    // Validate subjects array
    if (!Array.isArray(enrollmentData.subjects) || enrollmentData.subjects.length === 0) {
      return NextResponse.json(
        { error: 'subjects must be a non-empty array' },
        { status: 400 }
      );
    }

    const enrollmentInput: EnrollmentInput = {
      edition_id: enrollmentData.edition_id,
      participant_type: enrollmentData.participant_type,
      user_id: enrollmentData.participant_type === 'SELF' ? session.guardianId : undefined,
      minor_profile_id: enrollmentData.participant_type === 'MINOR' ? enrollmentData.minor_profile_id : undefined,
      education_level: enrollmentData.education_level,
      subjects: enrollmentData.subjects,
    };

    // Check eligibility
    if (action === 'check') {
      const eligibility = await checkEnrollmentEligibility(session.guardianId, enrollmentInput);

      return NextResponse.json({
        success: true,
        data: eligibility,
      });
    }

    // Enroll participant
    if (action === 'enroll') {
      // First check eligibility
      const eligibility = await checkEnrollmentEligibility(session.guardianId, enrollmentInput);

      if (!eligibility.eligible) {
        return NextResponse.json(
          {
            error: 'Enrollment not allowed',
            details: eligibility.errors,
          },
          { status: 400 }
        );
      }

      // Enroll
      const participant = await enrollParticipant(session.guardianId, enrollmentInput);

      // Get edition details for notification
      const edition = await getEditionById(enrollmentInput.edition_id);

      // Send confirmation notification
      if (edition) {
        await sendEnrollmentConfirmation(
          session.guardianId,
          edition.name,
          enrollmentInput.subjects
        );
      }

      // Get enrolled subjects
      const subjects = await getParticipantSubjects(participant.id);

      return NextResponse.json({
        success: true,
        data: {
          participant,
          subjects,
        },
        message: 'Successfully enrolled in the Olympiad',
      }, { status: 201 });
    }

    return NextResponse.json(
      { error: 'Invalid action. Use "check" or "enroll"' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error in enrollment:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Enrollment failed' },
      { status: 500 }
    );
  }
}
