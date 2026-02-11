import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

import { profileService } from "@/modules/profile";

export async function generateMetadata(): Promise<Metadata> {
    const profile = await profileService.getProfile();
    const name = profile?.name || "Portfolio";
    const title = `${name} | Portfolio`;

    return {
        title,
        description: profile?.bio || "Blockchain & Full-Stack Developer portfolio showcasing projects in Web3, DeFi, and modern web applications.",
        keywords: ["blockchain", "full-stack", "developer", "portfolio", "web3", "solidity", "next.js"],
        authors: [{ name }],
        openGraph: {
            title,
            description: profile?.title || "Blockchain & Full-Stack Developer",
            type: "website",
            images: profile?.avatarUrl ? [{ url: profile.avatarUrl }] : [],
        },
    };
}

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const profile = await profileService.getProfile();
    const name = profile?.name || "Portfolio";

    return (
        <html lang="en" className="dark">
            <body className="min-h-screen bg-background flex flex-col">
                <Providers>
                    <Navbar name={name} />
                    <div className="flex-1">{children}</div>
                    <Footer name={name} githubUrl={profile?.githubUrl} linkedinUrl={profile?.linkedinUrl} />
                </Providers>
            </body>
        </html>
    );
}
