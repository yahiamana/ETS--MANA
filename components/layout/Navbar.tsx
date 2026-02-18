"use client";

import Link from "next/link";
import { TransitionLink } from "@/components/ui/TransitionLink";
import { useState, useEffect } from "react";
import { Menu, X, ChevronRight, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

import { useTranslations, useLocale } from "next-intl";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import ThemeToggle from "@/components/ThemeToggle";

export default function Navbar({ settings }: { settings: { siteName: string; logoUrl: string | null } }) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const t = useTranslations("Navbar");
  const locale = useLocale();

  const NavLinks = [
    { name: t("home"), href: `/${locale}` },
    { name: t("about"), href: `/${locale}/about` },
    { name: t("services"), href: `/${locale}/services` },
    { name: t("portfolio"), href: `/${locale}/portfolio` },
    { name: t("careers"), href: `/${locale}/recruitment` },
    { name: t("contact"), href: `/${locale}/contact` },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b",
        scrolled 
          ? "bg-background py-3 border-border shadow-md" 
          : "bg-transparent py-4 border-transparent"
      )}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        <TransitionLink href={`/${locale}`} className="flex items-center space-x-2 rtl:space-x-reverse relative z-50">
          {settings?.logoUrl ? (
            <img src={settings.logoUrl} alt={settings.siteName} className="h-8 w-auto" />
          ) : (
            <>
              <span className={cn(
                "text-2xl font-black tracking-tighter transition-colors text-foreground uppercase"
              )}>{settings?.siteName || "MANA"}</span>
              <div className="w-2 h-2 bg-accent rounded-full" />
            </>
          )}
        </TransitionLink>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center space-x-8 rtl:space-x-reverse">
          <div className="flex items-center space-x-6 rtl:space-x-reverse">
            {NavLinks.map((link) => (
              <TransitionLink
                key={link.name}
                href={link.href}
                className="text-xs font-semibold uppercase tracking-wider text-foreground/80 hover:text-accent transition-colors"
              >
                {link.name}
              </TransitionLink>
            ))}
          </div>
          
          <div className="h-6 w-px bg-border" />
          
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>

          <TransitionLink
            href={`/${locale}/quote`}
            className="bg-primary text-primary-foreground px-6 py-2.5 text-xs font-bold uppercase tracking-widest hover:bg-accent transition-colors flex items-center group shadow-sm"
          >
            {t("quote")}
            <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform rtl:rotate-180 rtl:group-hover:-translate-x-1" />
          </TransitionLink>
        </div>

        {/* Mobile Toggle */}
        <div className="flex items-center space-x-4 lg:hidden relative z-50">
            <ThemeToggle />
            <button
                className="text-foreground p-2"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle Menu"
            >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          "fixed inset-0 top-0 bg-white dark:bg-zinc-950 z-40 lg:hidden transition-transform duration-500 pt-28",
          isOpen ? "translate-x-0" : "translate-x-full rtl:-translate-x-full"
        )}
      >
        <div className="flex flex-col p-8 space-y-6">
            <div className="flex justify-between items-center border-b border-border pb-4">
                <span className="font-bold uppercase tracking-widest text-secondary text-sm">Menu</span>
                <LanguageSwitcher />
            </div>
          {NavLinks.map((link) => (
            <TransitionLink
              key={link.name}
              href={link.href}
              className="text-2xl font-bold text-foreground border-b border-border pb-4"
              onClick={() => setIsOpen(false)}
            >
              {link.name}
            </TransitionLink>
          ))}
          <TransitionLink
            href={`/${locale}/quote`}
            className="bg-accent text-white p-4 text-center font-bold uppercase tracking-widest shadow-lg"
            onClick={() => setIsOpen(false)}
          >
            {t("quote")}
          </TransitionLink>
        </div>
      </div>
    </nav>
  );
}
