"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navLinks = [
    { href: "/", label: "Home" },
    { href: "/projects", label: "Projects" },
    { href: "/contact", label: "Contact" },
];

export function Navbar() {
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);

    // Don't show on admin routes
    if (pathname.startsWith("/shadow")) return null;

    return (
        <header className="fixed top-0 left-0 right-0 z-50">
            <div className="mx-4 mt-4">
                <nav className="max-w-6xl mx-auto px-6 py-3 rounded-2xl bg-background/60 backdrop-blur-2xl border border-white/[0.06] shadow-lg shadow-black/10">
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <Link href="/" className="text-lg font-bold gradient-text animate-shimmer">
                            Arpit Sharma
                        </Link>

                        {/* Desktop Nav */}
                        <div className="hidden md:flex items-center gap-1">
                            {navLinks.map((link) => {
                                const isActive =
                                    link.href === "/"
                                        ? pathname === "/"
                                        : pathname.startsWith(link.href);

                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${isActive
                                                ? "text-foreground bg-white/[0.08]"
                                                : "text-foreground-muted hover:text-foreground hover:bg-white/[0.04]"
                                            }`}
                                    >
                                        {link.label}
                                    </Link>
                                );
                            })}
                        </div>

                        {/* Mobile Toggle */}
                        <button
                            onClick={() => setMobileOpen(!mobileOpen)}
                            className="md:hidden p-2 rounded-xl hover:bg-white/[0.05] transition-colors"
                            aria-label="Toggle menu"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {mobileOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>

                    {/* Mobile Menu */}
                    {mobileOpen && (
                        <div className="md:hidden mt-3 pt-3 border-t border-white/[0.06]">
                            <div className="flex flex-col gap-1">
                                {navLinks.map((link) => {
                                    const isActive =
                                        link.href === "/"
                                            ? pathname === "/"
                                            : pathname.startsWith(link.href);

                                    return (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            onClick={() => setMobileOpen(false)}
                                            className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${isActive
                                                    ? "text-foreground bg-white/[0.08]"
                                                    : "text-foreground-muted hover:text-foreground hover:bg-white/[0.04]"
                                                }`}
                                        >
                                            {link.label}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </nav>
            </div>
        </header>
    );
}
