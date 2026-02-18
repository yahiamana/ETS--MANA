"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { locales } from "@/i18n/config";
import { Globe } from "lucide-react";
import { cn } from "@/lib/utils";

export default function LanguageSwitcher() {
  const currentLocale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const handleLocaleChange = (newLocale: string) => {
    // Current pathname includes the locale, e.g., /en/about
    // We want to replace the first segment
    const segments = pathname.split("/");
    segments[1] = newLocale;
    router.push(segments.join("/"));
  };

  return (
    <div className="flex items-center space-x-2 rtl:space-x-reverse">
      <Globe className="w-4 h-4 text-secondary" />
      <div className="flex bg-muted rounded-full p-1 border border-border">
        {locales.map((locale) => (
          <button
            key={locale}
            onClick={() => handleLocaleChange(locale)}
            className={cn(
              "px-3 py-1 text-xs font-bold uppercase transition-all rounded-full",
              currentLocale === locale
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-secondary hover:text-foreground"
            )}
          >
            {locale}
          </button>
        ))}
      </div>
    </div>
  );
}
