import React from "react";

export default function ShippingPage() {
  return (
    <main className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6">Dostava</h1>
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Područje dostave</h2>
        <p>Dostavu vršimo na području cijele Republike Hrvatske.</p>
      </section>
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Rok isporuke</h2>
        <p>Rok isporuke je 2-5 radnih dana od potvrde narudžbe.</p>
      </section>
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Cijena dostave</h2>
        <p>
          Cijena dostave iznosi 4,00 EUR za narudžbe do 50 EUR. Za narudžbe
          iznad 50 EUR dostava je besplatna.
        </p>
      </section>
      <section>
        <h2 className="text-xl font-semibold mb-2">Praćenje pošiljke</h2>
        <p>
          Nakon slanja narudžbe, primit ćete email s brojem za praćenje
          pošiljke.
        </p>
      </section>
    </main>
  );
}
