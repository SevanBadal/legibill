// app/api/unsaveBill/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/app/prismaClient';
import { getServerSession } from 'next-auth';

export async function DELETE(request: Request) {
  const session = await getServerSession();

  if (!session?.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await request.json();

  try {
    const unsavedBill = await prisma.savedBill.delete({
      where: { id },
    });
    return NextResponse.json({ unsavedBill });
  } catch (error) {
    console.error('Error unsaving bill:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
