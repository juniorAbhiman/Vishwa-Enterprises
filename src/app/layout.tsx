import type { Metadata } from 'next';
import { Suspense } from 'react';
import './globals.css';
import { ShopProvider } from '../components/shop-context';
import { ShopShell } from '../components/header';
import { Providers } from '../components/providers';
import { DemoBanner } from '@/components/ui/demo-banner';

export const metadata: Metadata = {
  title: 'Vishwa Enterprises JNP | Everyday style, fair prices',
  description:
    "Shop current men’s and women’s clothing from Vishwa Enterprises, Kuttupur, Jaunpur. Good quality, fair prices and cash on delivery.",
  openGraph: {
    title: 'Vishwa Enterprises JNP',
    description:
      'Everyday style from your neighbourhood clothing shop in Kuttupur, Jaunpur.',
    type: 'website',
    locale: 'en_IN',
    siteName: 'Vishwa Enterprises',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vishwa Enterprises JNP',
    description:
      'Everyday style from your neighbourhood clothing shop in Kuttupur, Jaunpur.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <ShopProvider>
            <ShopShell>
              <DemoBanner />
              <Suspense
                fallback={
                  <main style={{ maxWidth: 1200, margin: '0 auto', padding: '72px 24px' }}>
                    Loading Vishwa collection…
                  </main>
                }
              >
                {children}
              </Suspense>
            </ShopShell>
          </ShopProvider>
        </Providers>
      </body>
    </html>
  );
}