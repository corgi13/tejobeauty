"use client";

import Link, { LinkProps } from "next/link";
import { useI18n } from "@/lib/i18n/i18n-provider";
import { getI18nPath } from "@/lib/i18n/utils";
import { ReactNode } from "react";

interface I18nLinkProps extends Omit<LinkProps, "href"> {
  href: string;
  children: ReactNode;
  className?: string;
}

export default function I18nLink({ href, children, ...props }: I18nLinkProps) {
  const { locale } = useI18n();

  // Generate the internationalized path
  const i18nHref = getI18nPath(href, locale);

  return (
    <Link href={i18nHref} {...props}>
      {children}
    </Link>
  );
}
