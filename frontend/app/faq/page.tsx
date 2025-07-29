import React from "react";

export default function FAQPage() {
  return (
    <main className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6">Česta pitanja (FAQ)</h1>
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">
          Kako mogu naručiti proizvode?
        </h2>
        <p>
          Proizvode možete naručiti putem naše web stranice tako da ih dodate u
          košaricu i slijedite upute za plaćanje i dostavu.
        </p>
      </section>
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">
          Koje su mogućnosti plaćanja?
        </h2>
        <p>Prihvaćamo plaćanje karticama, internet bankarstvom i pouzećem.</p>
      </section>
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Koliko traje dostava?</h2>
        <p>Dostava traje 2-5 radnih dana od potvrde narudžbe.</p>
      </section>
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">
          Kako mogu ostvariti povrat?
        </h2>
        <p>
          Povrat proizvoda moguć je u roku od 14 dana od primitka narudžbe.
          Kontaktirajte nas na{" "}
          <a
            href="mailto:info@tejo-nails.hr"
            className="text-blue-600 underline"
          >
            info@tejo-nails.hr
          </a>{" "}
          za detalje.
        </p>
      </section>
      <section>
        <h2 className="text-xl font-semibold mb-2">Imate dodatna pitanja?</h2>
        <p>
          Slobodno nam se obratite putem kontakt forme ili na{" "}
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
