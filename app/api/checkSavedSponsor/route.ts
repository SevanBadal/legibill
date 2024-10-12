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
  const legiscanPeopleId = url.searchParams.get('legiscanPeopleId');

  if (!legiscanPeopleId || isNaN(Number(legiscanPeopleId))) {
    return NextResponse.json({ message: 'Invalid or missing legiscanPeopleId' }, { status: 400 });
  }

  try {
    const savedSponsor = await prisma.savedSponsor.findFirst({
      where: {
        userId: session.user.id,
        legiscanPeopleId: parseInt(legiscanPeopleId, 10),
      },
    });

    return NextResponse.json({ savedSponsor });
  } catch (error) {
    console.error('Error checking if sponsor is saved:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
