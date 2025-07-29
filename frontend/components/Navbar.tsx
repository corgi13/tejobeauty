"use client";

import React, { useContext, useState } from "react";
import Link from "next/link";
import { CartContext } from "../store/CartContext";

const Navbar: React.FC = () => {
  const { cart } = useContext(CartContext);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  // MOCK: zamijeni s pravom auth logikom
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <nav className="w-full bg-pink-600 text-white px-6 py-4 flex justify-between items-center sticky top-0 z-50 shadow-lg">
      <Link href="/" className="font-bold text-xl">
        TEJO NAILS
      </Link>
      <div className="flex items-center gap-6">
        <Link href="/products" className="hover:underline">
          Proizvodi
        </Link>
        <Link href="/cart" className="relative hover:underline">
          Košarica
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-4 bg-white text-pink-600 rounded-full px-2 text-xs font-bold">
              {cartCount}
            </span>
          )}
        </Link>
        <Link href="/checkout" className="hover:underline">
          Narudžba
        </Link>
        <Link href="/orders" className="hover:underline">
          Povijest narudžbi
        </Link>
        <Link href="/profile" className="hover:underline">
          Profil
        </Link>
        <Link href="/about" className="hover:underline">
          O nama
        </Link>
        <Link href="/contact" className="hover:underline">
          Kontakt
        </Link>
        <Link href="/terms" className="hover:underline">
          Uvjeti korištenja
        </Link>
        <Link href="/privacy" className="hover:underline">
          Pravila privatnosti
        </Link>
        {!isLoggedIn && (
          <Link href="/login" className="hover:underline">
            Prijava
          </Link>
        )}
        {!isLoggedIn && (
          <Link href="/register" className="hover:underline">
            Registracija
          </Link>
        )}
        {isLoggedIn && (
          <button
            onClick={() => setIsLoggedIn(false)}
            className="hover:underline bg-transparent border-none cursor-pointer text-white"
          >
            Odjava
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
