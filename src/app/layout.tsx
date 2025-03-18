import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pollify",
  description: "/",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <nav className="p-4 shadow-md text-center">Pollify</nav>
        <main className="container mx-auto p-4">{children}</main>
      </body>
    </html>
  );
}
