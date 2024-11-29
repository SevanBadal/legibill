import Session from "@/data/sessions";
import Link from "next/link";
import { Card, CardHeader, CardBody } from "@nextui-org/card";

async function getSessionList(stateAbbreviation: string) {
  const legiscanApiKey = process.env.LEGI_KEY;

  if (!stateAbbreviation || typeof stateAbbreviation !== "string") {
    console.error("Invalid state abbreviation");
    throw new Error("Invalid state abbreviation");
  }

  console.log("Fetching data");

  const res = await fetch(
    `https://api.legiscan.com/?key=${legiscanApiKey}&op=getSessionList&state=${stateAbbreviation}`
  );
  const data = await res.json();

  // Check if the response is OK and has the sessions array
  if (data.status === "OK" && data.sessions) {
    return data.sessions;
  } else {
    // Handle the case where the sessions array is not present
    console.error("Sessions data not found");
    return [];
  }
}

export default async function Page({ params }: { params: { state: string } }) {
  const sessionData: Session[] = await getSessionList(params.state);
  return (
    <div>
      <h1 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight">
        {params.state} session data
      </h1>
      <ul
        role="list"
        className="mt-3 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4"
      >
        {sessionData.map((session: Session, index: number) => (
          <li key={session.session_id} className="py-4">
            <Link href={`/state/${params.state}/session/${session.session_id}`}>
              <Card isHoverable isPressable>
                <CardHeader>
                  <h2 className="text-lg font-semibold">
                    {session.session_title}
                  </h2>
                </CardHeader>
                <CardBody>
                  <p>
                    <strong>Session Name:</strong> {session.session_name}
                  </p>
                  <p>
                    <strong>Years:</strong> {session.year_start} -{" "}
                    {session.year_end}
                  </p>
                  <p>
                    <strong>Session Tag:</strong> {session.session_tag}
                  </p>
                  <p>
                    <strong>Special Session:</strong>{" "}
                    {session.special ? "Yes" : "No"}
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
                  <p>
                    <strong>Dataset Hash:</strong> {session.dataset_hash}
                  </p>
                  <p>
                    <strong>Session Hash:</strong> {session.session_hash}
                  </p>
                </CardBody>
              </Card>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
