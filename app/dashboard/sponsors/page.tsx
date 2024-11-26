"use client";

import { FC, useEffect, useState } from "react";

import NextLink from "next/link";
import SponsorSaveButton from "@/app/components/SponsorSaveButton";
import { stateIdToAbbreviation } from "@/utilities/stateMap";
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Link,
} from "@nextui-org/react";

const SavedSponsorsPage: FC = () => {
  const [savedSponsors, setSavedSponsors] = useState<Array<any>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSavedSponsors = async () => {
      try {
        const response = await fetch("/api/sponsors/savedSponsors");
        const result = await response.json();
        setSavedSponsors(result.savedSponsors);
      } catch (error) {
        console.error("Error fetching saved sponsors:", error);
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
        <Link
          href={"/dashboard/bills"}
          as={NextLink}
          size="lg"
          color="foreground"
        >
          <p className=" cursor-pointer font-semibold">Your Saved Bills</p>
        </Link>
        <Link href={"dashboard/sponsors"} as={NextLink} size="lg">
          <p className=" font-semibold cursor-pointer text-blue-600 underline">
            Your Saved Sponsors
          </p>
        </Link>
      </div>

      {savedSponsors.length === 0 ? (
        <p>You have no saved sponsors.</p>
      ) : (
        <ul>
          {savedSponsors.map((sponsor) => (
            <li key={sponsor.people_id} className="w-full my-4">
              <Card>
                <div className="p-4">
                  <CardHeader>
                    <p className="line-clamp-1 text-xl">
                      <strong>
                        {sponsor.role}. {sponsor.name} {sponsor.suffix} (
                        {sponsor.party})
                      </strong>
                    </p>
                  </CardHeader>
                  <CardBody>
                    <p className="line-clamp-1">
                      <strong>District:</strong> {sponsor.district}
                    </p>
                  </CardBody>
                  <CardFooter>
                    <div className="flex space-x-10 my-4">
                      <SponsorSaveButton sponsor={sponsor} />
                      <Link
                        href={`/state/${
                          stateIdToAbbreviation[sponsor.stateId]
                        }/sponsor/${sponsor.legiscanPeopleId}/bills`}
                        as={NextLink}
                        size="md"
                      >
                        <p className="text-blue-600 cursor-pointer font-semibold">
                          {" "}
                          View Sponsor <span aria-hidden="true">&rarr;</span>
                        </p>
                      </Link>
                    </div>
                  </CardFooter>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SavedSponsorsPage;
