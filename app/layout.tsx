import '@/app/ui/global.css';
import { playwrite } from '@/app/ui/fonts';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      {/* antialiased : smooth the font */}
      <body className={`${playwrite.className} antialiased`}>{children}</body>
    </html>
  );
}
