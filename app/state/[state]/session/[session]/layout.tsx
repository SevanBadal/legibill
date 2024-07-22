import { Suspense } from 'react';
import Loading from './loading';
import Session from '@/data/sessions';
import SessionPeopleResponse from "@/data/sessionPeopleResponse";

async function getSessionData(sessionID: number): Promise<any> {
  try {
    const legiscanApiKey = process.env.LEGI_KEY;
    const res = await fetch(`https://api.legiscan.com/?key=${legiscanApiKey}&op=getSessionPeople&id=${sessionID}`);
    const data = await res.json();
    return data;

  } catch (error) {
    console.error(error);
    return []; // Return an empty array in case of error
  }
}

export default async function SessionBillsLayout({
  children,
  params
}: {
  children: React.ReactNode,
  params: { session: number; state: string }
}) {

  const sessionData: SessionPeopleResponse = await getSessionData(params.session)
  const session: Session = sessionData.sessionpeople.session

  return (
    <>

      <div className="border rounded-lg p-4 shadow-sm bg-gray-900 text-gray-200 transition-colors">
        <h2 className="text-lg font-semibold">{session.session_title}</h2>
        <p><strong>Session Name:</strong> {session.session_name}</p>
        <p><strong>Years:</strong> {session.year_start} - {session.year_end}</p>
        <p><strong>Session Tag:</strong> {session.session_tag}</p>
        <p><strong>Special Session:</strong> {session.special ? 'Yes' : 'No'}</p>
        <p><strong>Prefile:</strong> {session.prefile ? 'Yes' : 'No'}</p>
        <p><strong>Sine Die:</strong> {session.sine_die ? 'Yes' : 'No'}</p>
        <p><strong>Prior:</strong> {session.prior ? 'Yes' : 'No'}</p>
      </div>

      <div className='p-4 bg-gray-200 min-h-screen'>
        <Suspense fallback={<Loading />}>{children}</Suspense>
      </div>
    </>
  )
}