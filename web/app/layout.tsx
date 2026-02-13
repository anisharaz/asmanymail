import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";

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
    default: "AsManyMail - One Account unlimited Email Addresses",
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
    url: "https://mail.asmany.app",
    title: "AsManyMail - One Account unlimited Email Addresses",
    description:
      "Create unlimited email addresses instantly with persistent storage and full attachment support in a single account and single interface.",
    siteName: "AsManyMail",
    images: [
      {
        url: "/ogimage.jpg",
        width: 1200,
        height: 630,
        alt: "AsManyMail",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "AsManyMail - One Account unlimited Email Addresses",
    description:
      "Create unlimited email addresses instantly with persistent storage and full attachment support in a single account and single interface.",
    images: ["/ogimage.jpg"],
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
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
