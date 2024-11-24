"use client";

import { Button } from "@nextui-org/react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function GoogleSignInButton() {
  const [isLoading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignIn = async () => {
    setLoading(true);
    try {
      const result = await signIn("google", {
        redirect: false,
        callbackUrl: "/",
      });

      if (result?.ok) {
        router.push(result.url || "/");
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center mt-10">
      <Button
        onClick={handleSignIn}
        disabled={isLoading}
        color="primary"
        size="lg"
        isLoading={isLoading}
      >
        Sign in with Google
      </Button>
    </div>
  );
}
