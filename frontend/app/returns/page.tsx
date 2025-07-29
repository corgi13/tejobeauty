import React from "react";

export default function ReturnsPage() {
  return (
    <main className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6">Povrat i reklamacije</h1>
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Pravo na povrat</h2>
        <p>
          Kupac ima pravo na povrat proizvoda u roku od 14 dana od dana
          preuzimanja narudžbe, bez navođenja razloga.
        </p>
      </section>
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Postupak povrata</h2>
        <ul className="list-disc list-inside ml-4">
          <li>
            Kontaktirajte nas na{" "}
            <a
              href="mailto:info@tejo-nails.hr"
              className="text-blue-600 underline"
            >
              info@tejo-nails.hr
            </a>{" "}
            s brojem narudžbe i razlogom povrata.
          </li>
          <li>Proizvod mora biti nekorišten i u originalnom pakiranju.</li>
          <li>
            Povrat novca bit će izvršen nakon što zaprimimo i pregledamo vraćeni
            proizvod.
          </li>
        </ul>
      </section>
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Reklamacije</h2>
        <p>
          U slučaju oštećenja ili neispravnosti proizvoda, molimo vas da nas
          kontaktirate odmah po primitku narudžbe. Reklamacije rješavamo u
          najkraćem mogućem roku.
        </p>
      </section>
      <section>
        <h2 className="text-xl font-semibold mb-2">
          Kontakt za povrat i reklamacije
        </h2>
        <p>
          Email:{" "}
          <a
            href="mailto:info@tejo-nails.hr"
            className="text-blue-600 underline"
          >
            info@tejo-nails.hr
          </a>
        </p>
      </section>
    </main>
  );
}
