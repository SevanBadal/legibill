import Bill from "@/data/bills";
import getSearchBill from "@/data/getSearchBill";
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Link,
} from "@nextui-org/react";
import NextLink from "next/link";

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

async function getBillData(billId: number, retries = 3): Promise<any> {
  try {
    const legiscanApiKey = process.env.LEGI_KEY;
    const res = await fetch(
      `https://api.legiscan.com/?key=${legiscanApiKey}&op=getBill&id=${billId}`
    );
    const data = await res.json();
    console.log("getbilldata", data);

    return data;
  } catch (error) {
    if (retries > 0) {
      console.warn(
        `Retrying fetch for bill ${billId}, attempts left: ${retries}`
      );
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait before retrying
      return getBillData(billId, retries - 1);
    } else {
      console.error(`Failed to fetch bill ${billId} after multiple attempts.`);
      return null;
    }
  }
}

export default async function page({
  params,
}: {
  params: { state: string; sponsor: string; session: number };
}) {
  const sessionId = params.session;
  const sessionNumber = Number(sessionId);
  const sponsorData = await getSponsorData(Number(params.sponsor));
  const bills = sponsorData?.sponsoredbills?.bills;
  const filteredBills =
    bills?.filter((bill: Bill) => bill.session_id === sessionNumber) || [];

  const detailedBills = await Promise.all(
    filteredBills.map(async (bill: any) => {
      const billData = await getBillData(bill.bill_id);
      return { ...billData.bill };
    })
  );

  const sessions = sponsorData?.sponsoredbills?.sessions || [];
  const currentSession = sessions.find(
    (s: any) => s.session_id === sessionNumber
  );
  const sessionName = currentSession?.session_name;

  return (
    <>
      <div className="relative flex items-center justify-center">
        <Link
          href={`/state/${params.state}/sponsor/${params.sponsor}/sessions`}
          as={NextLink}
          className="absolute left-0"
        >
          <p className=" cursor-pointer text-gray-700v p-4">
            <span aria-hidden="true">&larr;</span> Back to Sponsor Sessions
          </p>
        </Link>
        <h1 className="font-semibold text-2xl py-8">
          {params.state} {sessionName}
        </h1>
      </div>

      <ul role="list" className="mt-3 max-w-4xl mx-auto">
        {bills.length > 0 ? (
          detailedBills.map((bill: getSearchBill) => (
            <li key={bill.bill_id} className="w-full my-4">
              <Card className="p-4">
                <CardHeader>
                  <p className="line-clamp-1">
                    <strong>{bill.title}</strong>
                  </p>
                </CardHeader>
                <CardBody>
                  <p className="line-clamp-3">{bill.description}</p>
                </CardBody>
                <CardFooter>
                  <Link
                    href={`/state/${params.state}/session/${bill.session.session_id}/bill/${bill.bill_id}/history`}
                    as={NextLink}
                  >
                    <p className="text-sm font-semibold leading-6">
                      View Bill
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
                No bills.
              </li>
            </CardBody>
          </Card>
        )}
      </ul>
    </>
  );
}
