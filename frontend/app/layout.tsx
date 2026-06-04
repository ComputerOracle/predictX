import type { Metadata } from "next";
import { WalletProvider } from "@/lib/wallet/wallet-context";
import "./globals.css";

export const metadata: Metadata = {
  title: "PredictX",
  description: "A Stellar Soroban prediction marketplace."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <WalletProvider>{children}</WalletProvider>
      </body>
    </html>
  );
}

