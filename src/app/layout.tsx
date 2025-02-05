'use client';

import { SessionProvider } from 'next-auth/react';
import '../styles/global.css';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt">
      <body>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
