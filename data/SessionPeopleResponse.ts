import Session from "./sessions";
import Person from "./People";

export default interface SessionPeopleResponse {
  status: string;
  sessionpeople: {
    session: Session;
    people: Person[];
  };
}

