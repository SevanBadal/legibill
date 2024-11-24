import transformData from "@/utilities/transformSearchResult";
import getSearchBill from "@/data/getSearchBill";
import Summary from "@/data/sessionSummary";
import PaginationControls from "./paginationControls";
import NextLink from "next/link";
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Link,
} from "@nextui-org/react";

async function getSessionBills(
  sessionID: any,
  page: any
): Promise<{ bills: getSearchBill[]; summary: Summary }> {
  try {
    // Convert sessionID and page to numbers and validate
    const numericSessionID = Number(sessionID);
    const numericPage = Number(page);

    // Check if sessionID is a valid number
    if (isNaN(numericSessionID) || numericSessionID <= 0) {
      console.error("Invalid session id:", sessionID);
      throw new Error("Invalid session id");
    }

    // Check if page is a valid number
    if (isNaN(numericPage) || numericPage <= 0) {
      console.error("Invalid page:", page);
      throw new Error("Invalid page");
    }

    console.log(
      "Fetching data with sessionID:",
      numericSessionID,
      "and page:",
      numericPage
    );

    const legiscanApiKey = process.env.LEGI_KEY;
    if (!legiscanApiKey) {
      throw new Error("LegiScan API key is missing");
    }

    const res = await fetch(
      `https://api.legiscan.com/?key=${legiscanApiKey}&op=getSearch&id=${numericSessionID}&page=${numericPage}`
    );
    const data = await res.json();

    const transformedData = transformData(data);
    return transformedData; // Return the transformed data directly
  } catch (error) {
    console.error("Error fetching session bills:", error);
    return { bills: [], summary: {} as Summary }; // Return empty data in case of error
  }
}

export default async function SessionBills({
  params,
  searchParams,
}: {
  params: { session: number; state: string };
  searchParams: { page: string };
}) {
  const currentPage = parseInt(searchParams.page || "1", 10);
  const { bills, summary } = await getSessionBills(params.session, currentPage);

  return (
    <>
      <ul
        role="list"
        className="mt-3 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4"
      >
        {bills.map((bill: getSearchBill) => (
          <li key={bill.bill_id} className="py-4">
            <Card>
              <CardHeader className="border-b min-h-[4.5em] border-gray-200 py-2">
                <h3 className="line-clamp-2 text-base font-semibold leading-6 ">
                  {bill.title}
                </h3>
              </CardHeader>
              <CardBody>
                <p className="line-clamp-1">
                  <strong>Bill Number:</strong> {bill.bill_number}
                </p>
                <p className="line-clamp-1">
                  <strong>Last Action:</strong> {bill.last_action}
                </p>
                <p className="line-clamp-1">
                  <strong>Last Action Date:</strong> {bill.last_action_date}
                </p>

                <CardFooter className="mt-6 border-t border-gray-900/5 px-3 py-3">
                  <Link
                    href={`/state/${params.state}/session/${params.session}/bill/${bill.bill_id}/history`}
                    as={NextLink}
                  >
                    <p className="text-sm font-semibold leading-6 ">
                      View Bill
                      <span aria-hidden="true">&rarr;</span>
                    </p>
                  </Link>
                </CardFooter>
              </CardBody>
            </Card>
          </li>
        ))}
      </ul>
      <PaginationControls
        currentPage={currentPage}
        totalPages={summary.page_total}
      />
    </>
  );
}
