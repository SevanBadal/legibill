import { NextResponse } from 'next/server';
import prisma from '@/app/prismaClient';
import { getServerSession } from 'next-auth';
import authOptions from '@/utilities/auth';

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const url = new URL(request.url);
  const legiscanBillId = url.searchParams.get('legiscanBillId');

  if (!legiscanBillId || isNaN(Number(legiscanBillId))) {
    return NextResponse.json({ message: 'Invalid or missing legiscanBillId' }, { status: 400 });
  }

  try {
    const savedBill = await prisma.savedBill.findFirst({
      where: {
        userId: session.user.id,
        legiscanBillId: parseInt(legiscanBillId, 10),
      },
    });

    return NextResponse.json({ savedBill });
  } catch (error) {
    console.error('Error checking if bill is saved:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
