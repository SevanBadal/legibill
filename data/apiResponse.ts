import SearchResult from "./searchResult";

export default interface ApiResponse {
    status: string;
    searchresult: SearchResult;
}