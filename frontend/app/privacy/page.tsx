import React from "react";

export default function PrivacyPage() {
  return (
    <main className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6">Pravila privatnosti</h1>
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">
          Vaša privatnost nam je važna
        </h2>
        <p>
          Ova stranica opisuje kako prikupljamo, koristimo i štitimo vaše osobne
          podatke prilikom korištenja naše platforme. Prikupljamo samo nužne
          podatke za pružanje usluge i nikada ih ne dijelimo s trećim stranama
          bez vašeg pristanka.
        </p>
      </section>
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">
          Koje podatke prikupljamo?
        </h2>
        <ul className="list-disc list-inside ml-4">
          <li>Ime i prezime</li>
          <li>Email adresu</li>
          <li>Adresa za dostavu</li>
          <li>Telefonski broj</li>
          <li>Povijest narudžbi</li>
        </ul>
      </section>
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">
          Kako koristimo vaše podatke?
        </h2>
        <ul className="list-disc list-inside ml-4">
          <li>Za obradu i dostavu narudžbi</li>
          <li>Za komunikaciju vezanu uz narudžbe</li>
          <li>Za poboljšanje korisničkog iskustva</li>
          <li>Za ispunjavanje zakonskih obveza</li>
        </ul>
      </section>
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Vaša prava</h2>
        <p>
          Imate pravo zatražiti pristup, ispravak ili brisanje svojih osobnih
          podataka. Također možete povući privolu za obradu podataka u bilo
          kojem trenutku.
        </p>
      </section>
      <section>
        <h2 className="text-xl font-semibold mb-2">Kontakt</h2>
        <p>
          Za sva pitanja ili zahtjeve vezane uz privatnost, kontaktirajte nas na{" "}
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
