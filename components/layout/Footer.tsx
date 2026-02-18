import Link from "next/link";
import { TransitionLink } from "@/components/ui/TransitionLink";
import { Mail, Phone, MapPin, Linkedin, Facebook, Instagram } from "lucide-react";
import { getTranslations, getLocale } from "next-intl/server";
import { getSiteSettings } from "@/lib/settings";

export default async function Footer() {
  const tn = await getTranslations("Navbar");
  const t = await getTranslations("Footer");
  const ts = await getTranslations("Services");
  const locale = await getLocale();
  const settings = await getSiteSettings();

  return (
    <footer className="bg-muted text-foreground pt-20 pb-10 transition-colors border-t border-border dark:bg-background">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-1">
            <TransitionLink href={`/${locale}`} className="flex items-center space-x-2 mb-6 rtl:space-x-reverse">
              {settings.logoUrl ? (
                <img src={settings.logoUrl} alt={settings.siteName} className="h-8 w-auto" />
              ) : (
                <>
                  <span className="text-3xl font-black tracking-tighter">{settings.siteName}</span>
                  <div className="w-2 h-2 bg-accent rounded-full" />
                </>
              )}
            </TransitionLink>
            <p className="opacity-60 text-sm leading-relaxed mb-6">
              {t("tagline")}
            </p>
            <div className="flex space-x-4 rtl:space-x-reverse">
              {settings.linkedin && (
                <Link href={settings.linkedin} target="_blank" className="hover:text-accent transition-colors">
                  <Linkedin className="w-5 h-5" />
                </Link>
              )}
              {settings.facebook && (
                <Link href={settings.facebook} target="_blank" className="hover:text-accent transition-colors">
                  <Facebook className="w-5 h-5" />
                </Link>
              )}
              {settings.instagram && (
                <Link href={settings.instagram} target="_blank" className="hover:text-accent transition-colors">
                  <Instagram className="w-5 h-5" />
                </Link>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-6 uppercase tracking-wider">{t("navigation")}</h4>
            <ul className="space-y-4 text-sm opacity-60">
              <li><TransitionLink href={`/${locale}`} className="hover:text-accent transition-colors">{tn("home")}</TransitionLink></li>
              <li><TransitionLink href={`/${locale}/about`} className="hover:text-accent transition-colors">{tn("about")}</TransitionLink></li>
              <li><TransitionLink href={`/${locale}/services`} className="hover:text-accent transition-colors">{tn("services")}</TransitionLink></li>
              <li><TransitionLink href={`/${locale}/portfolio`} className="hover:text-accent transition-colors">{tn("portfolio")}</TransitionLink></li>
              <li><TransitionLink href={`/${locale}/contact`} className="hover:text-accent transition-colors">{tn("contact")}</TransitionLink></li>
              <li><TransitionLink href={`/${locale}/recruitment`} className="hover:text-accent transition-colors">{tn("careers")}</TransitionLink></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-bold mb-6 uppercase tracking-wider">{t("expertise")}</h4>
            <ul className="space-y-4 text-sm opacity-60">
              <li><TransitionLink href={`/${locale}/services`} className="hover:text-accent transition-colors">{t("precisionMachining")}</TransitionLink></li>
              <li><TransitionLink href={`/${locale}/services`} className="hover:text-accent transition-colors">{t("agriRepair")}</TransitionLink></li>
              <li><TransitionLink href={`/${locale}/services`} className="hover:text-accent transition-colors">{t("customFabrication")}</TransitionLink></li>
              <li><TransitionLink href={`/${locale}/services`} className="hover:text-accent transition-colors">{t("industrialMaintenance")}</TransitionLink></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-bold mb-6 uppercase tracking-wider">{t("contactUs")}</h4>
            <ul className="space-y-4 text-sm opacity-60">
              <li className="flex items-start space-x-3 rtl:space-x-reverse">
                <MapPin className="w-5 h-5 text-accent shrink-0" />
                <span>{settings.address}</span>
              </li>
              <li className="flex items-center space-x-3 rtl:space-x-reverse">
                <Phone className="w-5 h-5 text-accent shrink-0" />
                <span>{settings.phone}</span>
              </li>
              <li className="flex items-center space-x-3 rtl:space-x-reverse">
                <Mail className="w-5 h-5 text-accent shrink-0" />
                <span>{settings.email}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center text-xs opacity-40 uppercase tracking-widest gap-4">
          <p>© {new Date().getFullYear()} {settings.siteName}. {t("allRights")}</p>
          <div className="flex space-x-6 rtl:space-x-reverse">
            <TransitionLink href={`/${locale}/privacy`} className="hover:text-accent transition-colors">{t("privacyPolicy")}</TransitionLink>
            <TransitionLink href={`/${locale}/terms`} className="hover:text-accent transition-colors">{t("termsOfService")}</TransitionLink>
          </div>
        </div>
      </div>
    </footer>
  );
}
