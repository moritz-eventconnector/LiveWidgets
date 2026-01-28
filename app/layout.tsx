import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'LiveWidgets',
  description:
    'Ein frischer Neustart für interaktive Twitch-Overlays, Community-Features und Creator-Tools.',
  icons: {
    icon: '/favicon.ico'
  },
  openGraph: {
    title: 'LiveWidgets',
    description:
      'Ein frischer Neustart für interaktive Twitch-Overlays, Community-Features und Creator-Tools.',
    url: 'https://livewidgets.de',
    siteName: 'LiveWidgets',
    type: 'website'
  }
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de" className={inter.className}>
      <body>
        <div className="min-h-screen bg-slate-950 text-white">
          {children}
        </div>
      </body>
    </html>
  );
}
