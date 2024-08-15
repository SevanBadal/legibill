import { NextResponse } from 'next/server';
import prisma from '@/app/prismaClient';
import { getServerSession } from 'next-auth';

export async function GET(request: Request) {
  const session = await getServerSession();

  if (!session?.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const userId = session.user.id;

  try {
    const savedBills = await prisma.savedBill.findMany({
      where: { userId },
    });

    return NextResponse.json({ savedBills });
  } catch (error) {
    console.error('Error fetching saved bills:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
