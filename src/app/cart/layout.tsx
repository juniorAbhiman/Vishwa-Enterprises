import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Your Cart | Vishwa Enterprises",
  description:
    "Review your selected Vishwa clothing and sample delivery estimate.",
};

export default function CartLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return children;
}
