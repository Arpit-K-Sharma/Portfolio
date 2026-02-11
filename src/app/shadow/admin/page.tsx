import { projectService } from "@/modules/projects";
import { skillService } from "@/modules/skills";
import { categoryService } from "@/modules/categories";
import { contactService } from "@/modules/contact";
import Link from "next/link";

// SVG Icon components for clean, consistent admin UI
const icons = {
    folder: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 17V7a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2Z" /></svg>
    ),
    wrench: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" /></svg>
    ),
    tag: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z" /><path d="M7 7h.01" /></svg>
    ),
    mail: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
    ),
    save: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" /></svg>
    ),
    pencil: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /><path d="m15 5 4 4" /></svg>
    ),
};

export default async function AdminDashboard() {
    const [projects, skills, categories, unreadCount] = await Promise.all([
        projectService.getAllProjects(),
        skillService.getAllSkills(),
        categoryService.getAllCategories(),
        contactService.getUnreadCount(),
    ]);

    const stats = [
        { name: "Projects", value: projects.length, href: "/shadow/admin/projects", icon: icons.folder },
        { name: "Skills", value: skills.length, href: "/shadow/admin/skills", icon: icons.wrench },
        { name: "Categories", value: categories.length, href: "/shadow/admin/categories", icon: icons.tag },
        { name: "Unread Messages", value: unreadCount, href: "/shadow/admin/messages", icon: icons.mail },
    ];

    return (
        <div>
            <div className="flex items-end justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
                    <p className="text-foreground-muted">Welcome back! Here&apos;s what&apos;s happening today.</p>
                </div>
                <div className="text-sm text-foreground-subtle bg-white/5 px-4 py-2 rounded-full border border-white/5">
                    {new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {stats.map((stat) => (
                    <Link
                        key={stat.name}
                        href={stat.href}
                        className="group relative p-6 bg-card/40 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden hover:border-primary/20 transition-all duration-300"
                    >
                        <div className="flex items-center justify-between relative z-10">
                            <div>
                                <p className="text-foreground-muted text-sm font-medium mb-1">{stat.name}</p>
                                <h3 className="text-3xl font-bold text-foreground group-hover:text-primary transition-colors">{stat.value}</h3>
                            </div>
                            <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-foreground-muted group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                {stat.icon}
                            </div>
                        </div>
                        {/* Glow Effect */}
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </Link>
                ))}
            </div>

            {/* Quick Actions */}
            <h2 className="text-xl font-semibold mb-6">Quick Actions</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                <Link href="/shadow/admin/projects" className="p-4 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 rounded-xl transition-all text-center group">
                    <span className="w-10 h-10 mx-auto mb-2 flex items-center justify-center rounded-lg bg-white/5 text-foreground-muted group-hover:text-primary group-hover:bg-primary/10 transition-colors">
                        {icons.folder}
                    </span>
                    <span className="text-sm font-medium text-foreground-muted group-hover:text-foreground">New Project</span>
                </Link>
                <Link href="/shadow/admin/skills" className="p-4 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 rounded-xl transition-all text-center group">
                    <span className="w-10 h-10 mx-auto mb-2 flex items-center justify-center rounded-lg bg-white/5 text-foreground-muted group-hover:text-primary group-hover:bg-primary/10 transition-colors">
                        {icons.wrench}
                    </span>
                    <span className="text-sm font-medium text-foreground-muted group-hover:text-foreground">New Skill</span>
                </Link>
                <Link href="/shadow/admin/categories" className="p-4 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 rounded-xl transition-all text-center group">
                    <span className="w-10 h-10 mx-auto mb-2 flex items-center justify-center rounded-lg bg-white/5 text-foreground-muted group-hover:text-primary group-hover:bg-primary/10 transition-colors">
                        {icons.tag}
                    </span>
                    <span className="text-sm font-medium text-foreground-muted group-hover:text-foreground">New Category</span>
                </Link>
                <Link href="/shadow/admin/settings" className="p-4 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 rounded-xl transition-all text-center group">
                    <span className="w-10 h-10 mx-auto mb-2 flex items-center justify-center rounded-lg bg-white/5 text-foreground-muted group-hover:text-primary group-hover:bg-primary/10 transition-colors">
                        {icons.save}
                    </span>
                    <span className="text-sm font-medium text-foreground-muted group-hover:text-foreground">Backup</span>
                </Link>
            </div>

            {/* Recent Projects */}
            <h2 className="text-xl font-semibold mb-6">Recent Projects</h2>
            <div className="bg-card/30 border border-white/5 rounded-2xl overflow-hidden">
                {projects.length === 0 ? (
                    <div className="p-8 text-center text-foreground-muted">No projects yet. Create your first project!</div>
                ) : (
                    <div className="divide-y divide-white/5">
                        {projects.slice(0, 5).map((project) => (
                            <div
                                key={project.id}
                                className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-neutral-900 border border-white/10 flex items-center justify-center overflow-hidden">
                                        {project.thumbnailUrl ? (
                                            <img src={project.thumbnailUrl} alt="" className="w-full h-full object-cover opacity-80" />
                                        ) : (
                                            <svg className="w-5 h-5 text-foreground-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M2 17V7a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2Z" /></svg>
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-foreground">{project.title}</h3>
                                        <div className="flex gap-2 text-xs text-foreground-muted">
                                            {project.categories.slice(0, 2).map(c => c.name).join(", ")}
                                            {project.categories.length > 2 && ` +${project.categories.length - 2}`}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    {project.isFeatured && (
                                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-primary/20 text-primary border border-primary/20 uppercase tracking-wide">
                                            Featured
                                        </span>
                                    )}
                                    <Link
                                        href={`/shadow/admin/projects/${project.id}?edit=true`}
                                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 text-foreground-muted hover:text-foreground transition-all"
                                    >
                                        {icons.pencil}
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
