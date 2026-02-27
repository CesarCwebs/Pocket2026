import type {Metadata} from 'next';
import './globals.css';
// Reemplazamos el Toaster de shadcn/ui por el de sonner
import { Toaster } from 'sonner';

export const metadata: Metadata = {
  title: 'NexusFlow ERP',
  description: 'Enterprise Operational Dashboard and Management System',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-background">
        {children}
        {/* Este Toaster ahora es el de 'sonner', y lo configuramos para que aparezca en la esquina superior derecha */}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
