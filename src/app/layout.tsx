import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

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
            <body className="min-h-screen bg-background flex flex-col">
                <Providers>
                    <Navbar />
                    <div className="flex-1">{children}</div>
                    <Footer />
                </Providers>
            </body>
        </html>
    );
}
