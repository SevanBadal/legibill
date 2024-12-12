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
  SharedSelection,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { Form } from "@nextui-org/form";

export default function Home() {
  const router = useRouter();
  const [filter, setFilter] = useState("");
  const [filteredStates, setFilteredStates] = useState(states);
  const [formData, setFormData] = useState<{
    query: string;
    state: string[];
    year: string;
  }>({
    query: "",
    state: [],
    year: "",
  });

  const currentYear = new Date().getFullYear();

  const years = Array.from({ length: currentYear + 2 - 2010 }, (_, index) => {
    const year = currentYear + 1 - index;
    return { key: year.toString(), label: year.toString() };
  });

  const handleFilterChange = (event: any) => {
    const filterValue = event.target.value;
    setFilter(filterValue);

    const filtered = states.filter((state) =>
      state.name.toLowerCase().includes(filterValue.toLowerCase())
    );
    setFilteredStates(filtered);
  };

  const handleQueryChange = (type: string, value: string | string[]) => {
    setFormData((prevData) => {
      return {
        ...prevData,
        [type]: value,
      };
    });
  };

  const handleStateSelection = (value: SharedSelection) => {
    if (typeof value === "string") {
      const selectedStates = value.split(",").map((v) => v.trim());
      handleQueryChange("state", selectedStates);
    } else if (value instanceof Set) {
      const selectedStates = Array.from(value).map((val) => val.toString());
      handleQueryChange("state", selectedStates);
    }
  };

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    const params = new URLSearchParams();

    if (formData.query) params.append("query", formData.query);
    formData.state.forEach((st) => params.append("state", st));
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
          label="Select state(s)"
          radius="lg"
          items={states}
          selectionMode="multiple"
          onSelectionChange={handleStateSelection}
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
