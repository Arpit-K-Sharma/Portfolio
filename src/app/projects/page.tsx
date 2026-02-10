import Link from "next/link";
import { projectService } from "@/modules/projects";
import { categoryService } from "@/modules/categories";
import { SkillIcon } from "@/components/skill-icon";


export const metadata = {
    title: "Projects | Arpit Sharma",
    description: "Explore my portfolio of blockchain and full-stack development projects.",
};

export default async function ProjectsPage({
    searchParams,
}: {
    searchParams: Promise<{ category?: string }>;
}) {
    const params = await searchParams;
    const categorySlug = params.category;

    const [projects, categories] = await Promise.all([
        categorySlug
            ? projectService.getProjectsByCategory(categorySlug)
            : projectService.getAllProjects(),
        categoryService.getAllVisibleCategories(),
    ]);

    return (
        <main className="min-h-screen">
            {/* Header */}
            <header className="border-b border-border bg-background-secondary/50 backdrop-blur-sm sticky top-0 z-50">
                <div className="container-custom py-4 flex items-center justify-between">
                    <Link href="/" className="text-xl font-bold gradient-text">
                        Arpit Sharma
                    </Link>
                    <nav className="flex items-center gap-6">
                        <Link href="/" className="text-foreground-muted hover:text-foreground transition-colors">
                            Home
                        </Link>
                        <Link href="/projects" className="text-foreground font-medium">
                            Projects
                        </Link>
                        <Link href="/contact" className="btn-primary text-sm">
                            Contact
                        </Link>
                    </nav>
                </div>
            </header>

            {/* Hero */}
            <section className="py-16 bg-gradient-to-b from-background-secondary to-background">
                <div className="container-custom text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        My <span className="gradient-text">Projects</span>
                    </h1>
                    <p className="text-foreground-muted max-w-2xl mx-auto">
                        A collection of my work in blockchain development, web applications, and more.
                    </p>
                </div>
            </section>

            {/* Filters */}
            <section className="py-8 border-b border-border">
                <div className="container-custom">
                    <div className="flex flex-wrap gap-3 justify-center">
                        <Link
                            href="/projects"
                            className={`badge text-sm px-4 py-2 transition-all ${!categorySlug
                                ? "bg-primary text-white"
                                : "hover:bg-primary/20"
                                }`}
                        >
                            All
                        </Link>
                        {categories.map((cat) => (
                            <Link
                                key={cat.id}
                                href={`/projects?category=${cat.slug}`}
                                className={`badge text-sm px-4 py-2 transition-all ${categorySlug === cat.slug
                                    ? "bg-primary text-white"
                                    : "hover:bg-primary/20"
                                    }`}
                            >
                                {cat.name}
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Projects Grid */}
            <section className="section">
                <div className="container-custom">
                    {projects.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-foreground-muted">No projects found.</p>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {projects.map((project) => (
                                <Link
                                    key={project.id}
                                    href={`/projects/${project.slug}`}
                                    className="card-hover group"
                                >
                                    {/* Thumbnail */}
                                    <div className="h-48 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg mb-4 overflow-hidden">
                                        {project.thumbnailUrl ? (
                                            <img
                                                src={project.thumbnailUrl}
                                                alt={project.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <span className="text-4xl opacity-50">🚀</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                                        {project.title}
                                    </h3>
                                    <p className="text-foreground-muted text-sm mb-4 line-clamp-2">
                                        {project.shortDescription}
                                    </p>

                                    {/* Categories */}
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        {project.categories.map((cat) => (
                                            <span key={cat.id} className="badge">
                                                {cat.name}
                                            </span>
                                        ))}
                                    </div>

                                    {/* Skills */}
                                    <div className="flex flex-wrap gap-1">
                                        {project.skills.slice(0, 4).map((skill) => (
                                            <span
                                                key={skill.id}
                                                className="text-xs text-foreground-subtle bg-background-secondary px-2 py-1 rounded flex items-center gap-1"
                                            >
                                                <SkillIcon icon={skill.iconUrl} alt={skill.name} className="w-3 h-3" />
                                                {skill.name}
                                            </span>
                                        ))}
                                        {project.skills.length > 4 && (
                                            <span className="text-xs text-foreground-subtle bg-background-secondary px-2 py-1 rounded">
                                                +{project.skills.length - 4}
                                            </span>
                                        )}
                                    </div>

                                    {/* Links */}
                                    <div className="flex gap-3 mt-4 pt-4 border-t border-border">
                                        {project.githubUrl && (
                                            <span className="text-sm text-foreground-muted flex items-center gap-1">
                                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                                                </svg>
                                                Code
                                            </span>
                                        )}
                                        {project.demoUrl && (
                                            <span className="text-sm text-foreground-muted flex items-center gap-1">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                </svg>
                                                Demo
                                            </span>
                                        )}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Footer */}
            <footer className="py-8 border-t border-border">
                <div className="container-custom text-center text-foreground-subtle">
                    <p>© {new Date().getFullYear()} Arpit Sharma. All rights reserved.</p>
                </div>
            </footer>
        </main>
    );
}
