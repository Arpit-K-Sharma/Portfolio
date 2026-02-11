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
        <main className="min-h-screen pt-24">
            {/* Hero */}
            <section className="py-16 relative overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute top-0 left-1/3 w-96 h-96 bg-primary/8 rounded-full blur-[128px]" />
                    <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-accent/8 rounded-full blur-[128px]" />
                </div>

                <div className="container-custom text-center relative z-10">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-in">
                        My <span className="gradient-text">Projects</span>
                    </h1>
                    <p className="text-foreground-muted max-w-2xl mx-auto animate-in delay-100">
                        A collection of my work in blockchain development, web applications, and more.
                    </p>
                </div>
            </section>

            {/* Filters */}
            <section className="pb-8">
                <div className="container-custom">
                    <div className="flex flex-wrap gap-2 justify-center animate-in delay-200">
                        <Link
                            href="/projects"
                            className={`px-5 py-2 rounded-xl text-sm font-medium transition-all duration-300 border ${!categorySlug
                                ? "bg-primary text-white border-primary glow-sm"
                                : "bg-white/[0.04] border-white/[0.08] text-foreground-muted hover:bg-white/[0.08] hover:border-white/[0.15] hover:text-foreground"
                                }`}
                        >
                            All
                        </Link>
                        {categories.map((cat) => (
                            <Link
                                key={cat.id}
                                href={`/projects?category=${cat.slug}`}
                                className={`px-5 py-2 rounded-xl text-sm font-medium transition-all duration-300 border ${categorySlug === cat.slug
                                    ? "bg-primary text-white border-primary glow-sm"
                                    : "bg-white/[0.04] border-white/[0.08] text-foreground-muted hover:bg-white/[0.08] hover:border-white/[0.15] hover:text-foreground"
                                    }`}
                            >
                                {cat.name}
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Projects Grid */}
            <section className="pb-20">
                <div className="container-custom">
                    {projects.length === 0 ? (
                        <div className="text-center py-20">
                            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center">
                                <span className="text-3xl opacity-50">📂</span>
                            </div>
                            <p className="text-foreground-muted text-lg">No projects found in this category.</p>
                            <Link href="/projects" className="btn-ghost mt-4 inline-flex">
                                View all projects
                            </Link>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {projects.map((project, i) => (
                                <Link
                                    key={project.id}
                                    href={`/projects/${project.slug}`}
                                    className={`glass-card group block animate-in delay-${Math.min((i + 1) * 100, 700)}`}
                                >
                                    {/* Thumbnail */}
                                    <div className="aspect-video bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl mb-5 overflow-hidden relative">
                                        {project.thumbnailUrl ? (
                                            <img
                                                src={project.thumbnailUrl}
                                                alt={project.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <span className="text-4xl opacity-30">🚀</span>
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                                            <span className="text-sm font-medium text-primary">View Details →</span>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors duration-300">
                                        {project.title}
                                    </h3>
                                    <p className="text-foreground-muted text-sm mb-4 line-clamp-2 leading-relaxed">
                                        {project.shortDescription}
                                    </p>

                                    {/* Categories */}
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {project.categories.map((cat) => (
                                            <span key={cat.id} className="badge text-xs">{cat.name}</span>
                                        ))}
                                    </div>

                                    {/* Skills */}
                                    <div className="flex flex-wrap gap-1.5 pt-4 border-t border-white/[0.06]">
                                        {project.skills.slice(0, 4).map((skill) => (
                                            <span
                                                key={skill.id}
                                                className="text-xs text-foreground-subtle bg-white/[0.04] px-2.5 py-1 rounded-lg flex items-center gap-1.5"
                                            >
                                                <SkillIcon icon={skill.iconUrl} alt={skill.name} className="w-3 h-3" />
                                                {skill.name}
                                            </span>
                                        ))}
                                        {project.skills.length > 4 && (
                                            <span className="text-xs text-foreground-subtle bg-white/[0.04] px-2.5 py-1 rounded-lg">
                                                +{project.skills.length - 4}
                                            </span>
                                        )}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}
