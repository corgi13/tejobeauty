"use client";

import { useEffect, useState } from "react";
import { authService } from "@/lib/auth";

interface ClientProvidersProps {
  children: React.ReactNode;
}

export default function ClientProviders({ children }: ClientProvidersProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Initialize auth service only on client side
    if (typeof window !== "undefined") {
      // Auth service will initialize automatically
    }
  }, []);

  if (!isClient) {
    // Return a loading state or the children without client-side features
    return <>{children}</>;
  }

  return <>{children}</>;
}
