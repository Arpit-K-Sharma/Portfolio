import Link from "next/link";
import { notFound } from "next/navigation";
import { projectService } from "@/modules/projects";
import { SkillIcon } from "@/components/skill-icon";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const project = await projectService.getProjectBySlug(slug);

    if (!project) {
        return { title: "Project Not Found" };
    }

    return {
        title: `${project.title} | Arpit Sharma`,
        description: project.shortDescription,
    };
}

export default async function ProjectDetailPage({
    params
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params;
    const project = await projectService.getProjectBySlug(slug);

    if (!project) {
        notFound();
    }

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
                        <Link href="/projects" className="text-foreground-muted hover:text-foreground transition-colors">
                            Projects
                        </Link>
                        <Link href="/contact" className="btn-primary text-sm">
                            Contact
                        </Link>
                    </nav>
                </div>
            </header>

            {/* Breadcrumb */}
            <div className="bg-background-secondary border-b border-border">
                <div className="container-custom py-4">
                    <nav className="flex items-center gap-2 text-sm text-foreground-muted">
                        <Link href="/" className="hover:text-foreground">Home</Link>
                        <span>/</span>
                        <Link href="/projects" className="hover:text-foreground">Projects</Link>
                        <span>/</span>
                        <span className="text-foreground">{project.title}</span>
                    </nav>
                </div>
            </div>

            {/* Project Header */}
            <section className="py-12 bg-gradient-to-b from-background-secondary to-background">
                <div className="container-custom">
                    <div className="max-w-4xl mx-auto">
                        {/* Categories */}
                        <div className="flex flex-wrap gap-2 mb-4">
                            {project.categories.map((cat) => (
                                <span key={cat.id} className="badge">
                                    {cat.name}
                                </span>
                            ))}
                        </div>

                        <h1 className="text-4xl md:text-5xl font-bold mb-4">{project.title}</h1>
                        <p className="text-xl text-foreground-muted mb-8">{project.shortDescription}</p>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-4">
                            {project.githubUrl && (
                                <a
                                    href={project.githubUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn-secondary"
                                >
                                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                                    </svg>
                                    View Code
                                </a>
                            )}
                            {project.demoUrl && (
                                <a
                                    href={project.demoUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn-primary"
                                >
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                    Live Demo
                                </a>
                            )}
                            {project.youtubeUrl && (
                                <a
                                    href={project.youtubeUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn-secondary"
                                >
                                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                                    </svg>
                                    Watch Video
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Project Content */}
            <section className="section">
                <div className="container-custom">
                    <div className="max-w-4xl mx-auto">
                        <div className="grid md:grid-cols-3 gap-12">
                            {/* Main Content */}
                            <div className="md:col-span-2">
                                <h2 className="text-2xl font-semibold mb-4">About This Project</h2>
                                <div className="prose prose-invert max-w-none">
                                    <p className="text-foreground-muted whitespace-pre-wrap leading-relaxed">
                                        {project.fullDescription}
                                    </p>
                                </div>
                            </div>

                            {/* Sidebar */}
                            <div className="space-y-8">
                                {/* Languages */}
                                {project.skills.some(s => s.type === "LANGUAGE") && (
                                    <div className="card">
                                        <h3 className="font-semibold mb-4">Languages</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {project.skills
                                                .filter(s => s.type === "LANGUAGE")
                                                .map((skill) => (
                                                    <span
                                                        key={skill.id}
                                                        className="badge flex items-center gap-2"
                                                    >
                                                        <SkillIcon icon={skill.iconUrl} alt={skill.name} className="w-4 h-4" />
                                                        {skill.name}
                                                    </span>
                                                ))}
                                        </div>
                                    </div>
                                )}

                                {/* Technologies */}
                                {project.skills.some(s => s.type !== "LANGUAGE") && (
                                    <div className="card">
                                        <h3 className="font-semibold mb-4">Technologies</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {project.skills
                                                .filter(s => s.type !== "LANGUAGE")
                                                .map((skill) => (
                                                    <span
                                                        key={skill.id}
                                                        className="badge flex items-center gap-2"
                                                    >
                                                        <SkillIcon icon={skill.iconUrl} alt={skill.name} className="w-4 h-4" />
                                                        {skill.name}
                                                    </span>
                                                ))}
                                        </div>
                                    </div>
                                )}


                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Back to Projects */}
            <section className="py-12 border-t border-border">
                <div className="container-custom text-center">
                    <Link href="/projects" className="btn-ghost">
                        ← Back to All Projects
                    </Link>
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
