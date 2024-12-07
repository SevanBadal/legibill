import Sponsor from "@/data/sponsors";
import { Card, CardBody, CardHeader, Link } from "@nextui-org/react";
import NextLink from "next/link";
import SponsorSaveButton from "@/app/components/SponsorSaveButton";

async function getBillData(billId: number): Promise<any> {
  try {
    if (!billId || typeof billId !== "number") {
      console.error("Invalid bill id");
      throw new Error("Invalid bill id");
    }

    console.log("Fetching data");

    const legiscanApiKey = process.env.LEGI_KEY;
    const res = await fetch(
      `https://api.legiscan.com/?key=${legiscanApiKey}&op=getBill&id=${billId}`
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
  params: { session: number; state: string; bill: string };
}) {
  const billData = await getBillData(Number(params.bill));
  const bill = billData.bill;
  const sponsors = billData.bill.sponsors;

  return (
    <>
      <div className="flex justify-center space-x-12 mb-10 text-lg">
        <Link
          href={`/state/${params.state}/session/${params.session}/bill/${bill.bill_id}/history`}
          as={NextLink}
          color="foreground"
          size="lg"
        >
          <p className=" cursor-pointer font-semibold">History</p>
        </Link>
        <Link
          href={`/state/${params.state}/session/${params.session}/bill/${bill.bill_id}/votes`}
          as={NextLink}
          color="foreground"
          size="lg"
        >
          <p className=" font-semibold cursor-pointer">Votes</p>
        </Link>
        <Link
          href={`/state/${params.state}/session/${params.session}/bill/${bill.bill_id}/sponsors`}
          as={NextLink}
          size="lg"
        >
          <p className="text-blue-600  underline cursor-pointer font-semibold">
            Sponsors
          </p>
        </Link>
      </div>

      <ul role="list" className="mt-3 max-w-4xl mx-auto">
        {sponsors.length > 0 ? (
          sponsors.map((sponsor: Sponsor) => (
            <li key={sponsor.people_id} className="w-full my-4">
              <Card className="p-4">
                <CardHeader>
                  <p className="line-clamp-1">
                    <strong>
                      {sponsor.role}. {sponsor.name} ({sponsor.party})
                    </strong>
                  </p>
                </CardHeader>
                <CardBody>
                  <p className="line-clamp-1">
                    <strong>District:</strong> {sponsor.district}
                  </p>
                  <div className="flex space-x-10 my-4">
                    <SponsorSaveButton sponsor={sponsor} />
                    <Link
                      href={`/state/${params.state}/sponsor/${sponsor.people_id}/sessions`}
                      as={NextLink}
                    >
                      <p className="text-blue-600 cursor-pointer font-semibold">
                        {" "}
                        View Sponsor <span aria-hidden="true">&rarr;</span>
                      </p>
                    </Link>
                  </div>
                </CardBody>
              </Card>
            </li>
          ))
        ) : (
          <Card>
            <CardBody>
              <li className=" p-4 ">No sponsors.</li>
            </CardBody>
          </Card>
        )}
      </ul>
    </>
  );
}
