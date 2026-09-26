import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeToggle } from "@/components/ThemeToggle";
import { pageMetadata } from "@/lib/metadata";
import { site } from "@/site.config";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  ...pageMetadata({ title: site.title, path: "/" }),
  metadataBase: new URL(site.url),
  title: { default: site.title, template: `%s | ${site.name}` },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang={site.locale} className={inter.variable} suppressHydrationWarning>
      <head>
        {/* Applies a saved theme before first paint so there's no flash of the
            wrong palette. No stored value means "system", which the CSS
            already handles via prefers-color-scheme. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("theme");if(t==="light"||t==="dark"){document.documentElement.setAttribute("data-theme",t)}}catch(e){}})()`,
          }}
        />
      </head>
      <body>
        <a href="#main-content" className="skip-link">Skip to content</a>
        <ThemeToggle />
        {children}
      </body>
    </html>
  );
}
