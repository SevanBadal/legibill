"use client";

import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  Button,
  Navbar,
  NavbarContent,
  NavbarItem,
  Link,
} from "@nextui-org/react";
import NextLink from "next/link";

export default function Nav({ session }: { session: boolean }) {
  const pathname = usePathname();
  const isActive = (path: string) => {
    if (path === "/") {
      return pathname === "/" || pathname.startsWith("/state");
    }
    return pathname.startsWith(path);
  };
  return (
    <Navbar isBordered className="bg-slate-900 dark" maxWidth={"full"}>
      <NavbarContent justify="start">
        <NavbarItem>
          <Link
            href="/"
            as={NextLink}
            color={isActive("/") ? "primary" : "foreground"}
          >
            Home
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link
            href="/about"
            as={NextLink}
            color={isActive("/about") ? "primary" : "foreground"}
          >
            About
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link
            href="/contact"
            as={NextLink}
            color={isActive("/contact") ? "primary" : "foreground"}
          >
            Contact
          </Link>
        </NavbarItem>
        {session && (
          <NavbarItem>
            <Link
              href={"/dashboard"}
              as={NextLink}
              color={isActive("/dashboard") ? "primary" : "foreground"}
            >
              Dashboard
            </Link>
          </NavbarItem>
        )}
      </NavbarContent>
      <NavbarContent justify="end">
        {session && (
          <Button as={NextLink} color="primary" href="#">
            <span
              onClick={() => {
                signOut();
              }}
            >
              Logout
            </span>
          </Button>
        )}
        {!session && (
          <NavbarItem>
            <Button href={"/login"} color="primary" as={NextLink}>
              Login
            </Button>
          </NavbarItem>
        )}
        {!session && (
          <NavbarItem>
            <Button href={"/register"} color="primary" as={NextLink}>
              Register
            </Button>
          </NavbarItem>
        )}
      </NavbarContent>
    </Navbar>
  );
}
