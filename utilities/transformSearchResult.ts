import ApiResponse from "@/data/apiResponse";
import getSearchBill from "@/data/getSearchBill";
import Summary from "@/data/sessionSummary";

interface TransformedData {
  bills: getSearchBill[];
  summary: Summary;
}

export default function transformData(data: ApiResponse): TransformedData {
  const searchresult = data.searchresult;
  const summary = searchresult.summary as Summary;
  let billsArray: getSearchBill[] = [];

  for (let key in searchresult) {
    if (searchresult.hasOwnProperty(key) && !isNaN(Number(key))) {
      billsArray.push(searchresult[key] as getSearchBill);
    }
  }

  return { bills: billsArray, summary };
}