import { NextResponse } from 'next/server';
import prisma from '@/app/prismaClient';
import { getServerSession } from 'next-auth';
import authOptions from '@/utilities/auth';

export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await request.json();

  try {
    const savedBill = await prisma.savedBill.findUnique({
      where: { id },
    });

    if (!savedBill) {
      return NextResponse.json({ message: 'Bill not found' }, { status: 404 });
    }

    if (savedBill.userId !== session.user.id) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const unsavedBill = await prisma.savedBill.delete({
      where: { id },
    });
    return NextResponse.json({ unsavedBill });
  } catch (error) {
    console.error('Error unsaving bill:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
