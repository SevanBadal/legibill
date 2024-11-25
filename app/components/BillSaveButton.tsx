"use client";

import { FC, useState, useEffect } from "react";
import SaveButtonProps from "@/data/billSaveButtonProps";

const BillSaveButton: FC<SaveButtonProps> = ({ bill }) => {
  const [isSaved, setIsSaved] = useState(false);
  const [savedBillId, setSavedBillId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  const legiscanBillId = bill.bill_id || bill.legiscanBillId;

  // Check if the bill is already saved when the component mounts
  useEffect(() => {
    const fetchIsSaved = async () => {
      try {
        const response = await fetch(
          `/api/bills/checkSavedBill?legiscanBillId=${legiscanBillId}`
        );
        const result = await response.json();
        if (result.savedBill) {
          setIsSaved(true);
          setSavedBillId(result.savedBill.id); // Save the id for unsaving later
        }
      } catch (error) {
        console.error("Error checking if bill is saved:", error);
      } finally {
        setLoading(false); // Ensure loading state is false regardless of success or error
      }
    };

    fetchIsSaved();
  }, [bill]);

  const handleClick = async () => {
    if (isProcessing || !bill) {
      return;
    }

    setIsProcessing(true); // Block further requests until this one is done

    try {
      const currentSavedState = isSaved;

      // Optimistically update the state
      setIsSaved(!isSaved);

      if (currentSavedState && savedBillId) {
        // If the bill is saved, should remove it
        const response = await fetch("/api/bills/unsaveBill", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: savedBillId }),
        });

        if (!response.ok) {
          // If the unsave operation fails, revert the UI state
          setIsSaved(currentSavedState);
          console.error("Failed to unsave bill");
        } else {
          setSavedBillId(null); // Clear the saved bill ID
        }
      } else {
        // If the bill is not saved, save it
        const response = await fetch("/api/bills/saveBill", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            legiscanBillId: bill.legiscanBillId || bill.bill_id,
            title: bill.title,
            description: bill.description,
            state: bill.state,
            sessionTitle: bill.sessionTitle || bill.session?.session_title,
            sessionId: bill.sessionId || bill.session?.session_id,
            changeHash: bill.changeHash || bill.change_hash,
          }),
        });

        if (!response.ok) {
          // If the save operation fails, revert the UI state
          setIsSaved(currentSavedState);
          console.error("Failed to save bill");
        } else {
          const result = await response.json();
          setSavedBillId(result.savedBill.id); // Save the bill ID
        }
      }
    } catch (error) {
      console.error("Error handling save/unsave:", error);
    } finally {
      setIsProcessing(false); // Allow further requests
    }
  };

  if (loading) {
    return <p>Loading...</p>; // Show a loading state while checking if the bill is saved
  }

  return (
    <p
      className="font-semibold leading-6 text-blue-600 cursor-pointer"
      onClick={handleClick}
    >
      {isSaved ? "Unsave ★" : "Save ☆"}
    </p>
  );
};

export default BillSaveButton;
