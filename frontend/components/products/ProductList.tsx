import React, { useEffect, useState, useContext } from "react";
import Image from "next/image";
import { CartContext } from "../../store/CartContext";
import { useToast } from "../ToastProvider";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
}

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart } = useContext(CartContext);
  const { showToast } = useToast();

  useEffect(() => {
    fetch("http://localhost:3002/products")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch products");
        return res.json();
      })
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading products...</div>;
  if (error) return <div>Error: {error}</div>;

  if (products.length === 0) {
    return (
      <div className="text-center text-gray-500 py-12">
        Nema dostupnih proizvoda.
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <div
          key={product.id}
          className="border rounded-lg p-4 bg-white shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col"
        >
          {product.imageUrl ? (
            <div className="relative w-full h-48 mb-4">
              <Image
                src={product.imageUrl}
                alt={product.name}
                layout="fill"
                objectFit="cover"
                className="rounded"
              />
            </div>
          ) : (
            <div className="relative w-full h-48 mb-4 bg-gray-200 rounded flex items-center justify-center">
              <span className="text-gray-500">Nema slike</span>
            </div>
          )}
          <div className="flex-grow">
            <h3 className="text-lg font-bold mb-2 truncate">{product.name}</h3>
            <p className="text-sm text-gray-600 mb-3 h-10 overflow-hidden">
              {product.description}
            </p>
            <div className="font-semibold text-pink-600 text-xl mb-3">
              {product.price.toFixed(2)} €
            </div>
          </div>
          <button
            onClick={() => {
              addToCart(product);
              showToast(`${product.name} dodan u košaricu!`, "success");
            }}
            className="w-full bg-pink-600 text-white py-2 rounded font-bold mt-auto hover:bg-pink-700 transition-colors duration-300"
          >
            Dodaj u košaricu
          </button>
        </div>
      ))}
    </div>
  );
};

export default ProductList;
