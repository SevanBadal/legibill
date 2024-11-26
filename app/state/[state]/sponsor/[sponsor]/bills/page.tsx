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

async function getBillData(billId: number): Promise<any> {
  try {
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
  params: { state: string; sponsor: string };
}) {
  const sponsorData = await getSponsorData(Number(params.sponsor));
  const sponsor = sponsorData?.sponsoredbills?.sponsor;
  const bills = sponsorData?.sponsoredbills?.bills;

  const detailedBills = await Promise.all(
    bills.map(async (bill: any) => {
      const billData = await getBillData(bill.bill_id);
      return { ...billData.bill };
    })
  );

  return (
    <>
      <div className="flex justify-center space-x-12 mb-10 text-lg">
        <Link
          href={`/state/${params.state}/sponsor/${sponsor.people_id}/bills`}
          as={NextLink}
          size="lg"
        >
          <p className=" cursor-pointer text-blue-600 underline font-semibold">
            Bills
          </p>
        </Link>
        <Link
          href={`/state/${params.state}/sponsor/${sponsor.people_id}/sessions`}
          as={NextLink}
          size="lg"
          color="foreground"
        >
          <p className=" font-semibold cursor-pointer">Sessions</p>
        </Link>
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
