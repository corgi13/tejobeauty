// search.ts - API endpoints za pretraživanje i preporuke
import { AlgoliaClient } from "../../AlgoliaClient";
import { MLService } from "../services/MLService";
import { SearchService } from "../services/SearchService";
import { UserRepository } from "../services/UserRepository";

// Pretpostavljamo da imamo konfigurirane potrebne stvari
const algoliaClient = new AlgoliaClient(
  process.env.ALGOLIA_APP_ID || "",
  process.env.ALGOLIA_API_KEY || "",
);
const mlService = new MLService(
  process.env.ML_ENDPOINT,
  process.env.ML_API_KEY,
);
const userRepository = new UserRepository(db);

// Inicijalizacija servisa za pretraživanje
const searchService = new SearchService(
  algoliaClient,
  mlService,
  userRepository,
);

// API endpoint za pretraživanje proizvoda
export async function searchHandler(req, res) {
  const { query, filters } = req.body;
  const userId = req.session.userId;

  try {
    const results = await searchService.searchProducts(query, filters, userId);
    res.json(results);
  } catch (error) {
    console.error("Greška pri pretraživanju:", error);
    res.status(500).json({ error: "Greška pri pretraživanju" });
  }
}

// API endpoint za dobivanje personaliziranih preporuka
export async function recommendationsHandler(req, res) {
  const userId = req.session.userId;
  const { productId } = req.query;

  try {
    const recommendations = await searchService.getRecommendations(
      userId,
      productId ? parseInt(productId) : undefined,
    );
    res.json(recommendations);
  } catch (error) {
    console.error("Greška pri dohvaćanju preporuka:", error);
    res.status(500).json({ error: "Greška pri dohvaćanju preporuka" });
  }
}

// API endpoint za praćenje korisničkih aktivnosti
export async function trackActionHandler(req, res) {
  const { action, productId } = req.body;
  const userId = req.session.userId;

  try {
    await userRepository.trackUserAction(userId, action, productId);
    res.json({ success: true });
  } catch (error) {
    console.error("Greška pri bilježenju korisničke akcije:", error);
    res.status(500).json({ error: "Greška pri bilježenju korisničke akcije" });
  }
}
