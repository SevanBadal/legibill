import Vote from "@/data/votes";
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
  const votes = billData.bill.votes

  return (
    <>
      <div className="flex justify-center space-x-12 mb-10 text-lg">
        <Link href={`/state/${params.state}/session/${params.session}/bill/${bill.bill_id}/history`}>
          <p className="cursor-pointer font-semibold">History</p>
        </Link>
        <Link href={`/state/${params.state}/session/${params.session}/bill/${bill.bill_id}/votes`}>
          <p className="text-blue-600 font-semibold underline cursor-pointer">Votes</p>
        </Link>
        <Link href={`/state/${params.state}/session/${params.session}/bill/${bill.bill_id}/sponsors`}>
          <p className="cursor-pointer font-semibold">Sponsors</p>
        </Link>
      </div>

      <ul role="list" className="mt-3 max-w-4xl mx-auto">
        {votes.length > 0 ? (
          votes.map((vote: Vote) => (
            <li key={vote.roll_call_id} className="w-full my-4">
              <div className="border rounded-lg p-4 shadow-sm bg-white">
                <p className='line-clamp-1'><strong>Date:</strong> {vote.date}</p>
                <p className='line-clamp-1'><strong>Chamber:</strong> {vote.chamber}</p>
                <p className='line-clamp-1'><strong>Description:</strong> {vote.desc}</p>
                <p className='line-clamp-1'><strong>Yea:</strong> {vote.yea}</p>
                <p className='line-clamp-1'><strong>Nay:</strong> {vote.nay}</p>
                <p className='line-clamp-1'><strong>NV:</strong> {vote.nv}</p>
                <p className='line-clamp-1'><strong>Absent:</strong> {vote.absent}</p>
                <p className='line-clamp-1'><strong>Total:</strong> {vote.total}</p>
                <p className='line-clamp-1'><strong>Passed:</strong> {vote.passed}</p>
              </div>
            </li>
          ))
        ) : (
          <li className="border rounded-lg p-4 shadow-sm bg-white">No votes.</li>
        )}
      </ul>
    </>
  )
}