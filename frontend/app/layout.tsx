import type { Metadata } from "next";
import Providers from "./providers";
import Script from "next/script";

export const metadata: Metadata = {
  title: "VedaAI",
  description: "AI Assessment Creator",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Script src="https://cdn.tailwindcss.com" strategy="beforeInteractive"/>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}