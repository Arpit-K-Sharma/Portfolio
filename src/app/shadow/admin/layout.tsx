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
                                <svg className="w-5 h-5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5"><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="4" rx="1" /><rect x="14" y="11" width="7" height="10" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /></svg>
                                Dashboard
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/shadow/admin/profile"
                                className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-foreground-muted hover:text-white hover:bg-white/5 transition-all duration-200"
                            >
                                <svg className="w-5 h-5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                                Profile
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/shadow/admin/projects"
                                className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-foreground-muted hover:text-white hover:bg-white/5 transition-all duration-200"
                            >
                                <svg className="w-5 h-5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 17V7a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2Z" /></svg>
                                Projects
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/shadow/admin/skills"
                                className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-foreground-muted hover:text-white hover:bg-white/5 transition-all duration-200"
                            >
                                <svg className="w-5 h-5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" /></svg>
                                Skills
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/shadow/admin/categories"
                                className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-foreground-muted hover:text-white hover:bg-white/5 transition-all duration-200"
                            >
                                <svg className="w-5 h-5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z" /><path d="M7 7h.01" /></svg>
                                Categories
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/shadow/admin/messages"
                                className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-foreground-muted hover:text-white hover:bg-white/5 transition-all duration-200"
                            >
                                <svg className="w-5 h-5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
                                Messages
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/shadow/admin/settings"
                                className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-foreground-muted hover:text-white hover:bg-white/5 transition-all duration-200"
                            >
                                <svg className="w-5 h-5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" /></svg>
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
