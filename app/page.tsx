"use client";

import React, { useState } from "react";
import Link from "next/link";
import states from "@/data/states";
import {
  Input,
  Card,
  CardBody,
  Button,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { Form } from "@nextui-org/form";

const currentYear = new Date().getFullYear();

export const years = Array.from(
  { length: currentYear + 2 - 2009 },
  (_, index) => {
    const year = currentYear + 1 - index;
    return { key: year.toString(), label: year.toString() };
  }
);

export default function Home() {
  const router = useRouter();
  const [filter, setFilter] = useState("");
  const [filteredStates, setFilteredStates] = useState(states);
  const [formData, setFormData] = useState({
    query: "",
    state: "",
    year: "",
  });

  const handleFilterChange = (event: any) => {
    const filterValue = event.target.value;
    setFilter(filterValue);

    const filtered = states.filter((state) =>
      state.name.toLowerCase().includes(filterValue.toLowerCase())
    );
    setFilteredStates(filtered);
  };

  const handleQueryChange = (type: string, value: string) => {
    setFormData((prevData) => {
      return {
        ...prevData,
        [type]: value,
      };
    });
  };

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    const params = new URLSearchParams();

    if (formData.query) params.append("query", formData.query);
    if (formData.state) params.append("state", formData.state);
    if (formData.year) params.append("year", formData.year);

    const queryString = params.toString();

    router.push(`/bills?${queryString}`);
  };

  return (
    <main className="flex min-h-screen flex-col lg:py-10 lg:px-24 p-4 bg-gray-200">
      <Form
        onSubmit={handleSearch}
        validationBehavior="native"
        className="space-y-4"
      >
        <h2 className="font-bold text-2xl">Search bills by keyword</h2>
        <Input
          aria-label="Search bills by keyword"
          type="text"
          placeholder="health, education, etc."
          value={formData.query}
          onValueChange={(value) => handleQueryChange("query", value)}
          className="my-4"
          size="lg"
          required={true}
        />
        <Select
          className="max-w-xs"
          label="Select a state"
          radius="lg"
          items={states}
          onSelectionChange={(value) =>
            handleQueryChange("state", value.currentKey?.toString() || "")
          }
          popoverProps={{
            classNames: {
              content: "max-h-64",
            },
          }}
        >
          {(state) => (
            <SelectItem key={state.abbreviation}>{state.name}</SelectItem>
          )}
        </Select>

        <Select
          className="max-w-xs"
          label="Select a year"
          radius="lg"
          items={years}
          onSelectionChange={(value) =>
            handleQueryChange("year", value.currentKey?.toString() || "")
          }
          popoverProps={{
            classNames: {
              content: "max-h-64",
            },
          }}
        >
          {(year) => <SelectItem key={year.key}>{year.label}</SelectItem>}
        </Select>

        <Button type="submit" color="primary">
          Search
        </Button>
      </Form>
      <h2 className="font-bold text-2xl mt-20">Explore bills by state</h2>
      <Input
        aria-label="Filter states"
        type="text"
        placeholder="Filter states..."
        value={filter}
        onChange={handleFilterChange}
        className="my-4"
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
