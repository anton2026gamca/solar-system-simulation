import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import './globals.css';

const inter = localFont({
  src: './fonts/inter-variable.woff2',
  weight: '100 900',
  variable: '--font-inter',
  display: 'swap',
});

const jetbrains = localFont({
  src: [
    { path: './fonts/jetbrains-mono-400.woff2', weight: '400', style: 'normal' },
    { path: './fonts/jetbrains-mono-500.woff2', weight: '500', style: 'normal' },
    { path: './fonts/jetbrains-mono-700.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--font-jetbrains',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Solar System Simulation',
  description:
    'An interactive model of the solar system built on real ephemerides, with every solar and lunar eclipse from 2001 to 2100 catalogued by NASA.',
  applicationName: 'Solar System Simulation',
  openGraph: {
    title: 'Solar System Simulation',
    description: 'Fly the solar system through time and watch eclipses line up.',
    type: 'website',
  },
};

export const viewport: Viewport = {
  themeColor: '#04060a',
  colorScheme: 'dark',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrains.variable} h-full antialiased`}
    >
      <body className="h-full overflow-hidden bg-void text-ink">{children}</body>
    </html>
  );
}
