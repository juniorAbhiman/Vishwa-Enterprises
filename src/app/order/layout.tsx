import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Track an order | Vishwa Enterprises",
  description:
    "Look up a Vishwa Enterprises order with its order number and checkout email.",
};

export default function OrderLookupLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return children;
}
