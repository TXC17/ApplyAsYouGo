"use client";

import { useEffect, ReactNode } from "react";

interface ClientBodyProps {
  children: ReactNode;
}

export function ClientBody({ children }: ClientBodyProps) {
  // Remove any extension-added classes during hydration
  useEffect(() => {
    // This runs only on the client after hydration
    document.body.className = "antialiased";
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      {children}
    </div>
  );
}
