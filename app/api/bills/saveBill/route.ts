import { NextResponse } from 'next/server';
import prisma from '@/app/prismaClient';
import { getServerSession } from 'next-auth';
import authOptions from '@/utilities/auth';

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { legiscanBillId, title, description, state, sessionTitle, changeHash, sessionId } = await request.json();
  const userId = session.user.id;

  try {
    const savedBill = await prisma.savedBill.create({
      data: {
        userId,
        legiscanBillId,
        title,
        description,
        state,
        sessionTitle,
        sessionId,
        changeHash,
      },
    });
    return NextResponse.json({ savedBill });
  } catch (error) {
    console.error('Error saving bill:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
