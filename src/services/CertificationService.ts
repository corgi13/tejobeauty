import fetch from "node-fetch";

import Certification, { CertificationType } from "../models/Certification";

interface EUEcatResponse {
  products: Array<{
    license_number: string;
    product_name: string;
    company_name: string;
    product_group: string;
  }>;
}

class CertificationService {
  private readonly EU_ECAT_API_URL =
    "https://webgate.ec.europa.eu/ecat_api/api/v1/products";

  /**
   * Sinkronizira certifikate s EU ECAT API-jem
   */
  async syncEUEcolabelCertifications(): Promise<void> {
    try {
      const response = await fetch(this.EU_ECAT_API_URL);
      const data: EUEcatResponse = await response.json();

      // Batch obrada za učinkovitiji upsert
      const operations = data.products.map((product) => ({
        updateOne: {
          filter: {
            name: product.product_name,
            type: CertificationType.EU_ECOLABEL,
          },
          update: {
            name: product.product_name,
            type: CertificationType.EU_ECOLABEL,
            description: `EU Ecolabel certifikat za ${product.product_group}`,
            iconUrl: "/images/certifications/eu-ecolabel.svg",
            colorCode: "#0F8A5F", // Zelena za ekološke certifikate
            lastVerified: new Date(),
            apiSource: "EU ECAT API",
          },
          upsert: true,
        },
      }));

      await Certification.bulkWrite(operations);
      console.log(
        `Sinkronizirano ${operations.length} EU Ecolabel certifikata`,
      );
    } catch (error) {
      console.error(
        "Greška pri sinkronizaciji EU Ecolabel certifikata:",
        error,
      );
      throw error;
    }
  }

  /**
   * Dobavlja sve certifikate
   */
  async getAllCertifications() {
    return Certification.find({});
  }

  /**
   * Dobavlja certifikate po tipu
   */
  async getCertificationsByType(type: CertificationType) {
    return Certification.find({ type });
  }

  /**
   * Izračunava ukupnu CO2 uštedu na temelju proizvoda s Carbon-Neutral certifikatom
   */
  async calculateTotalCO2Savings() {
    // Ovo bi u stvarnosti uključivalo složeniju logiku za izračun CO2 uštede
    // Ovdje je pojednostavljeno za demonstraciju
    const carbonNeutralCount = await Certification.countDocuments({
      type: CertificationType.CARBON_NEUTRAL,
    });

    // Pretpostavimo da svaki Carbon-Neutral proizvod uštedi prosječno 5kg CO2
    return carbonNeutralCount * 5;
  }
}

export default new CertificationService();
