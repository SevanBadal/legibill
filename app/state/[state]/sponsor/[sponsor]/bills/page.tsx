import getSearchBill from "@/data/getSearchBill";
import Link from "next/link";

export const maxDuration = 60;

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
        >
          <p className=" cursor-pointer text-blue-600 underline font-semibold">
            Bills
          </p>
        </Link>
        <Link
          href={`/state/${params.state}/sponsor/${sponsor.people_id}/sessions`}
        >
          <p className=" font-semibold cursor-pointer">Sessions</p>
        </Link>
      </div>

      <ul role="list" className="mt-3 max-w-4xl mx-auto">
        {bills.length > 0 ? (
          detailedBills.map((bill: getSearchBill) => (
            <li key={bill.bill_id} className="w-full my-4">
              <div className="border rounded-lg p-4 shadow-sm bg-white">
                <p className="line-clamp-1">
                  <strong>{bill.title}</strong>
                </p>
                <p className="line-clamp-1">{bill.description}</p>
                <Link
                  href={`/state/${params.state}/session/${bill.session.session_id}/bill/${bill.bill_id}/history`}
                >
                  <p className="text-sm font-semibold leading-6 text-blue-600">
                    View Bill
                    <span aria-hidden="true">&rarr;</span>
                  </p>
                </Link>
              </div>
            </li>
          ))
        ) : (
          <li className="border rounded-lg p-4 shadow-sm bg-white">
            No bills.
          </li>
        )}
      </ul>
    </>
  );
}
