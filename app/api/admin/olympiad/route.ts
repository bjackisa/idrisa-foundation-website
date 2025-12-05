import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, year, enrollmentStart, enrollmentEnd, status } = body;

    if (!name || !year || !enrollmentStart || !enrollmentEnd) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newOlympiad = await prisma.olympiadEdition.create({
      data: {
        name,
        year,
        enrollmentStart: new Date(enrollmentStart),
        enrollmentEnd: new Date(enrollmentEnd),
        status,
      },
    });

    return NextResponse.json(newOlympiad, { status: 201 });
  } catch (error) {
    console.error('[OLYMPIAD_POST]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const olympiads = await prisma.olympiadEdition.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    return NextResponse.json(olympiads);
  } catch (error) {
    console.error('[OLYMPIADS_GET]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
