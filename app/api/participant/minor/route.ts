import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fullName, dateOfBirth, gender, schoolName, className, nationalId, studentNumber, createdByUserId } = body;

    if (!fullName || !dateOfBirth || !schoolName || !createdByUserId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newMinorProfile = await prisma.minorProfile.create({
      data: {
        fullName,
        dateOfBirth: new Date(dateOfBirth),
        gender,
        schoolName,
        className,
        nationalId,
        studentNumber,
        createdByUserId,
      },
    });

    return NextResponse.json(newMinorProfile, { status: 201 });
  } catch (error) {
    console.error('[MINOR_POST]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    // In a real app, you'd get the user ID from the session
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const minors = await prisma.minorProfile.findMany({
      where: {
        createdByUserId: userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return NextResponse.json(minors);
  } catch (error) {
    console.error('[MINORS_GET]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
