"use client";

import { FC, useState, useEffect } from "react";
import SaveButtonProps from "@/data/sponsorSaveButtonProps";

export const maxDuration = 60;

const SponsorSaveButton: FC<SaveButtonProps> = ({ sponsor }) => {
  const [isSaved, setIsSaved] = useState(false);
  const [savedSponsorId, setSavedSponsorId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  console.log("sponsor from savebtn", sponsor);

  const legiscanPeopleId = sponsor.people_id || sponsor.legiscanPeopleId;

  // Check if the sponsor is already saved when the component mounts
  useEffect(() => {
    const abortController = new AbortController();

    const fetchIsSaved = async () => {
      try {
        console.log("sponsor btn useeffect", sponsor);
        const response = await fetch(
          `/api/sponsors/checkSavedSponsor?legiscanPeopleId=${legiscanPeopleId}`,
          { signal: abortController.signal }
        );
        const result = await response.json();
        if (result.savedSponsor) {
          setIsSaved(true);
          setSavedSponsorId(result.savedSponsor.id); // Save the id for unsaving later
        }
      } catch (error: any) {
        if (error.name === "AbortError") {
          console.log("Fetch aborted");
        } else {
          console.error("Error checking if sponsor is saved:", error);
        }
      } finally {
        setLoading(false); // Ensure loading state is false regardless of success or error
      }
    };

    fetchIsSaved();
    return () => {
      abortController.abort();
    };
  }, [sponsor]);

  const handleClick = async () => {
    if (isProcessing || !sponsor) {
      return;
    }

    setIsProcessing(true); // Block further requests until this one is done

    try {
      const currentSavedState = isSaved;

      // Optimistically update the state
      setIsSaved(!isSaved);

      if (currentSavedState && savedSponsorId) {
        // If the sponsor is saved, should remove it
        const response = await fetch("/api/sponsors/unsaveSponsor", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: savedSponsorId }),
        });

        if (!response.ok) {
          // If the unsave operation fails, revert the UI state
          setIsSaved(currentSavedState);
          console.error("Failed to unsave sponsor");
        } else {
          setSavedSponsorId(null); // Clear the saved sponsor ID
        }
      } else {
        // If the sponsor is not saved, save it
        const response = await fetch("/api/sponsors/saveSponsor", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            legiscanPeopleId: sponsor.legiscanPeopleId || sponsor.people_id,
            personHash: sponsor.personHash || sponsor.person_hash,
            stateId: sponsor.stateId || sponsor.state_id,
            party: sponsor.party,
            role: sponsor.role,
            name: sponsor.name,
            suffix: sponsor.suffix,
            district: sponsor.district,
          }),
        });

        if (!response.ok) {
          // If the save operation fails, revert the UI state
          setIsSaved(currentSavedState);
          console.error("Failed to save sponsor");
        } else {
          const result = await response.json();
          setSavedSponsorId(result.savedSponsor.id); // Save the sponsor ID
        }
      }
    } catch (error) {
      console.error("Error handling save/unsave:", error);
    } finally {
      setIsProcessing(false); // Allow further requests
    }
  };

  if (loading) {
    return <p>Loading...</p>; // Show a loading state while checking if the sponsor is saved
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

export default SponsorSaveButton;
