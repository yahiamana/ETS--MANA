import QuoteForm from "@/components/forms/QuoteForm";
import { Mail, Phone, MapPin } from "lucide-react";
import { getSiteSettings } from "@/lib/settings";

export default async function QuotePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const settings = await getSiteSettings();
  return (
    <div className="bg-muted min-h-screen">
      <section className="bg-primary pt-32 pb-20 text-primary-foreground industrial-grid">
        <div className="container mx-auto px-6">
          <span className="text-accent font-bold uppercase tracking-[0.3em] text-xs mb-4 block">Get a Quote</span>
          <h1 className="text-5xl md:text-7xl font-black uppercase mb-6 leading-none">
            Project <br /><span className="text-primary-foreground/50">Inquiry</span>
          </h1>
          <p className="text-primary-foreground/60 max-w-2xl text-lg leading-relaxed">
            Provide the technical details of your project. Our experts will analyze your 
            requirements and provide a detailed industrial quote.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-16">
            {/* Form Column */}
            <div className="w-full lg:w-2/3">
              <QuoteForm />
            </div>

            {/* Support Column */}
            <div className="w-full lg:w-1/3">
              <div className="sticky top-[120px] space-y-10">
                <div>
                  <h3 className="text-2xl font-black uppercase mb-6 text-foreground">Technical Help</h3>
                  <p className="text-secondary mb-8">
                    Not sure about the specifications? Contact our engineers directly 
                    for a consultation before submitting your request.
                  </p>
                  
                  <div className="space-y-6">
                    <div className="flex items-start space-x-4">
                      <div className="bg-card p-3 border border-border text-accent">
                        <Phone className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="block text-[10px] font-black uppercase tracking-widest text-secondary mb-1 font-sans">Workshop Direct</span>
                        <span className="text-lg font-black text-foreground">{settings.phone || "+213 (0) 555 123 456"}</span>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="bg-card p-3 border border-border text-accent">
                        <Mail className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="block text-[10px] font-black uppercase tracking-widest text-secondary mb-1 font-sans">Engineering Support</span>
                        <span className="text-lg font-black text-foreground">{settings.email || "contact@mana.dz"}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-card p-8 border border-border transition-colors">
                  <h4 className="font-black uppercase tracking-widest text-foreground mb-4">What happens next?</h4>
                  <ul className="space-y-4">
                    {[
                      "Technical analysis by our engineers",
                      "Price & material estimation",
                      "Production timeline scheduling",
                      "Formal quote delivery via email"
                    ].map((step, i) => (
                      <li key={i} className="flex items-center space-x-3 text-sm font-bold uppercase tracking-wider text-secondary">
                        <span className="text-accent">0{i+1}.</span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
