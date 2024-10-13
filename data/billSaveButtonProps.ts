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
    sessionTitle?: string;
    sessionId?: number;
    change_hash?: string;
    changeHash?: string;
  };
}