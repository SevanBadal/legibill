import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Nav from "./nav";
import { getServerSession } from "next-auth";
import { Suspense } from "react";
import Loading from "./loading";
import Providers from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LegiBill",
  description: "Navigate your local legislation",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();
  return (
    <html lang="en" className="text-foreground bg-background">
      <body className={inter.className}>
        <Providers>
          <Nav session={!!session} />
          <div className="p-4 min-h-screen bg-gray-200">
            <Suspense fallback={<Loading />}>{children}</Suspense>
          </div>
        </Providers>
      </body>
    </html>
  );
}
