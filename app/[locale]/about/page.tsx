import AboutClient from "@/components/about/AboutClient";
import { getSiteSettings } from "@/lib/settings";

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const settings = await getSiteSettings();

  return <AboutClient settings={settings} />;
}
