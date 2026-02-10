import { projectService } from "@/modules/projects";
import { skillService } from "@/modules/skills";
import { categoryService } from "@/modules/categories";
import { contactService } from "@/modules/contact";
import Link from "next/link";

export default async function AdminDashboard() {
    const [projects, skills, categories, unreadCount] = await Promise.all([
        projectService.getAllProjects(),
        skillService.getAllSkills(),
        categoryService.getAllCategories(),
        contactService.getUnreadCount(),
    ]);

    const stats = [
        { name: "Projects", value: projects.length, href: "/shadow/admin/projects", icon: "📁" },
        { name: "Skills", value: skills.length, href: "/shadow/admin/skills", icon: "⚡" },
        { name: "Categories", value: categories.length, href: "/shadow/admin/categories", icon: "🏷️" },
        { name: "Unread Messages", value: unreadCount, href: "/shadow/admin/messages", icon: "📬" },
    ];

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {stats.map((stat) => (
                    <Link
                        key={stat.name}
                        href={stat.href}
                        className="card-hover"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-2xl">{stat.icon}</span>
                            <span className="text-3xl font-bold text-primary">{stat.value}</span>
                        </div>
                        <h3 className="text-foreground-muted">{stat.name}</h3>
                    </Link>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="card mb-8">
                <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
                <div className="flex flex-wrap gap-4">
                    <Link href="/shadow/admin/projects" className="btn-primary">
                        + New Project
                    </Link>
                    <Link href="/shadow/admin/skills" className="btn-secondary">
                        + New Skill
                    </Link>
                    <Link href="/shadow/admin/categories" className="btn-secondary">
                        + New Category
                    </Link>
                    <Link href="/shadow/admin/settings" className="btn-secondary">
                        Export Backup
                    </Link>
                </div>
            </div>

            {/* Recent Projects */}
            <div className="card">
                <h2 className="text-xl font-semibold mb-4">Recent Projects</h2>
                {projects.length === 0 ? (
                    <p className="text-foreground-muted">No projects yet. Create your first project!</p>
                ) : (
                    <div className="space-y-4">
                        {projects.slice(0, 5).map((project) => (
                            <div
                                key={project.id}
                                className="flex items-center justify-between p-4 bg-background-secondary rounded-lg"
                            >
                                <div>
                                    <h3 className="font-medium">{project.title}</h3>
                                    <p className="text-sm text-foreground-muted">
                                        {project.categories.map(c => c.name).join(", ")}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    {project.isFeatured && (
                                        <span className="badge">Featured</span>
                                    )}
                                    <Link
                                        href={`/shadow/admin/projects/${project.id}`}
                                        className="btn-ghost text-sm"
                                    >
                                        Edit
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
