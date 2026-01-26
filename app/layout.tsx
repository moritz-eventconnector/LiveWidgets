import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'LiveWidgets – Interactive Twitch Overlays',
  description:
    'Interaktive OBS-Overlays & Twitch-Widgets für Bonushunts, Slot Requests & Tournaments.',
  icons: {
    icon: '/favicon.ico'
  },
  openGraph: {
    title: 'LiveWidgets – Interactive Twitch Overlays',
    description:
      'Interaktive OBS-Overlays & Twitch-Widgets für Bonushunts, Slot Requests & Tournaments.',
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
    <html lang="de" suppressHydrationWarning>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
