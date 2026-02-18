"use client";

import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { ArrowRight, Mail, Phone, ChevronRight } from "lucide-react";

export default function CTASection({ settings }: { settings: any }) {
  const tn = useTranslations("Navbar");
  const t = useTranslations("CTA");
  const locale = useLocale();

  const phone = settings.phone || "+1 (234) 567-890";
  const email = settings.email || "contact@manworkshop.com";

  return (
    <section className="py-24 bg-background dark:bg-muted text-foreground overflow-hidden relative transition-colors">
      <div className="container mx-auto px-6 relative z-10">
        <div className="bg-accent p-12 md:p-20 flex flex-col md:flex-row items-center justify-between gap-12 border-b-8 border-primary/20">
          <div className="max-w-xl text-center md:ltr:text-left md:rtl:text-right">
            <h2 className="text-4xl md:text-6xl font-black uppercase mb-6 leading-tight text-white">
              {t("readyTo")} <br />
              <span className="text-primary-foreground">{t("start")}</span>
            </h2>
            <p className="text-white/80 text-lg mb-8">
              {t("desc")}
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center md:justify-start">
              <Link
                href={`/${locale}/quote`}
                className="bg-primary text-primary-foreground px-10 py-5 font-black uppercase tracking-widest hover:bg-neutral-900 hover:text-white transition-all flex items-center justify-center group shadow-xl"
              >
                {tn("quote")}
                <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-2 transition-transform rtl:rotate-180 rtl:group-hover:-translate-x-2" />
              </Link>
            </div>
          </div>

          <div className="flex flex-col gap-6 w-full md:w-auto">
            <a href={`tel:${phone}`} className="flex items-center space-x-4 rtl:space-x-reverse bg-white/10 p-6 backdrop-blur-sm border border-white/10 hover:bg-white/20 transition-colors group">
              <div className="bg-primary p-4 text-white">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <span className="block text-xs font-bold uppercase tracking-widest text-white/60 mb-1 font-sans">{t("callWorkshop")}</span>
                <span className="text-xl font-black text-white">{phone}</span>
              </div>
            </a>
            
            <a href={`mailto:${email}`} className="flex items-center space-x-4 rtl:space-x-reverse bg-white/10 p-6 backdrop-blur-sm border border-white/10 hover:bg-white/20 transition-colors group">
              <div className="bg-primary p-4 text-white">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <span className="block text-xs font-bold uppercase tracking-widest text-white/60 mb-1 font-sans">{t("technicalSupport")}</span>
                <span className="text-xl font-black text-white">{email}</span>
              </div>
            </a>
          </div>
        </div>
      </div>

      {/* Decorative Texture */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(45deg,#223445_12%,transparent_12%,transparent_88%,#223445_88%,#223445_100%),linear-gradient(135deg,#223445_12%,transparent_12%,transparent_88%,#223445_88%,#223445_100%)] bg-[length:40px_40px]" />
      </div>
    </section>
  );
}
