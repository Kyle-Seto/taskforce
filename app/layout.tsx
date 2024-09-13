import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Header from "@/components/layout/headers";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TaskForce MMO",
  description: "Complete daily tasks with your team and defeat monsters!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className="h-full">
        <body className={`${inter.className} flex flex-col min-h-screen bg-background text-foreground`}>
          <Header />
          <main className="flex-grow">
            {children}
          </main>
        </body>
      </html>
    </ClerkProvider>
  );
}
