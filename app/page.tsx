"use client";

import React, { useState } from "react";
import Link from "next/link";
import states from "@/data/states";
import { Input, Card, CardBody } from "@nextui-org/react";

export default function Home() {
  const [filter, setFilter] = useState("");
  const [filteredStates, setFilteredStates] = useState(states);

  const handleFilterChange = (event: any) => {
    const filterValue = event.target.value;
    setFilter(filterValue);

    const filtered = states.filter((state) =>
      state.name.toLowerCase().includes(filterValue.toLowerCase())
    );
    setFilteredStates(filtered);
  };

  return (
    <main className="flex min-h-screen flex-col lg:p-24 p-4 bg-gray-200">
      <Input
        aria-label="Filter states"
        type="text"
        placeholder="Filter states..."
        value={filter}
        onChange={handleFilterChange}
        className="mb-4"
        size="lg"
      />
      <ul className="mt-3 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
        {filteredStates.map((state, index) => {
          return (
            <li key={index} className="w-full">
              <Link href={`/state/${state.abbreviation}`}>
                <Card isHoverable isPressable className="w-full">
                  <CardBody>
                    <p className="text-lg font-semibold">{state.name}</p>
                  </CardBody>
                </Card>
              </Link>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
