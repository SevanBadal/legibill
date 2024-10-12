'use client'

import { FC, useEffect, useState } from 'react';

import Link from 'next/link';
import SponsorSaveButton from '@/app/components/SponsorSaveButton';
import { stateIdToAbbreviation } from '@/utilities/stateMap';

const SavedSponsorsPage: FC = () => {

  const [savedSponsors, setSavedSponsors] = useState<Array<any>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSavedSponsors = async () => {
      try {
        const response = await fetch('/api/savedSponsors');
        const result = await response.json();
        setSavedSponsors(result.savedSponsors);
      } catch (error) {
        console.error('Error fetching saved sponsors:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedSponsors();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }


  return (
    <div>
      <div className="flex justify-start space-x-12 mb-10 text-2xl">
        <Link href={"/dashboard/bills"}>
          <p className=" cursor-pointer font-semibold">Your Saved Bills</p>
        </Link>
        <Link href={"dashboard/sponsors"}>
          <p className=" font-semibold cursor-pointer text-blue-600 underline">Your Saved Sponsors</p>
        </Link>
      </div>

      {savedSponsors.length === 0 ? (
        <p>You have no saved sponsors.</p>
      ) : (
        <ul>
          {savedSponsors.map((sponsor) => (
            <li key={sponsor.people_id} className="w-full my-4">
              <div className="border rounded-lg p-4 shadow-sm bg-white">
                <p className='line-clamp-1'><strong>{sponsor.role}. {sponsor.name} {sponsor.suffix} ({sponsor.party})</strong></p>
                <p className='line-clamp-1'><strong>District:</strong> {sponsor.district}</p>
                <div className="flex space-x-10 my-4">
                  <SponsorSaveButton sponsor={sponsor} />
                  <Link href={`/state/${stateIdToAbbreviation[sponsor.stateId]}/sponsor/${sponsor.legiscanPeopleId}/bills`}>
                    <p className="text-blue-600 cursor-pointer font-semibold"> View Sponsor <span aria-hidden="true">&rarr;</span></p>
                  </Link>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

    </div>
  );

};

export default SavedSponsorsPage;
