import Link from "next/link";
import Session from "@/data/sessions";

async function getSponsorData(peopleId: number): Promise<any> {
  try {
    const legiscanApiKey = process.env.LEGI_KEY;
    const res = await fetch(`https://api.legiscan.com/?key=${legiscanApiKey}&op=getSponsoredList&id=${peopleId}`);
    const data = await res.json();

    return data;

  } catch (error) {
    console.error(error);
    return []; // Return an empty array in case of error
  }
}

async function getSessionData(sessionId: number): Promise<any> {
  try {
    const legiscanApiKey = process.env.LEGI_KEY;
    const res = await fetch(`https://api.legiscan.com/?key=${legiscanApiKey}&op=getBill&id=${sessionId}`);
    const data = await res.json();

    return data;

  } catch (error) {
    console.error(error);
    return []; // Return an empty array in case of error
  }
}


export default async function Page({
  params
}: {
  params: { state: string, sponsor: string }
}) {

  const sponsorData = await getSponsorData(Number(params.sponsor))
  const sponsor = sponsorData.sponsoredbills.sponsor
  const sessions = sponsorData.sponsoredbills.sessions

  return (
    <>
      <div className="flex justify-center space-x-12 mb-10 text-lg">
        <Link href={`/state/${params.state}/sponsor/${sponsor.people_id}/bills`}>
          <p className=" cursor-pointer  font-semibold">Bills</p>
        </Link>
        <Link href={`/state/${params.state}/sponsor/${sponsor.people_id}/sessions`}>
          <p className=" font-semibold text-blue-600 underline cursor-pointer">Sessions</p>
        </Link>
      </div>

      <ul role="list" className="mt-3 max-w-4xl mx-auto">
        {sessions.length > 0 ? (
          sessions.map((session: Session) => (
            <li key={session.session_id} className="w-full my-4">
              <div className="border rounded-lg p-4 shadow-sm bg-white">
                <p className='line-clamp-1'><strong>{params.state} {session.session_name}</strong></p>
                <Link href={`/state/${params.state}/session/${session.session_id}`}>
                  <p className="text-sm font-semibold leading-6 text-blue-600" >
                    View Session
                    <span aria-hidden="true">&rarr;</span></p>
                </Link>
              </div>
            </li>
          ))
        ) : (
          <li className="border rounded-lg p-4 shadow-sm bg-white">No sessions.</li>
        )}
      </ul>
    </>
  )
}