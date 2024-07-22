// import MasterList from "./masterList";

// export default interface ApiResponse {
//     status: string;
//     masterlist: MasterList;
// }
import SearchResult from "./searchResult";

export default interface ApiResponse {
    status: string;
    searchresult: SearchResult;
}