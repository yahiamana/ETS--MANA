import JobBoard from "@/components/recruitment/JobBoard";
import { getTranslations } from "next-intl/server";

export default async function RecruitmentPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations("Recruitment");
  return (
    <div className="bg-muted min-h-screen">
      <section className="bg-primary pt-32 pb-20 text-primary-foreground industrial-grid">
        <div className="container mx-auto px-6">
          <span className="text-accent font-bold uppercase tracking-[0.3em] text-xs mb-4 block">{t("workWithUs")}</span>
          <h1 className="text-5xl md:text-7xl font-black uppercase mb-6 leading-none">
            {t("joinThe")} <br /><span className="text-primary-foreground/50">{t("workshop")}</span>
          </h1>
          <p className="text-primary-foreground/60 max-w-2xl text-lg leading-relaxed">
            {t("recruitmentDesc")}
          </p>
        </div>
      </section>

      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-16 mb-24">
            <div className="w-full md:w-1/2">
              <h2 className="text-3xl font-black uppercase mb-6">{t("whyUs")}</h2>
              <p className="text-secondary mb-6 italic font-bold">{t("whyUsQuote")}</p>
              <p className="text-secondary leading-relaxed">
                {t("whyUsDesc")}
              </p>
            </div>
            <div className="w-full md:w-1/2 grid grid-cols-2 gap-8 bg-card p-8 border border-border transition-colors">
              <div>
                <span className="block text-2xl font-black text-foreground mb-1 tracking-tighter">01.</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-secondary">{t("modernGear")}</span>
              </div>
              <div>
                <span className="block text-2xl font-black text-foreground mb-1 tracking-tighter">02.</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-secondary">{t("safetyFirst")}</span>
              </div>
              <div>
                <span className="block text-2xl font-black text-foreground mb-1 tracking-tighter">03.</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-secondary">{t("growthPath")}</span>
              </div>
              <div>
                <span className="block text-2xl font-black text-foreground mb-1 tracking-tighter">04.</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-secondary">{t("expertTeam")}</span>
              </div>
            </div>
          </div>

          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-black uppercase mb-12 text-center">{t("openPositions")} <span className="text-accent">{t("positions")}</span></h2>
            <JobBoard />
          </div>
        </div>
      </section>

      {/* Spontaneous Application */}
      <section className="py-24 bg-primary text-primary-foreground text-center">
        <div className="container mx-auto px-6 max-w-2xl">
          <h3 className="text-3xl font-black uppercase mb-6">{t("noMatchingRole")}</h3>
          <p className="text-primary-foreground/60 mb-10">
            {t("spontaneousDesc")}
          </p>
          <a
            href="mailto:careers@manworkshop.com"
            className="inline-block border-2 border-primary-foreground px-10 py-4 font-black uppercase tracking-widest hover:bg-primary-foreground hover:text-primary transition-all"
          >
            {t("sendCV")}
          </a>
        </div>
      </section>
    </div>
  );
}
