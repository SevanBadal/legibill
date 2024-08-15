'use client'

import { FC, useState, useEffect } from 'react';
import SaveButtonProps from '@/data/saveButtonProps';

const SaveButton: FC<SaveButtonProps> = ({ bill }) => {
  const [isSaved, setIsSaved] = useState(false);
  const [savedBillId, setSavedBillId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const legiscanBillId = bill.bill_id || bill.legiscanBillId;

  // Check if the bill is already saved when the component mounts
  useEffect(() => {

    const fetchIsSaved = async () => {
      try {
        console.log('Checking if bill is saved...');
        const response = await fetch(`/api/checkSavedBill?legiscanBillId=${legiscanBillId}`);
        const result = await response.json();
        console.log('Check result:', result);
        if (result.savedBill) {
          setIsSaved(true);
          setSavedBillId(result.savedBill.id); // Save the id for unsaving later
          console.log('Bill is saved:', result.savedBill.id);
        }
      } catch (error) {
        console.error('Error checking if bill is saved:', error);
      } finally {
        setLoading(false); // Ensure loading state is false regardless of success or error
      }
    };

    fetchIsSaved();
  }, [bill]);

  const handleClick = async () => {
    if (!bill) {
      console.error('Bill object is undefined');
      return;
    }

    try {
      // Optimistically update the state before the async operation
      setIsSaved(!isSaved);
      console.log('Toggling save state...');

      if (isSaved && savedBillId) {
        // If the bill is saved, should remove it
        const response = await fetch('/api/unsaveBill', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: savedBillId }),
        });

        if (!response.ok) {
          // If the request fails, revert the state
          setIsSaved(true);
          console.error('Failed to unsave bill');
        } else {
          setSavedBillId(null); // Clear the saved bill ID
          console.log('Bill unsaved successfully');
        }
      } else {
        // If the bill is not saved, save it
        const response = await fetch('/api/saveBill', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            legiscanBillId: bill.bill_id,
            title: bill.title,
            description: bill.description,
            state: bill.state,
            sessionTitle: bill.session?.session_title ?? 'Unknown Session',
            sessionId: bill.session?.session_id ?? 0,
            changeHash: bill.change_hash,
          }),
        });

        const result = await response.json();

        if (!response.ok) {
          // If the request fails, revert the state
          setIsSaved(false);
          console.error('Failed to save bill');
        } else {
          setSavedBillId(result.savedBill.id); // Save the bill ID
          console.log('Bill saved successfully:', result.savedBill.id);
        }
      }
    } catch (error) {
      console.error('Error handling save/unsave:', error);
    }
  };

  if (loading) {
    return <p>Loading...</p>; // Show a loading state while checking if the bill is saved
  }

  return (
    <p className="font-semibold leading-6 text-blue-600 cursor-pointer" onClick={handleClick}>
      {isSaved ? 'Unsave ★' : 'Save ☆'}
    </p>
  );
};

export default SaveButton;