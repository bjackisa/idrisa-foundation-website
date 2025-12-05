import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: { minorId: string } }
) {
  try {
    const { minorId } = params;

    if (!minorId) {
      return NextResponse.json({ error: 'Minor ID is required' }, { status: 400 });
    }

    const minor = await prisma.minorProfile.findUnique({
      where: {
        id: minorId,
      },
    });

    if (!minor) {
      return NextResponse.json({ error: 'Minor not found' }, { status: 404 });
    }

    return NextResponse.json(minor);
  } catch (error) {
    console.error('[MINOR_GET]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { minorId: string } }
) {
  try {
    const { minorId } = params;
    const body = await request.json();
    const { fullName, dateOfBirth, gender, schoolName, className, nationalId, studentNumber } = body;

    if (!minorId) {
      return NextResponse.json({ error: 'Minor ID is required' }, { status: 400 });
    }

    const updatedMinor = await prisma.minorProfile.update({
      where: {
        id: minorId,
      },
      data: {
        fullName,
        dateOfBirth: new Date(dateOfBirth),
        gender,
        schoolName,
        className,
        nationalId,
        studentNumber,
      },
    });

    return NextResponse.json(updatedMinor);
  } catch (error) {
    console.error('[MINOR_PUT]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { minorId: string } }
) {
  try {
    const { minorId } = params;

    if (!minorId) {
      return NextResponse.json({ error: 'Minor ID is required' }, { status: 400 });
    }

    await prisma.minorProfile.delete({
      where: {
        id: minorId,
      },
    });

    return NextResponse.json({ message: 'Minor deleted successfully' });
  } catch (error) {
    console.error('[MINOR_DELETE]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
