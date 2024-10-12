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
    const savedSponsor = await prisma.savedSponsor.findUnique({
      where: { id },
    });

    if (!savedSponsor) {
      return NextResponse.json({ message: 'Sponsor not found' }, { status: 404 });
    }

    if (savedSponsor.userId !== session.user.id) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const unsavedSponsor = await prisma.savedSponsor.delete({
      where: { id },
    });
    return NextResponse.json({ unsavedSponsor });
  } catch (error) {
    console.error('Error unsaving sponsor:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
