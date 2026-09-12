import type { Metadata } from "next";
import type { ReactElement, ReactNode } from "react";
import { Fraunces, Outfit } from "next/font/google";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
});

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: {
    default: "Capacíta+",
    template: "%s · Capacíta+",
  },
  description:
    "Portal de capacitação profissional e empreendedora inclusiva, alinhado ao ODS 8.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>): ReactElement {
  return (
    <html lang="pt-BR">
      <body
        className={`${outfit.variable} ${fraunces.variable} flex min-h-screen flex-col antialiased`}
      >
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
