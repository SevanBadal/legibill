import Sponsor from "@/data/sponsors";
import Link from "next/link";

async function getBillData(billId: number): Promise<any> {
  try {
    if (!billId || typeof billId !== 'number') {
      console.error('Invalid bill id');
      throw new Error('Invalid bill id');
    }

    console.log('Fetching data');

    const legiscanApiKey = process.env.LEGI_KEY;
    const res = await fetch(`https://api.legiscan.com/?key=${legiscanApiKey}&op=getBill&id=${billId}`);
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
  params: { session: number; state: string, bill: string }
}) {

  const billData = await getBillData(Number(params.bill))
  const bill = billData.bill
  const sponsors = billData.bill.sponsors

  return (
    <>
      <div className="flex justify-center space-x-12 mb-10 text-lg">
        <Link href={`/state/${params.state}/session/${params.session}/bill/${bill.bill_id}/history`}>
          <p className=" cursor-pointer font-semibold">History</p>
        </Link>
        <Link href={`/state/${params.state}/session/${params.session}/bill/${bill.bill_id}/votes`}>
          <p className=" font-semibold cursor-pointer">Votes</p>
        </Link>
        <Link href={`/state/${params.state}/session/${params.session}/bill/${bill.bill_id}/sponsors`}>
          <p className="text-blue-600  underline cursor-pointer font-semibold">Sponsors</p>
        </Link>
      </div>

      <ul role="list" className="mt-3 max-w-4xl mx-auto">
        {sponsors.length > 0 ? (
          sponsors.map((sponsor: Sponsor) => (
            <li key={sponsor.people_id} className="w-full my-4">
              <div className="border rounded-lg p-4 shadow-sm bg-white">
                <p className='line-clamp-1'><strong>{sponsor.role}. {sponsor.name} ({sponsor.party})</strong></p>
                <p className='line-clamp-1'><strong>District:</strong> {sponsor.district}</p>
                <div className="flex space-x-10 my-4">
                  <p className=" font-semibold leading-6 text-blue-600">
                    Save <span aria-hidden="true">☆</span>
                  </p>
                  <Link href={`/state/${params.state}/sponsor/${sponsor.people_id}/bills`}>
                    <p className="text-blue-600 cursor-pointer font-semibold"> View Sponsor <span aria-hidden="true">&rarr;</span></p>
                  </Link>
                </div>
              </div>
            </li>
          ))
        ) : (
          <li className="border rounded-lg p-4 shadow-sm bg-white">No sponsors.</li>
        )}
      </ul>
    </>
  )
}