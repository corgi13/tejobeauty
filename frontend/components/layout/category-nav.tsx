"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Category {
  id: string;
  name: string;
  slug: string;
  children?: Category[];
}

export default function CategoryNav() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>(
    {},
  );

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/categories/tree`,
        );
        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }
        const data = await response.json();
        setCategories(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const toggleCategory = (categoryId: string) => {
    setOpenCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  const renderCategories = (categories: Category[], level = 0) => {
    return (
      <ul className={`space-y-1 ${level > 0 ? "ml-4" : ""}`}>
        {categories.map((category) => {
          const hasChildren = category.children && category.children.length > 0;
          const isOpen = openCategories[category.id];

          return (
            <li key={category.id}>
              <div className="flex items-center">
                {hasChildren && (
                  <button
                    onClick={() => toggleCategory(category.id)}
                    className="mr-1 p-1 text-gray-500 hover:text-gray-700 focus:outline-none"
                  >
                    <span className="text-xs">{isOpen ? "▼" : "►"}</span>
                  </button>
                )}
                <Link
                  href={`/products?category=${category.slug}`}
                  className="block py-1 px-2 text-gray-700 hover:bg-gray-100 rounded-md"
                >
                  {category.name}
                </Link>
              </div>

              {hasChildren &&
                isOpen &&
                renderCategories(category.children!, level + 1)}
            </li>
          );
        })}
      </ul>
    );
  };

  if (loading) {
    return (
      <div className="p-4">
        <div className="animate-pulse space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-6 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-500 text-sm">Failed to load categories</div>
    );
  }

  return (
    <nav className="category-nav">
      <h2 className="text-lg font-semibold mb-2">Categories</h2>
      {categories.length > 0 ? (
        renderCategories(categories)
      ) : (
        <p className="text-gray-500 text-sm">No categories found</p>
      )}
    </nav>
  );
}
