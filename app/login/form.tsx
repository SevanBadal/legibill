"use client";

import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import GoogleSignInButton from "../components/GoogleSignInButton";
import { Button, Input } from "@nextui-org/react";

export default function Form() {
  const router = useRouter();
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const response = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: true,
      callbackUrl: "/",
    });

    if (response?.error) {
      {
        setError("Invalid email/password.");
      }
    }
  };
  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-2 mx-auto max-w-md"
      >
        <h1 className="text-xl mb-10 font-semibold">
          Login to an existing Account
        </h1>
        <label>Email</label>
        <Input name="email" type="email" required={true} variant="faded" />
        <label>Password</label>
        <Input
          name="password"
          type="password"
          required={true}
          variant="faded"
        />
        {error && <p className="text-red-500">{error}</p>}
        <Button className="mt-10" type="submit" variant="flat" color="primary">
          Submit
        </Button>
        <div className="flex items-center mt-10">
          <hr className="flex-grow border-t border-gray-300" />
          <span className="mx-4 text-gray-600">or</span>
          <hr className="flex-grow border-t border-gray-300" />
        </div>
      </form>
      <GoogleSignInButton />
    </>
  );
}
