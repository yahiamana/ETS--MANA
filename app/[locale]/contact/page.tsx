"use client";

import { use, useState, useEffect } from "react";
import ContactForm from "@/components/forms/ContactForm";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { Canvas } from "@react-three/fiber";
import MachiningGrid from "@/components/visuals/MachiningGrid";
import { useTranslations } from "next-intl";

export default function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  const t = useTranslations("Contact");
  const [settings, setSettings] = useState<{ address: string; email: string; phone: string } | null>(null);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then(res => res.json())
      .then(data => setSettings(data))
      .catch(err => console.error("Contact settings error:", err));
  }, []);

  return (
    <div className="bg-muted min-h-screen">
      <section className="bg-primary pt-32 pb-20 text-primary-foreground industrial-grid">
        <div className="container mx-auto px-6">
          <span className="text-accent font-bold uppercase tracking-[0.3em] text-xs mb-4 block">{t("getInTouch")}</span>
          <h1 className="text-5xl md:text-7xl font-black uppercase mb-6 leading-none">
            {t("contactTitle")} <br /><span className="text-primary-foreground/50">{t("contactSubtitle")}</span>
          </h1>
          <p className="text-primary-foreground/60 max-w-2xl text-lg leading-relaxed">
            {t("contactDesc")}
          </p>
        </div>
      </section>

      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-16">
            {/* Info Column */}
            <div className="w-full lg:w-1/3 space-y-12">
              <div className="relative h-[200px] bg-primary overflow-hidden border border-primary/10">
                <div className="absolute inset-0 z-0">
                  <Canvas 
                    camera={{ position: [0, 0, 5], fov: 45 }}
                    gl={{ antialias: false, powerPreference: "high-performance", alpha: true }}
                  >
                    <ambientLight intensity={0.4} />
                    <MachiningGrid />
                  </Canvas>
                </div>
                <div className="relative z-10 p-8 flex items-center justify-between h-full bg-gradient-to-t from-black/20 to-transparent">
                  <h3 className="text-2xl font-black uppercase text-white leading-tight">{t("workshopLocation")}</h3>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-card p-3 border border-border text-accent shrink-0">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="block text-[10px] font-black uppercase tracking-widest text-secondary mb-1">{t("industrialAddress")}</span>
                    <span className="text-lg font-black text-foreground leading-tight">{settings?.address || "123 Industrial Zone, Agricultural District, Area 51"}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="bg-card p-3 border border-border text-accent shrink-0">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="block text-[10px] font-black uppercase tracking-widest text-secondary mb-1">{t("directLine")}</span>
                    <span className="text-lg font-black text-foreground">{settings?.phone || "+1 (234) 567-890"}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="bg-card p-3 border border-border text-accent shrink-0">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="block text-[10px] font-black uppercase tracking-widest text-secondary mb-1">{t("emailInquiry")}</span>
                    <span className="text-lg font-black text-foreground">{settings?.email || "contact@manworkshop.com"}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-black uppercase mb-8 text-foreground">{t("businessHours")}</h3>
                <div className="space-y-4 bg-card p-8 border border-border transition-colors">
                  {[
                    { day: t("mondayFriday"), time: "08:00 - 18:00" },
                    { day: t("saturday"), time: "09:00 - 13:00" },
                    { day: t("sunday"), time: t("sundayTime") },
                  ].map((item, i) => (
                    <div key={i} className="flex justify-between items-center text-sm font-bold uppercase tracking-widest">
                      <span className="text-secondary">{item.day}</span>
                      <span className="text-foreground">{item.time}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="aspect-video bg-card border border-border p-2">
                {/* Map Placeholder */}
                <div className="w-full h-full bg-muted flex flex-col items-center justify-center text-center p-8 relative overflow-hidden group">
                  <MapPin className="w-12 h-12 text-secondary/40 mb-4 group-hover:text-accent transition-colors" />
                  <span className="text-xs font-black uppercase tracking-widest text-secondary">{t("mapPlaceholder")}</span>
                  <p className="text-[10px] text-secondary/40 mt-2 uppercase font-bold">Location: Lat 34.05 / Long -118.24</p>
                </div>
              </div>
            </div>

            {/* Form Column */}
            <div className="w-full lg:w-2/3">
              <div className="bg-card p-8 md:p-12 border border-border transition-colors">
                <h3 className="text-2xl font-black uppercase mb-8 text-foreground border-b border-border pb-4">{t("sendMessage")}</h3>
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
