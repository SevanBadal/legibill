import NextLink from "next/link";
import Session from "@/data/sessions";
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Link,
} from "@nextui-org/react";

async function getSponsorData(peopleId: number): Promise<any> {
  try {
    const legiscanApiKey = process.env.LEGI_KEY;
    const res = await fetch(
      `https://api.legiscan.com/?key=${legiscanApiKey}&op=getSponsoredList&id=${peopleId}`
    );
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
    const res = await fetch(
      `https://api.legiscan.com/?key=${legiscanApiKey}&op=getBill&id=${sessionId}`
    );
    const data = await res.json();

    return data;
  } catch (error) {
    console.error(error);
    return []; // Return an empty array in case of error
  }
}

export default async function Page({
  params,
}: {
  params: { state: string; sponsor: string };
}) {
  const sponsorData = await getSponsorData(Number(params.sponsor));
  const sponsor = sponsorData.sponsoredbills.sponsor;
  const sessions = sponsorData.sponsoredbills.sessions;

  return (
    <>
      <div className="flex justify-center space-x-12 mb-10 text-lg">
        {/* <Link
          href={`/state/${params.state}/sponsor/${sponsor.people_id}/bills`}
          as={NextLink}
          size="lg"
          color="foreground"
        >
          <p className=" cursor-pointer  font-semibold">Bills</p>
        </Link> */}
        <Link
          href={`/state/${params.state}/sponsor/${sponsor.people_id}/sessions`}
          as={NextLink}
          size="lg"
        >
          <p className=" font-semibold text-blue-600 text-2xl py-8 underline cursor-pointer">
            Sponsor Sessions
          </p>
        </Link>
      </div>

      <ul role="list" className="mt-3 max-w-4xl mx-auto">
        {sessions.length > 0 ? (
          sessions.map((session: Session) => (
            <li key={session.session_id} className="w-full my-4">
              <Card className="p-4">
                <CardHeader>
                  <p className="line-clamp-1">
                    <strong>
                      {params.state} {session.session_name}
                    </strong>
                  </p>
                </CardHeader>
                <CardFooter>
                  <Link
                    href={`/state/${params.state}/sponsor/${params.sponsor}/sessions/bills/${session.session_id}`}
                    as={NextLink}
                  >
                    <p className="text-sm font-semibold leading-6">
                      View Sponsor Bills
                      <span aria-hidden="true">&rarr;</span>
                    </p>
                  </Link>
                  <Link
                    href={`/state/${params.state}/session/${session.session_id}`}
                    as={NextLink}
                  >
                    <p className="text-sm font-semibold leading-6 pl-10">
                      View Session
                      <span aria-hidden="true">&rarr;</span>
                    </p>
                  </Link>
                </CardFooter>
              </Card>
            </li>
          ))
        ) : (
          <Card>
            <CardBody>
              <li className="border rounded-lg p-4 shadow-sm bg-white">
                No sessions.
              </li>
            </CardBody>
          </Card>
        )}
      </ul>
    </>
  );
}
