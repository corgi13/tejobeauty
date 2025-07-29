"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, Search, User } from "lucide-react";
import CartIcon from "@/components/cart/cart-icon";
import SearchInput from "@/components/search/search-input";
import LanguageSwitcher from "@/components/language-switcher";
import { useI18n } from "@/lib/i18n/i18n-provider";
import I18nLink from "@/components/i18n-link";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const pathname = usePathname();
  const { t } = useI18n();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleSearch = () => setIsSearchOpen(!isSearchOpen);

  const navigation = [
    { name: t("navigation.home"), href: "/" },
    { name: t("navigation.products"), href: "/products" },
    { name: t("navigation.categories"), href: "/products" },
    { name: t("navigation.about"), href: "/about" },
    { name: t("navigation.contact"), href: "/contact" },
  ];

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <I18nLink href="/" className="text-xl font-bold text-primary-600">
              {t("app.name")}
            </I18nLink>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:ml-6 md:flex md:space-x-8">
            {navigation.map((item) => (
              <I18nLink
                key={item.name}
                href={item.href}
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  pathname === item.href
                    ? "border-primary-500 text-gray-900"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                }`}
              >
                {item.name}
              </I18nLink>
            ))}
          </nav>

          {/* Desktop Right Actions */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <LanguageSwitcher />

            <button
              onClick={toggleSearch}
              className="p-2 text-gray-400 hover:text-gray-500"
              aria-label="Search"
            >
              <Search className="h-6 w-6" />
            </button>

            <I18nLink
              href="/account"
              className="p-2 text-gray-400 hover:text-gray-500"
              aria-label="Account"
            >
              <User className="h-6 w-6" />
            </I18nLink>

            <CartIcon />
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={toggleSearch}
              className="p-2 text-gray-400 hover:text-gray-500 mr-2"
              aria-label="Search"
            >
              <Search className="h-6 w-6" />
            </button>

            <CartIcon className="mr-2" />

            <button
              onClick={toggleMenu}
              className="p-2 text-gray-400 hover:text-gray-500"
              aria-label="Open menu"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Search bar */}
        {isSearchOpen && (
          <div className="py-4 border-t border-gray-200">
            <SearchInput
              placeholder="Search for products..."
              className="max-w-3xl mx-auto"
            />
          </div>
        )}
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="pt-2 pb-4 space-y-1">
            {navigation.map((item) => (
              <I18nLink
                key={item.name}
                href={item.href}
                className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                  pathname === item.href
                    ? "border-primary-500 bg-primary-50 text-primary-700"
                    : "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </I18nLink>
            ))}

            <I18nLink
              href="/account"
              className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
              onClick={() => setIsMenuOpen(false)}
            >
              {t("navigation.account")}
            </I18nLink>

            <div className="pl-3 pr-4 py-2 border-l-4 border-transparent">
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
