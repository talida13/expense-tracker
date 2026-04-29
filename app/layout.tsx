import { AuthProvider } from "@/context/AuthProvider";
import { LayoutContent } from "@/components/LayoutContent";
import { Analytics } from "@vercel/analytics/next";
import type { Viewport } from "next";
import { DM_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";
import { SettingsProvider } from "@/lib/SettingsContext";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["400", "500", "600", "700"],
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["500", "600", "700"],
});

export const viewport: Viewport = {
  themeColor: "#1a2744",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-background">
      <body
        className={`${dmSans.variable} ${playfair.variable} font-sans antialiased`}
      >
        <SettingsProvider>
          <AuthProvider>
            <LayoutContent>{children}</LayoutContent>
            {process.env.NODE_ENV === "production" && <Analytics />}
          </AuthProvider>
        </SettingsProvider>
      </body>
    </html>
  );
}
