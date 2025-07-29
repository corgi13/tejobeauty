import React from "react";
import ProductList from "../../components/products/ProductList";

const ProductsPage: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Svi proizvodi</h2>
      <ProductList />
    </div>
  );
};

export default ProductsPage;
