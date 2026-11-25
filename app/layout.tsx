import type { Metadata, Viewport } from "next";
import { Be_Vietnam_Pro, Poppins } from "next/font/google";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import JsonLd from "@/components/JsonLd";
import Reveal from "@/components/Reveal";
import { localBusinessLd, websiteLd } from "@/lib/seo";
import { BUSINESS, INDEXABLE, SITE_URL } from "@/lib/site";
import "./globals.css";

// Fonts are downloaded at build time and served from the site itself (fast, no Google Fonts request).
const vietnam = Be_Vietnam_Pro({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-vietnam",
  display: "swap",
});
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "600"], variable: "--font-poppins", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${BUSINESS.name} – Wooden Pallets in British Columbia`, template: `%s | ${BUSINESS.name}` },
  description: BUSINESS.description,
  applicationName: BUSINESS.name,
  authors: [{ name: BUSINESS.name }],
  formatDetection: { telephone: false },
  robots: INDEXABLE ? { index: true, follow: true } : { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-CA" className={`${vietnam.variable} ${poppins.variable}`} suppressHydrationWarning>
      <head>
        {/* Lets the fade-in effect hide sections only when JavaScript is running. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>
        <a className="skip-link" href="#main">Skip to content</a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <Reveal />
        <JsonLd data={[localBusinessLd(), websiteLd()]} />
      </body>
    </html>
  );
}
