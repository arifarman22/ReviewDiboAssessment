import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { AppProvider } from '@/hooks/useAppContext';
import { AuthProvider } from '@/hooks/useAuth';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Toaster } from 'react-hot-toast';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'ReviewSphere - Premium Product Reviews & Ratings Platform',
  description:
    'Browse premium products, read community reviews, and write detailed product reviews with real-time stats breakdown.',
  keywords: ['product reviews', 'ratings', 'feedback', 'e-commerce feedback', 'tech reviews'],
  authors: [{ name: 'ReviewSphere Team' }],
  openGraph: {
    title: 'ReviewSphere - Product Reviews & Ratings',
    description: 'Browse premium products, read community reviews, and write detailed product reviews.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-screen flex-col bg-[var(--background)] text-[var(--foreground)] transition-colors duration-200">
        <AppProvider>
        <AuthProvider>
          <Navbar />
          <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>
          <Footer />
          <Toaster
            position="top-right"
            toastOptions={{
              className: 'dark:bg-slate-900 dark:text-slate-100 dark:border dark:border-slate-800 text-sm font-medium rounded-lg',
              duration: 3500,
            }}
          />
        </AuthProvider>
        </AppProvider>
      </body>
    </html>
  );
}
