import React from "react";

export default function AboutPage() {
  return (
    <main className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6">O nama</h1>
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Naša priča</h2>
        <p>
          TEJO NAILS je nastao iz ljubavi prema ljepoti i kvaliteti. Naša misija
          je pružiti vrhunske proizvode i usluge za njegu noktiju, uz
          profesionalan pristup i brzu dostavu.
        </p>
      </section>
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Zašto odabrati nas?</h2>
        <ul className="list-disc list-inside ml-4">
          <li>Širok asortiman kvalitetnih proizvoda</li>
          <li>Brza i pouzdana dostava</li>
          <li>Stručna podrška i savjetovanje</li>
          <li>Sigurna online kupovina</li>
        </ul>
      </section>
      <section>
        <h2 className="text-xl font-semibold mb-2">Naš tim</h2>
        <p>
          Naš tim čine iskusni stručnjaci iz područja njege noktiju i korisničke
          podrške, posvećeni vašem zadovoljstvu.
        </p>
      </section>
    </main>
  );
}
