import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'FLG CARS | Vehicle Operations',
  description: 'Fleet condition, repair records and executive oversight.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}
