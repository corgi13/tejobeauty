import React from "react";

export default function ContactPage() {
  return (
    <main className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6">Kontakt</h1>
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">
          Kako nas možete kontaktirati?
        </h2>
        <p>
          Za sva pitanja, upite ili podršku, slobodno nam se obratite putem
          sljedećih kanala:
        </p>
        <ul className="list-disc list-inside ml-4 mt-2">
          <li>
            Email:{" "}
            <a
              href="mailto:info@tejo-nails.hr"
              className="text-blue-600 underline"
            >
              info@tejo-nails.hr
            </a>
          </li>
          <li>
            Telefon:{" "}
            <a href="tel:+385912345678" className="text-blue-600 underline">
              +385 91 234 5678
            </a>
          </li>
        </ul>
      </section>
      <section>
        <h2 className="text-xl font-semibold mb-2">Adresa</h2>
        <p>
          TEJO NAILS d.o.o.
          <br />
          Primjer Ulica 1,
          <br />
          10000 Zagreb, Hrvatska
        </p>
      </section>
    </main>
  );
}
