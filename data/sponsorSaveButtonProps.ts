export default interface SaveButtonProps {
  sponsor: {
    people_id?: number;
    legiscanPeopleId?: number;
    personHash?: string;
    person_hash?: string;
    stateId?: number;
    state_id?: number;
    party: string;
    role: string;
    name: string;
    suffix?: string;
    district: string;
  };
}