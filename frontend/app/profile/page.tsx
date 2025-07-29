import React from "react";

export default function ProfilePage() {
  // Ovdje bi inače išla provjera autentikacije i dohvat korisničkih podataka
  return (
    <main className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6">Moj profil</h1>
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Osobni podaci</h2>
        <p className="mb-2">
          Ime: <span className="font-medium">Vaše ime</span>
        </p>
        <p className="mb-2">
          Email: <span className="font-medium">vas@email.com</span>
        </p>
        {/* Ovdje prikazati ostale podatke iz baze */}
      </section>
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Povijest narudžbi</h2>
        <p>Ovdje će biti prikazana vaša povijest narudžbi.</p>
      </section>
      <section>
        <h2 className="text-xl font-semibold mb-2">Postavke računa</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
          Promijeni lozinku
        </button>
      </section>
    </main>
  );
}
