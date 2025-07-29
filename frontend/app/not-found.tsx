import React from "react";
import Link from "next/link";

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <h1 className="text-5xl font-bold text-pink-600 mb-4">404</h1>
      <h2 className="text-2xl font-bold mb-2">Stranica nije pronađena</h2>
      <p className="mb-6 text-gray-600">
        Žao nam je, tražena stranica ne postoji ili je premještena.
      </p>
      <Link
        href="/"
        className="bg-pink-600 text-white px-6 py-2 rounded font-bold hover:bg-pink-700 transition"
      >
        Povratak na početnu
      </Link>
    </div>
  );
};

export default NotFoundPage;
