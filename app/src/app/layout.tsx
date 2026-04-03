import type { Metadata } from "next";
import { IBM_Plex_Mono, Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Header } from "@/components/header";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-ibm-plex-mono",
});

export const metadata: Metadata = {
  title: "Dispute Explorer — OP Stack Fault Proof Games",
  description:
    "Explore active and past OP Stack dispute games on Optimism, Base, Ink, and Unichain.",
  icons: {
    icon: "/favicon.svg",
  },
  metadataBase: new URL("https://disputes.slopo.net"),
  openGraph: {
    title: "Dispute Explorer",
    description:
      "Explore active and past OP Stack fault proof dispute games.",
    siteName: "Dispute Explorer",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dispute Explorer",
    description:
      "Explore active and past OP Stack fault proof dispute games.",
    creator: "@donnoh_eth",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${ibmPlexMono.variable} font-sans bg-terminal-bg text-zinc-300 antialiased noise`}
      >
        <Providers>
          <div className="flex flex-col min-h-dvh">
            <Header />
            <main className="flex-1 max-w-[1600px] mx-auto w-full">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
