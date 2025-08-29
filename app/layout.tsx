import type { Metadata } from "next";
import "./globals.css";
import dbConnect from "@/lib/mongodb";
import ThemeRegistry from './theme-registry';
import AuthProvider from './auth-provider';

export const metadata: Metadata = {
  title: "NM Prod",
  description: "NM Prod Application",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await dbConnect();
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <ThemeRegistry>
            {children}
          </ThemeRegistry>
        </AuthProvider>
      </body>
    </html>
  );
}
