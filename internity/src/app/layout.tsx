import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClientBody } from "./ClientBody";
import { AuthProvider } from "./context/context";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Apply As You Go Career | Enabling Tomorrow's On-Demand Workforce",
  description: "Discover Apply As You Go, an AI-driven tool designed to streamline your job search. Put your job search and resume curation on auto-pilot.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.className} bg-black text-white bg-noise min-h-screen antialiased`}>
        <ClientBody>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ClientBody>
      </body>
    </html>
  );
}
