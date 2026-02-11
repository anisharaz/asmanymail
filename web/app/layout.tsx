import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const notoSans = Noto_Sans({ variable: "--font-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://mail.asmany.app"),
  title: {
    default: "AsManyMail - Unlimited Email Addresses with Persistent Storage",
    template: "%s | AsManyMail",
  },
  description:
    "Create unlimited email addresses instantly. All emails are persistent, secure, and stored with full attachment support. No limits, no verification required.",
  keywords: [
    "unlimited email",
    "temporary email",
    "disposable email",
    "email addresses",
    "persistent email",
    "secure email",
    "email management",
    "multiple email addresses",
  ],
  authors: [{ name: "AsManyMail" }],
  creator: "AsManyMail",

  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "AsManyMail",
  },

  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://mail.asmany.app", // <-- FIX: should be site URL, not image
    title: "AsManyMail - Unlimited Email Addresses",
    description:
      "Create unlimited email addresses instantly with persistent storage and full attachment support.",
    siteName: "AsManyMail",
    images: [
      {
        url: "/web-app-manifest-512x512.png",
        width: 512,
        height: 512,
        alt: "AsManyMail",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "AsManyMail - Unlimited Email Addresses",
    description:
      "Create unlimited email addresses instantly with persistent storage and full attachment support.",
    images: ["/web-app-manifest-512x512.png"],
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={notoSans.variable} suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
