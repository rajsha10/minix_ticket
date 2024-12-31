// app/layout.tsx
'use client';

import { useEffect, useState } from 'react';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <html lang="en" style={mounted ? {
      '--tg-viewport-height': '100vh',
      '--tg-viewport-stable-height': '100vh'
    } as React.CSSProperties : undefined}>
      <body>
        {children}
      </body>
    </html>
  );
}