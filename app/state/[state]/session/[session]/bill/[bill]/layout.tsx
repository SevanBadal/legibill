

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
        <p className="font-bold text-xl">{bill.title}</p>
        <p className="my-4">{params.state} {bill.session.session_title}</p>
        <p> {bill.description} </p>

        <div className="flex space-x-10 my-4">
          <p className=" font-semibold leading-6 text-blue-900">
            Save <span aria-hidden="true">☆</span>
          </p>
          <a
            className=" font-semibold leading-6 text-blue-900"
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