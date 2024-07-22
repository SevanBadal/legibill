import getSearchBill from "./getSearchBill";
import Summary from "./sessionSummary";

export default interface SearchResult {
  summary: Summary;
  [key: string]: getSearchBill | Summary;
}