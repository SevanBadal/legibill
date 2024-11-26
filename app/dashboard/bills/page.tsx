"use client";

import { FC, useEffect, useState } from "react";

import NextLink from "next/link";
import BillSaveButton from "@/app/components/BillSaveButton";
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Link,
} from "@nextui-org/react";

const SavedBillsPage: FC = () => {
  const [savedBills, setSavedBills] = useState<Array<any>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSavedBills = async () => {
      try {
        const response = await fetch("/api/bills/savedBills");
        const result = await response.json();
        setSavedBills(result.savedBills);
      } catch (error) {
        console.error("Error fetching saved bills:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedBills();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <div className="flex justify-start space-x-12 mb-10">
        <Link href={"/dashboard/bills"} as={NextLink} size="lg">
          <p className=" cursor-pointer text-blue-600 underline font-semibold">
            Your Saved Bills
          </p>
        </Link>
        <Link
          href={"/dashboard/sponsors"}
          as={NextLink}
          size="lg"
          color="foreground"
        >
          <p className=" font-semibold cursor-pointer">Your Saved Sponsors</p>
        </Link>
      </div>

      {savedBills.length === 0 ? (
        <p>You have no saved bills.</p>
      ) : (
        <ul>
          {savedBills.map((bill) => (
            <li key={bill.id} className="border-b py-4">
              <Card className="p-4">
                <CardHeader>
                  <h2 className="text-xl font-semibold">{bill.title}</h2>
                </CardHeader>
                <CardBody>
                  <p>
                    {bill.state} {bill.sessionTitle}
                  </p>
                  <p>{bill.description}</p>
                </CardBody>

                <CardFooter>
                  <div className="flex space-x-10 my-4">
                    <BillSaveButton bill={bill} />
                    <Link
                      className=" font-semibold leading-6 text-blue-600"
                      href={`/state/${bill.state}/session/${bill.sessionId}/bill/${bill.legiscanBillId}/history`}
                      as={NextLink}
                      size="md"
                    >
                      View Bill <span aria-hidden="true">&rarr;</span>
                    </Link>
                  </div>
                </CardFooter>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SavedBillsPage;
