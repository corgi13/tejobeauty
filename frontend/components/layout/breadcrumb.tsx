"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

interface BreadcrumbItem {
  label: string;
  href: string;
  isCurrent: boolean;
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[];
  homeLabel?: string;
}

export default function Breadcrumb({
  items,
  homeLabel = "Home",
}: BreadcrumbProps) {
  const pathname = usePathname();

  const breadcrumbItems = useMemo(() => {
    if (items) {
      return items;
    }

    // Generate breadcrumb items from pathname
    const paths = pathname.split("/").filter(Boolean);

    return [
      {
        label: homeLabel,
        href: "/",
        isCurrent: paths.length === 0,
      },
      ...paths.map((path, index) => {
        const href = `/${paths.slice(0, index + 1).join("/")}`;
        const label = path
          .replace(/-/g, " ")
          .replace(/\b\w/g, (char) => char.toUpperCase());

        return {
          label,
          href,
          isCurrent: index === paths.length - 1,
        };
      }),
    ];
  }, [pathname, items, homeLabel]);

  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        {breadcrumbItems.map((item, index) => (
          <li key={item.href} className="inline-flex items-center">
            {index > 0 && <span className="mx-2 text-gray-400">/</span>}

            {item.isCurrent ? (
              <span className="text-gray-500" aria-current="page">
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                className="text-primary-600 hover:text-primary-800"
              >
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
