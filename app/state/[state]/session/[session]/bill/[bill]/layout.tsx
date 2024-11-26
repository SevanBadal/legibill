import BillSaveButton from "@/app/components/BillSaveButton";
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Link,
} from "@nextui-org/react";
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

export default async function BillLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { session: number; state: string; bill: string };
}) {
  const billData = await getBillData(Number(params.bill));
  const bill = billData.bill;

  return (
    <>
      <Card className="p-4">
        <Link
          href={`/state/${params.state}/session/${params.session}`}
          as={NextLink}
        >
          <p className=" cursor-pointer text-gray-700v p-4">
            <span aria-hidden="true">&larr;</span> Back to Session Bills
          </p>
        </Link>
        <CardHeader className="font-bold text-xl">{bill.title}</CardHeader>
        <CardBody>
          <p className="my-4">
            {params.state} {bill.session.session_title}
          </p>
          <p> {bill.description} </p>
        </CardBody>

        <CardFooter className="flex space-x-10 my-4">
          <BillSaveButton bill={bill} />
          <Link
            className=" font-semibold leading-6 text-blue-600"
            href={bill.url}
            isExternal
          >
            View Bill <span aria-hidden="true">&rarr;</span>
          </Link>
        </CardFooter>
      </Card>

      <div className="p-4 min-h-screen">{children}</div>
    </>
  );
}
