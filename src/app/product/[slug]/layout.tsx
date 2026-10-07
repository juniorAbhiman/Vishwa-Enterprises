import type { Metadata } from 'next';
import type { ReactNode } from 'react';

const catalogSlugs = [
  'jordan-Cartgy-jeans',
  'ns-nickkar',
  'mens-printed-shirt',
  'boxy-fit-shirt',
  'ns-track-pants',
  'boxy-fit-t-shirt',
  'ns-terry-pant',
  'mens-jeans',
  'mens-t-shirt',
];

const productNames: Record<string, string> = {
  'jordan-Cartgy-jeans': 'Jordan Cartgy Jeans',
  'ns-nickkar': 'NS Nickkar',
  'mens-printed-shirt': 'Men’s Printed Shirt',
  'boxy-fit-shirt': 'Boxy Fit Shirt',
  'ns-track-pants': 'NS Track Pants',
  'boxy-fit-t-shirt': 'Boxy Fit T-Shirt',
  'ns-terry-pant': 'NS Terry Pant',
  'mens-jeans': 'Men’s Jeans',
  'mens-t-shirt': 'Men’s T-Shirt',
};

export function generateStaticParams(): Array<{ slug: string }> {
  return catalogSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const name = productNames[slug] ?? 'Clothing collection';
  return {
    title: `${name} | Vishwa Enterprises`,
    description: `${name} from the Vishwa Enterprises sample clothing collection in Jaunpur.`,
  };
}

export default function ProductLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return children;
}
