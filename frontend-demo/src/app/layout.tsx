import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { Geist, Geist_Mono, Noto_Sans, Oxanium } from 'next/font/google';
import { Toaster } from 'sonner';

import { AppHeader } from '@/components/layout/app-header';
import { cn } from '@/lib/utils/utils';
import { QueryProvider } from '@/providers/query-provider';
import { ThemeProvider } from '@/providers/theme-provider';
import './globals.css';

const oxaniumHeading = Oxanium({ subsets: ['latin'], variable: '--font-heading' });
const notoSans = Noto_Sans({ subsets: ['latin', 'cyrillic'], variable: '--font-sans' });
const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Вектор — образовательная платформа с ИИ-наставником',
  description: 'Учебная платформа для курсов, практики, прогресса и ИИ-помощи в обучении программированию.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html
      suppressHydrationWarning
      lang="ru"
      className={cn(
        'h-full antialiased',
        geistSans.variable,
        geistMono.variable,
        notoSans.variable,
        oxaniumHeading.variable,
      )}
    >
      <body className="min-h-full bg-background text-foreground">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
          <QueryProvider>
            <AppHeader />
            {children}
            <Toaster richColors position="bottom-right" />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
