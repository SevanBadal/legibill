import { NextResponse } from 'next/server';
import prisma from '@/app/prismaClient';
import { getServerSession } from 'next-auth';
import authOptions from '@/utilities/auth';

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { legiscanPeopleId, personHash, stateId, party, role, name, suffix, district } = await request.json();
  const userId = session.user.id;

  try {
    const savedSponsor = await prisma.savedSponsor.create({
      data: {
        userId,
        legiscanPeopleId,
        personHash,
        stateId,
        party,
        role,
        name,
        suffix,
        district
      },
    });
    return NextResponse.json({ savedSponsor });
  } catch (error) {
    console.error('Error saving sponsor:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
