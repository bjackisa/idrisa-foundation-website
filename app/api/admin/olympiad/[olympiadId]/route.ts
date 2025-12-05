import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: { olympiadId: string } }
) {
  try {
    const { olympiadId } = params;

    if (!olympiadId) {
      return NextResponse.json({ error: 'Olympiad ID is required' }, { status: 400 });
    }

    const olympiad = await prisma.olympiadEdition.findUnique({
      where: {
        id: olympiadId,
      },
    });

    if (!olympiad) {
      return NextResponse.json({ error: 'Olympiad not found' }, { status: 404 });
    }

    return NextResponse.json(olympiad);
  } catch (error) {
    console.error('[OLYMPIAD_GET]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { olympiadId: string } }
) {
  try {
    const { olympiadId } = params;
    const body = await request.json();
    const { name, year, enrollmentStart, enrollmentEnd, status } = body;

    if (!olympiadId) {
      return NextResponse.json({ error: 'Olympiad ID is required' }, { status: 400 });
    }

    const updatedOlympiad = await prisma.olympiadEdition.update({
      where: {
        id: olympiadId,
      },
      data: {
        name,
        year,
        enrollmentStart: new Date(enrollmentStart),
        enrollmentEnd: new Date(enrollmentEnd),
        status,
      },
    });

    return NextResponse.json(updatedOlympiad);
  } catch (error) {
    console.error('[OLYMPIAD_PUT]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { olympiadId: string } }
) {
  try {
    const { olympiadId } = params;

    if (!olympiadId) {
      return NextResponse.json({ error: 'Olympiad ID is required' }, { status: 400 });
    }

    await prisma.olympiadEdition.delete({
      where: {
        id: olympiadId,
      },
    });

    return NextResponse.json({ message: 'Olympiad deleted successfully' });
  } catch (error) {
    console.error('[OLYMPIAD_DELETE]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
