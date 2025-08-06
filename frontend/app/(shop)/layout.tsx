"use client";

import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

// Force dynamic rendering for all shop pages
export const dynamic = 'force-dynamic';

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
