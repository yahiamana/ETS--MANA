import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import TransitionProvider from "@/components/layout/TransitionProvider";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales } from '@/i18n/config';
import { ThemeProvider } from "@/components/theme-provider";
import { getSiteSettings } from "@/lib/settings";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Hero' });
  const baseUrl = 'https://mana-industrial.com';
  const siteName = 'MANA Industrial Workshop';
  const fullTitle = `MANA | ${t('titlePart1')} ${t('titlePart2')}`;
  const description = "Professional industrial workshop specializing in manufacturing, repairing, and modifying metal parts for agricultural equipment since 1998.";

  return {
    title: fullTitle,
    description,
    keywords: ["machining", "agricultural repair", "milling", "turning", "Oran", "Algeria", "metal fabrication", "industrial maintenance"],
    authors: [{ name: "MANA Team" }],
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: `/${locale}`,
      languages: {
        'en': '/en',
        'fr': '/fr',
        'ar': '/ar',
      },
    },
    openGraph: {
      title: fullTitle,
      description,
      url: `${baseUrl}/${locale}`,
      siteName,
      locale,
      type: 'website',
      images: [
        {
          url: '/og-image.jpg',
          width: 1200,
          height: 630,
          alt: siteName,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: ['/og-image.jpg'],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();
  const settings = await getSiteSettings();

  const direction = locale === 'ar' ? 'rtl' : 'ltr';

  return (
    <html lang={locale} dir={direction} suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased bg-background text-foreground transition-colors duration-300`}>
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <SmoothScroll>
              <TransitionProvider>
                <Navbar settings={{ siteName: settings.siteName, logoUrl: settings.logoUrl }} />
                <main className="min-h-screen pt-[73px]">
                  {children}
                </main>
                <Footer />
              </TransitionProvider>
            </SmoothScroll>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

