import History from "@/data/history";
import { Card, CardBody, Link } from "@nextui-org/react";
import NextLink from "next/link";

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
  const history = billData.bill.history;

  return (
    <>
      <div className="flex justify-center space-x-12 mb-10 text-lg">
        <Link
          href={`/state/${params.state}/session/${params.session}/bill/${bill.bill_id}/history`}
          as={NextLink}
          size="lg"
        >
          <p className="text-blue-600  underline cursor-pointer font-semibold">
            History
          </p>
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
          color="foreground"
          size="lg"
        >
          <p className="cursor-pointer font-semibold">Sponsors</p>
        </Link>
      </div>

      <ul role="list" className="mt-3 max-w-4xl mx-auto ">
        {history.length > 0 ? (
          history.map((history: History) => (
            <li key={history.action} className="w-full my-4">
              <Card className="p-4">
                <CardBody>
                  <p className="line-clamp-1">
                    <strong>Date:</strong> {history.date}
                  </p>
                  <p className="line-clamp-1">
                    <strong>Chamber:</strong> {history.chamber}
                  </p>
                  <p className="line-clamp-1">
                    <strong>Action:</strong> {history.action}
                  </p>
                </CardBody>
              </Card>
            </li>
          ))
        ) : (
          <Card>
            <CardBody>
              <li className=" p-4 ">No history.</li>
            </CardBody>
          </Card>
        )}
      </ul>
    </>
  );
}
