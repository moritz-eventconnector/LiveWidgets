import './globals.css';
import type { Metadata } from 'next';

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
    <html lang="de">
      <body className="min-h-screen bg-slate-950 font-sans text-white">
        {children}
      </body>
    </html>
  );
}
