import { requireAdmin } from "@/lib/auth";
import Link from "next/link";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Protect all admin routes
    await requireAdmin();

    return (
        <div className="flex h-screen bg-background overflow-hidden">
            {/* Sidebar */}
            <aside className="w-64 bg-neutral-950 border-r border-white/5 flex flex-col shrink-0">
                {/* Logo */}
                <div className="p-6 border-b border-white/5">
                    <Link href="/shadow/admin" className="text-xl font-bold gradient-text">
                        Admin Panel
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 overflow-y-auto">
                    <ul className="space-y-1">
                        <li>
                            <Link
                                href="/shadow/admin"
                                className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-foreground-muted hover:text-white hover:bg-white/5 transition-all duration-200"
                            >
                                <span className="text-xl opacity-70">📊</span>
                                Dashboard
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/shadow/admin/profile"
                                className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-foreground-muted hover:text-white hover:bg-white/5 transition-all duration-200"
                            >
                                <span className="text-xl opacity-70">👤</span>
                                Profile
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/shadow/admin/projects"
                                className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-foreground-muted hover:text-white hover:bg-white/5 transition-all duration-200"
                            >
                                <span className="text-xl opacity-70">📁</span>
                                Projects
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/shadow/admin/skills"
                                className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-foreground-muted hover:text-white hover:bg-white/5 transition-all duration-200"
                            >
                                <span className="text-xl opacity-70">⚡</span>
                                Skills
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/shadow/admin/categories"
                                className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-foreground-muted hover:text-white hover:bg-white/5 transition-all duration-200"
                            >
                                <span className="text-xl opacity-70">🏷️</span>
                                Categories
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/shadow/admin/messages"
                                className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-foreground-muted hover:text-white hover:bg-white/5 transition-all duration-200"
                            >
                                <span className="text-xl opacity-70">📬</span>
                                Messages
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/shadow/admin/settings"
                                className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-foreground-muted hover:text-white hover:bg-white/5 transition-all duration-200"
                            >
                                <span className="text-xl opacity-70">⚙️</span>
                                Settings
                            </Link>
                        </li>
                    </ul>
                </nav>

                {/* Footer */}
                <div className="p-4 border-t border-white/5">
                    <Link
                        href="/"
                        className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-foreground-muted hover:text-white hover:bg-white/5 transition-all duration-200"
                    >
                        <svg className="w-5 h-5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Site
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto bg-background">
                <div className="p-8 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
