'use client'

import { FC, useEffect, useState } from 'react';

import Link from 'next/link';

const SavedSponsorsPage: FC = () => {

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

      <p>You have no saved sponsors.</p>

    </div>
  );

};

export default SavedSponsorsPage;
