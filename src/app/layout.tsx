import type { Metadata } from "next";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "Coin Stats - Live Crypto Prices",
  description: "Get real-time cryptocurrency prices with Coin Stats.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-gray-900 text-white">
        <nav className="bg-gray-800 shadow-lg p-4 text-center text-xl font-bold">
          Coin Stats 📈
        </nav>
        <main className="flex flex-col">
          {children}
        </main>
      </body>
    </html>
  );
}