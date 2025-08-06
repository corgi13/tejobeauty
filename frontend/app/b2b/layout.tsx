import B2BLayout from '@/components/b2b/B2BLayout';

export default function B2BRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <B2BLayout>{children}</B2BLayout>;
}
