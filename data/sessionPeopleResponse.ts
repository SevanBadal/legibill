import Session from "./sessions";
import Person from "./people";

export default interface SessionPeopleResponse {
  status: string;
  sessionpeople: {
    session: Session;
    people: Person[];
  };
}