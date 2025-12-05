import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      participantType,
      editionId,
      userId,
      minorProfileId,
      enrolledByUserId,
      educationLevel,
    } = body;

    if (!participantType || !editionId || !enrolledByUserId || !educationLevel) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (participantType === 'SELF' && !userId) {
      return NextResponse.json({ error: 'User ID is required for self-enrollment' }, { status: 400 });
    }

    if (participantType === 'MINOR' && !minorProfileId) {
      return NextResponse.json({ error: 'Minor Profile ID is required for minor enrollment' }, { status: 400 });
    }

    // In a real application, you would add more validation here, such as:
    // - Checking if the edition is open for enrollment
    // - Validating the age of the participant against the education level
    // - Ensuring the participant is not already enrolled

    const newParticipant = await prisma.participant.create({
      data: {
        participantType,
        editionId,
        userId: participantType === 'SELF' ? userId : null,
        minorProfileId: participantType === 'MINOR' ? minorProfileId : null,
        enrolledByUserId,
        educationLevel,
      },
    });

    return NextResponse.json(newParticipant, { status: 201 });
  } catch (error) {
    console.error('[ENROLL_POST]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
