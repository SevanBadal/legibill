import { NextResponse } from 'next/server';
// import transformData from "@/utilities/transformMasterList";
import transformData from "@/utilities/transformSearchResult";
import getSearchBill from '@/data/getSearchBill';
import Summary from '@/data/sessionSummary';
import PaginationControls from './paginationControls';

async function getSessionBills(sessionID: number, page: number): Promise<{ bills: getSearchBill[], summary: Summary }> {

    try {
        const legiscanApiKey = process.env.LEGI_KEY;
        const res = await fetch(`https://api.legiscan.com/?key=${legiscanApiKey}&op=getSearch&id=${sessionID}&page=${page}`);
        const data = await res.json();

        const transformedData = transformData(data);
        return transformedData; // Return the transformed data directly

    } catch (error) {
        console.error(error);
        return { bills: [], summary: {} as Summary }; // Return empty data in case of error
    }
}



export default async function Page({ params, searchParams }: { params: { session: number }, searchParams: { page: string } }) {

    const currentPage = parseInt(searchParams.page || '1', 10);
    const { bills, summary } = await getSessionBills(params.session, currentPage)

    return (
        <>

            <ul role="list" className="mt-3 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
                {bills.map((bill: getSearchBill) => (
                    <li key={bill.bill_id} className="py-4">
                        <div className="border rounded-lg p-4 shadow-sm bg-white">
                            <div className="border-b min-h-[4.5em] border-gray-200 py-2">
                                <h3 className="line-clamp-2 text-base font-semibold leading-6 text-gray-900">{bill.title}</h3>
                            </div>
                            <p className='line-clamp-1'><strong>Bill Number:</strong> {bill.bill_number}</p>
                            <p className='line-clamp-1'><strong>Last Action:</strong> {bill.last_action}</p>
                            <p className='line-clamp-1'><strong>Last Action Date:</strong> {bill.last_action_date}</p>
                            {/* <p className='line-clamp-1'><strong>Status Date:</strong> {bill.status_date}</p> */}
                            {/* <p className="line-clamp-2 min-h-[3em]">{bill.description}</p>  */}
                            {/* description and status date not accessible from getSearch */}
                            <div className="mt-6 border-t border-gray-900/5 px-3 py-3">
                                <a className="text-sm font-semibold leading-6 text-gray-900" href={bill.url} target="_blank" rel="noopener noreferrer">View Bill <span aria-hidden="true">&rarr;</span></a>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
            <PaginationControls currentPage={currentPage} totalPages={summary.page_total} />
        </>
    )
}