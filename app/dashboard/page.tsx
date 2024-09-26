'use client'

import { FC, useEffect, useState } from 'react';

import Link from 'next/link';
import BillSaveButton from '../components/BillSaveButton';

const SavedBillsPage: FC = () => {
    const [savedBills, setSavedBills] = useState<Array<any>>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSavedBills = async () => {
            try {
                const response = await fetch('/api/savedBills');
                const result = await response.json();
                setSavedBills(result.savedBills);
            } catch (error) {
                console.error('Error fetching saved bills:', error);
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
            <h1 className="text-2xl font-bold mb-4">Your Saved Bills</h1>
            {savedBills.length === 0 ? (
                <p>You have no saved bills.</p>
            ) : (
                <ul>
                    {savedBills.map((bill) => (
                        <li key={bill.id} className="border-b py-4">
                            <h2 className="text-xl font-semibold">{bill.title}</h2>
                            <p>{bill.state} {bill.sessionTitle}</p>
                            <p>{bill.description}</p>

                            <div className="flex space-x-10 my-4">
                                <BillSaveButton
                                    bill={bill}
                                />
                                <Link
                                    className=" font-semibold leading-6 text-blue-600"
                                    href={`/state/${bill.state}/session/${bill.sessionId}/bill/${bill.legiscanBillId}/history`}>
                                    View Bill <span aria-hidden="true">&rarr;</span>
                                </Link>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default SavedBillsPage;
