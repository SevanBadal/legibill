import History from "@/data/history";
import Link from "next/link";

async function getBillData(billId: number): Promise<any> {
  try {
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
  const history = billData.bill.history

  return (
    <>
      <div className="flex justify-center space-x-12 mb-10 text-lg">
        <Link href={`/state/${params.state}/session/${params.session}/bill/${bill.bill_id}/history`}>
          <p className="text-blue-900  underline cursor-pointer font-semibold">History</p>
        </Link>
        <Link href={`/state/${params.state}/session/${params.session}/bill/${bill.bill_id}/votes`}>
          <p className=" font-semibold cursor-pointer">Votes</p>
        </Link>
        <Link href={`/state/${params.state}/session/${params.session}/bill/${bill.bill_id}/sponsors`}>
          <p className="cursor-pointer font-semibold">Sponsors</p>
        </Link>
      </div>

      <ul role="list" className="mt-3 max-w-4xl mx-auto ">
        {history.length > 0 ? (
          history.map((history: History) => (
            <li key={history.action} className="w-full">
              <div className="border rounded-lg p-4 shadow-sm bg-white my-4">
                <p className='line-clamp-1'><strong>Date:</strong> {history.date}</p>
                <p className='line-clamp-1'><strong>Chamber:</strong> {history.chamber}</p>
                <p className='line-clamp-1'><strong>Action:</strong> {history.action}</p>
              </div>
            </li>
          ))
        ) : (
          <li className="border rounded-lg p-4 shadow-sm bg-white">No history.</li>
        )}
      </ul>
    </>
  )
}