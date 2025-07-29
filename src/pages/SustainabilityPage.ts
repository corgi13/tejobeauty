import path from "path";

import express from "express";

import CertificationService from "../services/CertificationService";

const router = express.Router();

/**
 * @route GET /sustainability
 * @desc Prikazuje landing stranicu održivosti s KPI-jevima
 */
router.get("/", async (req, res) => {
  try {
    const co2Savings = await CertificationService.calculateTotalCO2Savings();
    const certifications = await CertificationService.getAllCertifications();

    // Ovdje bi se normalno koristio view engine poput EJS ili Pug
    // Prikazujemo jednostavan HTML za demonstraciju
    const html = `
    <!DOCTYPE html>
    <html lang="hr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Tejo Nails - Održivost</title>
      <link rel="stylesheet" href="/style.css">
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
    </head>
    <body>
      <div class="sustainability-hero">
        <h1>Održivost u Tejo Nails</h1>
        <p>Naša predanost planetu i etičkim proizvodima</p>
      </div>

      <div class="sustainability-kpi-container">
        <div class="kpi-card">
          <h2>${co2Savings} kg</h2>
          <p>Ukupna CO₂ ušteda</p>
        </div>
        <div class="kpi-card">
          <h2>${certifications.length}</h2>
          <p>Certificiranih proizvoda</p>
        </div>
        <div class="kpi-card">
          <h2>3</h2>
          <p>Globalne inicijative</p>
        </div>
      </div>

      <div class="certification-section">
        <h2>Naši certifikati</h2>
        <div class="certification-grid">
          <div class="certification-card">
            <img src="/images/certifications/eu-ecolabel.svg" alt="EU Ecolabel">
            <h3>EU Ecolabel</h3>
            <p>Službena oznaka EU za proizvode s manjim utjecajem na okoliš tijekom cijelog životnog ciklusa.</p>
          </div>
          <div class="certification-card">
            <img src="/images/certifications/leaping-bunny.svg" alt="Leaping Bunny">
            <h3>Leaping Bunny</h3>
            <p>Jamstvo za proizvode koji nisu testirani na životinjama.</p>
          </div>
          <div class="certification-card">
            <img src="/images/certifications/carbon-neutral.svg" alt="Carbon Neutral">
            <h3>Carbon Neutral</h3>
            <p>Proizvodi s neutralnom emisijom ugljika kroz njihov cijeli životni ciklus.</p>
          </div>
        </div>
      </div>

      <div class="commitment-section">
        <h2>Naša predanost</h2>
        <p>U Tejo Nails vjerujemo da ljepota ne bi trebala imati trošak za naš planet ili životinje. Zato aktivno radimo na:</p>
        <ul>
          <li>Smanjenju ugljičnog otiska</li>
          <li>Povećanju udjela održivih i cruelty-free proizvoda</li>
          <li>Transparentnosti u lancu opskrbe</li>
          <li>Edukaciji kupaca o održivim izborima</li>
        </ul>
      </div>

      <a href="/products" class="btn btn-primary">Pregledaj održive proizvode</a>
    </body>
    </html>
    `;

    res.send(html);
  } catch (error) {
    res.status(500).send("Došlo je do greške prilikom učitavanja stranice");
  }
});

export default router;
