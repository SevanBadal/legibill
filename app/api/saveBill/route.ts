import { NextResponse } from 'next/server';
import prisma from '@/app/prismaClient';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  console.log('Session:', session);

  if (!session?.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { legiscanBillId, title, description, state, sessionTitle, changeHash } = await request.json();
  const userId = session.user.id;

  console.log('legiscanBillId', legiscanBillId)

  try {
    const savedBill = await prisma.savedBill.create({
      data: {
        userId,
        legiscanBillId,
        title,
        description,
        state,
        sessionTitle,
        changeHash,
      },
    });
    return NextResponse.json({ savedBill });
  } catch (error) {
    console.error('Error saving bill:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
