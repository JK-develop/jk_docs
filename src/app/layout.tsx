import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { CommandPalette } from "@/components/CommandPalette";
import { NewGuideFab } from "@/components/NewGuideFab";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "JK Wiki",
  description: "Personal and comprehensive knowledge base",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const categories = await prisma.category.findMany({
    include: { guides: true },
    orderBy: { id: "asc" },
  });

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Vazirmatn:wght@100;400;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <Providers>
          <div className="flex min-h-screen bg-app text-app">
            {/* Sidebar component - handles its own responsiveness via context */}
            <Sidebar categories={categories} />
            
            <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
              <Header categories={categories} />
              
              <main className="flex-1 overflow-y-auto px-4 py-8 lg:px-8">
                <div className="max-w-4xl mx-auto w-full">
                  {children}
                </div>
              </main>
            </div>
            <CommandPalette />
            <NewGuideFab />
          </div>
        </Providers>
      </body>
    </html>
  );
}

