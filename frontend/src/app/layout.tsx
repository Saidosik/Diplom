import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Sans, Oxanium } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils/utils";
import { QueryProvider } from "@/providers/query-provider";
import { AppHeader } from '@/components/layout/app-header';
import { Toaster } from 'sonner';
import { ThemeProvider } from '@/providers/theme-provider';

const oxaniumHeading = Oxanium({ subsets: ['latin'], variable: '--font-heading' });

const notoSans = Noto_Sans({ subsets: ['latin'], variable: '--font-sans' });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: 'Вектор',
  description: 'Учебная платформа',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning
      lang="ru"
      className={cn("h-full", "antialiased", geistSans.variable, geistMono.variable, "font-sans", notoSans.variable, oxaniumHeading.variable)}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
         <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
        <QueryProvider>
          <AppHeader />
          {children}
          <Toaster richColors position="bottom-right" />
        </QueryProvider></ThemeProvider>
      </body>
    </html>
  );
}
