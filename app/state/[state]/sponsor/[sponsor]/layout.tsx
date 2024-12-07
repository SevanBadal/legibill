import SponsorSaveButton from "@/app/components/SponsorSaveButton";
import { Card, CardBody, CardFooter, CardHeader } from "@nextui-org/react";

export const maxDuration = 60;

async function getSponsorData(peopleId: number, retries = 3): Promise<any> {
  const legiscanApiKey = process.env.LEGI_KEY;
  const url = `https://api.legiscan.com/?key=${legiscanApiKey}&op=getSponsoredList&id=${peopleId}`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    // console.log("Sponsor Data from getSponsorData:", data);

    if (data.status === "OK" && data.sponsoredbills) {
      return data;
    } else {
      console.error(
        `API Error for sponsor ${peopleId}:`,
        data.message || "Unknown error"
      );
      return null;
    }
  } catch (error: any) {
    if (retries > 0) {
      console.warn(
        `Retrying fetch for sponsor ${peopleId}, attempts left: ${retries}`
      );
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait before retrying
      return getSponsorData(peopleId, retries - 1);
    } else {
      console.error(
        `Failed to fetch sponsor ${peopleId} after multiple attempts:`,
        error
      );
      return null;
    }
  }
}

export default async function SponsorLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { state: string; sponsor: string };
}) {
  const sponsorData = await getSponsorData(Number(params.sponsor));
  // console.log("layout sponsordata", sponsorData);
  const sponsor = sponsorData?.sponsoredbills?.sponsor;
  // console.log("layout sponsor", sponsor);

  return (
    <>
      <Card className="p-4">
        <CardHeader>
          <p className="font-bold text-xl mb-2">{`${sponsor?.role}. ${sponsor?.name} (${sponsor?.party})`}</p>
        </CardHeader>
        <CardBody>
          <p>
            <strong>State:</strong> {params.state}
          </p>
          <p>
            {" "}
            <strong>District:</strong> {sponsor?.district}{" "}
          </p>
        </CardBody>
        <CardFooter>
          <SponsorSaveButton sponsor={sponsor} />
        </CardFooter>
      </Card>
      <div className="p-4 bg-gray-200 min-h-screen">{children}</div>
    </>
  );
}
