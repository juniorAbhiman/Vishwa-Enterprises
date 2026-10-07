import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Guest checkout | Vishwa Enterprises',
  description: 'Enter delivery details for a cash-on-delivery order from Vishwa Enterprises.',
};

export default function CheckoutLayout({ children }: Readonly<{ children: ReactNode }>) {
  return children;
}
