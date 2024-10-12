import { NextResponse } from 'next/server';
import prisma from '@/app/prismaClient';
import { getServerSession } from 'next-auth';
import authOptions from '@/utilities/auth';

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const userId = session.user.id;

  try {
    const savedSponsors = await prisma.savedSponsor.findMany({
      where: { userId }
    });

    return NextResponse.json({ savedSponsors });
  } catch (error) {
    console.error('Error fetching saved sponsors:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
