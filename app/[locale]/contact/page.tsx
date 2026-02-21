import { getSiteSettings } from "@/lib/settings";
import ContactClient from "./ContactClient";

export const dynamic = "force-dynamic";

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const settings = await getSiteSettings();

  return (
    <ContactClient 
      settings={{ 
        address: settings.address, 
        email: settings.email, 
        phone: settings.phone,
        businessHoursMon: settings.businessHoursMon,
        businessHoursTue: settings.businessHoursTue,
        businessHoursWed: settings.businessHoursWed,
        businessHoursThu: settings.businessHoursThu,
        businessHoursFri: settings.businessHoursFri,
        businessHoursSat: settings.businessHoursSat,
        businessHoursSun: settings.businessHoursSun
      }} 
    />
  );
}
