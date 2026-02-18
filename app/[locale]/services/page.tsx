import ServicesGallery from "@/components/services/ServicesGallery";
import { getSiteSettings } from "@/lib/settings";

const services = [
  {
    id: "manufacturing",
    title: "Mechanical part manufacturing",
    desc: "Custom metal component production tailored to agricultural equipment specifications.",
    features: [],
    image: "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?auto=format&fit=crop&q=80",
    iconName: "manufacturing"
  },
  {
    id: "restoration",
    title: "Repair and restoration",
    desc: "Refurbishing worn parts to extend service life and reduce replacement costs.",
    features: [],
    image: "https://images.unsplash.com/photo-1530260626688-048279320445?auto=format&fit=crop&q=80",
    iconName: "restoration"
  },
  {
    id: "modification",
    title: "Component modification",
    desc: "Mechanical adjustments to improve performance or meet operational needs.",
    features: [],
    image: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80",
    iconName: "modification"
  },
  {
    id: "machining",
    title: "Precision machining",
    desc: "Expert turning and milling operations ensuring consistent industrial quality.",
    features: [],
    image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80",
    iconName: "machining"
  },
  {
    id: "guidance",
    title: "Technical guidance",
    desc: "Practical advice to support the best mechanical solutions.",
    features: [],
    image: "https://images.unsplash.com/photo-1534394017411-94943f65017e?auto=format&fit=crop&q=80",
    iconName: "guidance"
  },
];

export default async function ServicesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const settings = await getSiteSettings();

  return (
    <div className="bg-background transition-colors">
      <ServicesGallery services={services} settings={settings} />
    </div>
  );
}
