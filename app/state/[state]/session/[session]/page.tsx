import { Suspense } from "react";
import Loading from "./loading";
import Session from "@/data/sessions";
import SessionPeopleResponse from "@/data/sessionPeopleResponse";
import SessionBills from "./sessionBills";
import { Card, CardBody, CardHeader } from "@nextui-org/react";

async function getSessionData(sessionID: any): Promise<any> {
  try {
    // Convert sessionID to a number and check if it's a valid number
    const numericSessionID = Number(sessionID);

    if (isNaN(numericSessionID) || numericSessionID <= 0) {
      console.error("Invalid session id:", sessionID);
      throw new Error("Invalid session id");
    }

    console.log("Fetching data with sessionID:", numericSessionID);

    const legiscanApiKey = process.env.LEGI_KEY;
    if (!legiscanApiKey) {
      throw new Error("LegiScan API key is missing");
    }

    const res = await fetch(
      `https://api.legiscan.com/?key=${legiscanApiKey}&op=getSessionPeople&id=${numericSessionID}`
    );
    const data = await res.json();

    return data;
  } catch (error) {
    console.error("Error fetching session data:", error);
    return []; // Return an empty array in case of error
  }
}

export default async function Page({
  params,
  searchParams,
}: {
  params: { session: number; state: string };
  searchParams: { page: string };
}) {
  const sessionData: SessionPeopleResponse = await getSessionData(
    params.session
  );
  const session: Session = sessionData.sessionpeople.session;

  return (
    <>
      <Card className="bg-slate-900 text-background">
        <CardHeader className="text-lg font-semibold ">
          {session.session_title}
        </CardHeader>
        <CardBody>
          <p>
            <strong>Session Name:</strong> {session.session_name}
          </p>
          <p>
            <strong>Years:</strong> {session.year_start} - {session.year_end}
          </p>
          <p>
            <strong>Session Tag:</strong> {session.session_tag}
          </p>
          <p>
            <strong>Special Session:</strong> {session.special ? "Yes" : "No"}
          </p>
          <p>
            <strong>Prefile:</strong> {session.prefile ? "Yes" : "No"}
          </p>
          <p>
            <strong>Sine Die:</strong> {session.sine_die ? "Yes" : "No"}
          </p>
          <p>
            <strong>Prior:</strong> {session.prior ? "Yes" : "No"}
          </p>
        </CardBody>
      </Card>

      <div className="p-4 min-h-screen">
        <Suspense fallback={<Loading />}>
          <SessionBills
            params={{
              session: params.session,
              state: params.state,
            }}
            searchParams={{
              page: searchParams.page,
            }}
          />
        </Suspense>
      </div>
    </>
  );
}
