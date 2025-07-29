import React from "react";

export default function TermsPage() {
  return (
    <main className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6">Opći uvjeti korištenja</h1>
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">1. Uvod</h2>
        <p>
          Ovi Opći uvjeti korištenja reguliraju korištenje platforme TEJO NAILS.
          Korištenjem ove web stranice prihvaćate ove uvjete u cijelosti.
        </p>
      </section>
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">2. Uvjeti kupnje</h2>
        <ul className="list-disc list-inside ml-4">
          <li>Sve cijene su izražene u eurima (EUR) i uključuju PDV.</li>
          <li>Narudžbe se obrađuju nakon potvrde plaćanja.</li>
          <li>
            Zadržavamo pravo izmjene cijena i uvjeta bez prethodne najave.
          </li>
        </ul>
      </section>
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">3. Dostava i povrat</h2>
        <ul className="list-disc list-inside ml-4">
          <li>Dostava se vrši na području Republike Hrvatske.</li>
          <li>Rok isporuke je 2-5 radnih dana od potvrde narudžbe.</li>
          <li>
            Povrat proizvoda moguć je u roku od 14 dana od primitka narudžbe.
          </li>
        </ul>
      </section>
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">4. Odgovornost</h2>
        <p>
          TEJO NAILS ne odgovara za eventualne štete nastale korištenjem ove
          platforme, osim u slučajevima propisanim zakonom.
        </p>
      </section>
      <section>
        <h2 className="text-xl font-semibold mb-2">5. Kontakt</h2>
        <p>
          Za sva pitanja ili reklamacije obratite nam se na{" "}
          <a
            href="mailto:info@tejo-nails.hr"
            className="text-blue-600 underline"
          >
            info@tejo-nails.hr
          </a>
          .
        </p>
      </section>
    </main>
  );
}
