"use client";
import "~/styles/globals.css";
import Header from "~/app/_components/header";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { Toaster } from "~/components/ui/toaster";

import { TRPCReactProvider } from "~/trpc/react";
import { SessionProvider } from "next-auth/react";
import { AuthProvider } from "../lib/authContext";
import { Web3Modal } from "../context/web3modal";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body>
        <SessionProvider>
          <TRPCReactProvider>
            <AuthProvider>
              <Header />
              <Toaster />
              <Web3Modal>{children}</Web3Modal>
            </AuthProvider>
          </TRPCReactProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
