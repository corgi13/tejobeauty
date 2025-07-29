// products.ts - API ruta za proizvode
import express from "express";

const router = express.Router();

const mockProducts = [
  {
    id: 101,
    name: "Smartphone XZ10",
    price: 799.99,
    image: "/images/products/smartphone-xz10.jpg",
    category: "Elektronika",
    rating: 4.7,
  },
  {
    id: 154,
    name: "Bežične slušalice Pro",
    price: 129.99,
    image: "/images/products/wireless-headphones-pro.jpg",
    category: "Elektronika",
    rating: 4.5,
  },
  {
    id: 203,
    name: "Sportske tenisice Ultra",
    price: 89.95,
    image: "/images/products/sport-shoes-ultra.jpg",
    category: "Obuća",
    rating: 4.3,
  },
  {
    id: 389,
    name: "Kuhinjski mikser Premium",
    price: 149.99,
    image: "/images/products/kitchen-mixer-premium.jpg",
    category: "Kućanski aparati",
    rating: 4.8,
  },
];

/**
 * GET /api/products
 * Dohvaća listu proizvoda s opcionalnim filtriranjem
 */
router.get("/", (req, res) => {
  const { category, minPrice, maxPrice } = req.query;

  let filtered = [...mockProducts];

  if (category) {
    filtered = filtered.filter((p) => p.category === category);
  }

  if (minPrice) {
    filtered = filtered.filter((p) => p.price >= Number(minPrice));
  }

  if (maxPrice) {
    filtered = filtered.filter((p) => p.price <= Number(maxPrice));
  }

  res.json(filtered);
});

/**
 * GET /api/products/:id
 * Dohvaća pojedinačni proizvod prema ID-u
 */
router.get("/:id", (req, res) => {
  const productId = Number(req.params.id);
  const product = mockProducts.find((p) => p.id === productId);

  if (!product) {
    return res.status(404).json({ error: "Proizvod nije pronađen" });
  }

  res.json(product);
});

export default router;
