import React from "react";

export default function OrdersPage() {
  // Ovdje bi inače išao dohvat narudžbi iz baze za prijavljenog korisnika
  return (
    <main className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6">Moje narudžbe</h1>
      <section>
        <h2 className="text-xl font-semibold mb-4">Povijest narudžbi</h2>
        <p>
          Ovdje će biti prikazana vaša povijest narudžbi s detaljima svake
          narudžbe.
        </p>
        {/* Prikazati tablicu narudžbi kada backend bude povezan */}
      </section>
    </main>
  );
}
