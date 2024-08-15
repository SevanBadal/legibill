export default interface SaveButtonProps {
  bill: {
    bill_id?: number;
    legiscanBillId?: number;
    title: string;
    description: string;
    state: string;
    session?: {
      session_title?: string;
      session_id?: number;
    };
    change_hash: string;
  };
}