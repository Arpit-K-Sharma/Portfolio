import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";

export const metadata: Metadata = {
    title: "Arpit Sharma | Portfolio",
    description: "Blockchain & Full-Stack Developer portfolio showcasing projects in Web3, DeFi, and modern web applications.",
    keywords: ["blockchain", "full-stack", "developer", "portfolio", "web3", "solidity", "next.js"],
    authors: [{ name: "Arpit Sharma" }],
    openGraph: {
        title: "Arpit Sharma | Portfolio",
        description: "Blockchain & Full-Stack Developer",
        type: "website",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="dark">
            <body className="min-h-screen bg-background">
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
