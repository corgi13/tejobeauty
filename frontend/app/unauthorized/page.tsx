"use client";

import Link from "next/link";
import { useAuth } from "@/lib/hooks/use-auth";

export default function UnauthorizedPage() {
  const { user, logout } = useAuth();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 text-center">
        <div>
          <h1 className="text-4xl font-bold text-red-600">Access Denied</h1>
          <p className="mt-2 text-lg text-gray-600">
            You don't have permission to access this page.
          </p>
        </div>

        <div className="bg-red-50 p-4 rounded-md">
          <p className="text-sm text-red-700">
            Your account ({user?.email}) does not have the required permissions
            to view this resource.
          </p>
        </div>

        <div className="flex flex-col space-y-4">
          <Link
            href="/"
            className="inline-flex justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            Return to Home
          </Link>

          <button
            onClick={logout}
            className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
