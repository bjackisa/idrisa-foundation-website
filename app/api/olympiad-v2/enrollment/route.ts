/**
 * API Endpoint: Enrollment Management
 * POST /api/olympiad-v2/enrollment/check - Check enrollment eligibility
 * POST /api/olympiad-v2/enrollment/enroll - Enroll participant
 */

import { NextRequest, NextResponse } from 'next/server';
import { getParticipantSession } from '@/lib/participant-session';
import { createParticipant, getParticipantSubjects } from '@/lib/olympiad-v2/participants';
import { sendEnrollmentConfirmation } from '@/lib/olympiad-v2/notifications';
import { getEditionById } from '@/lib/olympiad-v2/editions';
import { ensureParticipantsTable } from '@/lib/olympiad-v2/database';
import type { CreateParticipantInput } from '@/lib/olympiad-v2/types';

/**
 * POST - Check enrollment eligibility or enroll participant
 */
export async function POST(request: NextRequest) {
  try {
    // Ensure tables exist
    await ensureParticipantsTable();
    
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

    const participantInput: CreateParticipantInput = {
      edition_id: enrollmentData.edition_id,
      participant_type: enrollmentData.participant_type,
      user_id: enrollmentData.participant_type === 'SELF' ? session.guardianId : undefined,
      guardian_id: enrollmentData.participant_type === 'MINOR' ? session.guardianId : undefined,
      minor_id: enrollmentData.participant_type === 'MINOR' ? enrollmentData.minor_profile_id : undefined,
      education_level: enrollmentData.education_level,
      subjects: enrollmentData.subjects,
      is_qualified: true
    };

    // Check edition exists
    const edition = await getEditionById(enrollmentData.edition_id);
    if (!edition) {
      return NextResponse.json(
        { error: 'Edition not found' },
        { status: 404 }
      );
    }

    // Check eligibility based on action
    if (action === 'check') {
      // Basic validation only for check action
      // In a real implementation, you would do more checks here
      const isEligible = true;
      const errors: string[] = [];
      
      return NextResponse.json({
        success: true,
        data: {
          eligible: isEligible,
          errors: errors
        },
      });
    }

    // Enroll participant
    if (action === 'enroll') {
      // Create the participant
      const participant = await createParticipant(participantInput);

      // Edition details already fetched above
      
      // Send confirmation notification
      if (edition) {
        await sendEnrollmentConfirmation(
          session.guardianId,
          edition.name,
          participantInput.subjects || []
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
