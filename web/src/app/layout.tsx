import type { Metadata } from "next";
import Navbar from "@/components/navbar";
import { ThemeProvider } from "@/context/theme-context";
import "./globals.css";
import { AuthProvider } from "@/context/auth-context";

export const metadata: Metadata = {
  title: "Festivo",
  description: "Beli tiket? Festivo aja!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <AuthProvider>
            <header className="sticky z-50 top-0">
              <Navbar />
            </header>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
