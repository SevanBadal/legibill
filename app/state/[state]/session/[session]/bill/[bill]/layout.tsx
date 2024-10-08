import Link from "next/link";
import BillSaveButton from "../../../../../../components/BillSaveButton";

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

export default async function BillLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: { session: number; state: string, bill: string }
}) {

  const billData = await getBillData(Number(params.bill))
  const bill = billData.bill

  return (
    <>
      <div className="border rounded-lg p-4 shadow-sm ">
        <Link href={`/state/${params.state}/session/${params.session}`}>
          <p className=" cursor-pointer text-gray-700 mb-5"><span aria-hidden="true">&larr;</span> Back to Session Bills</p>
        </Link>
        <p className="font-bold text-xl">{bill.title}</p>
        <p className="my-4">{params.state} {bill.session.session_title}</p>
        <p> {bill.description} </p>

        <div className="flex space-x-10 my-4">
          <BillSaveButton
            bill={bill}
          />
          <a
            className=" font-semibold leading-6 text-blue-600"
            href={bill.url} target="_blank" rel="noopener noreferrer">
            View Bill <span aria-hidden="true">&rarr;</span>
          </a>
        </div>
      </div>

      <div className='p-4 bg-gray-200 min-h-screen'>
        {children}
      </div>
    </>
  )
}