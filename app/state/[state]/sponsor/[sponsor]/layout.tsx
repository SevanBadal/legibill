import SponsorSaveButton from "@/app/components/SponsorSaveButton";
import { Card, CardBody, CardFooter, CardHeader } from "@nextui-org/react";

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

export default async function SponsorLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { state: string; sponsor: string };
}) {
  const sponsorData = await getSponsorData(Number(params.sponsor));
  const sponsor = sponsorData?.sponsoredbills?.sponsor;

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
