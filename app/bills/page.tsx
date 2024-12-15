import getSearchBill from "@/data/getSearchBill";
import transformData from "@/utilities/transformSearchResult";
import NextLink from "next/link";
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Link,
} from "@nextui-org/react";
import PaginationControls from "@/app/components/paginationControls";

async function getSearchData(
  query: string,
  page: any,
  year?: string,
  state?: string
): Promise<any> {
  const legiscanApiKey = process.env.LEGI_KEY;
  const numericPage = Number(page);
  const url = `https://api.legiscan.com/?key=${legiscanApiKey}&op=getSearch&query=${query}&state=${state}&year=${year}&page=${numericPage}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (data.status === "OK") {
      const transformedData = transformData(data);
      return transformedData;
    }
  } catch (error: any) {
    console.error(`API Error for query ${query}:`);
    return null;
  }
}

export default async function BillSearchPage({
  searchParams,
}: {
  searchParams: { query: string; state?: string; year?: string; page?: string };
}) {
  const currentPage = parseInt(searchParams.page || "1", 10);
  const { bills, summary } = await getSearchData(
    searchParams.query,
    searchParams.page,
    searchParams.year,
    searchParams.state
  );

  const { query, state, year } = searchParams;

  const params = new URLSearchParams();

  if (query) params.append("query", query);
  if (year) params.append("year", year);
  if (state) {
    let states: string[] = [];

    if (Array.isArray(state)) {
      states = state;
    }

    states.forEach((st) => {
      params.append("state", st);
    });
  }

  const queryString = params.toString();

  return (
    <>
      {bills && bills.length > 0 ? (
        <div>
          <h1 className="font-bold text-2xl">
            Search Results for: {searchParams.query}
          </h1>
          <p className="mt-4">
            {summary.count} bills, page {summary.page}
          </p>
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
                      <strong>State:</strong> {bill.state}
                    </p>
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
                        href={`/state/${bill.state}/session/${bill.session}/bill/${bill.bill_id}/history`}
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
            queryParams={queryString}
          />
        </div>
      ) : (
        <div className="p-10">
          <h1 className="font-bold text-2xl">
            No Results found for: {searchParams.query}
          </h1>
          <p className="text-xl mt-4">
            {searchParams.state} {searchParams.year}
          </p>
        </div>
      )}
    </>
  );
}
