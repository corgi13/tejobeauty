import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

export default function AddressDemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 py-8">{children}</main>
      <Footer />
    </>
  );
}
