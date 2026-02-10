import Link from "next/link";
import { notFound } from "next/navigation";
import { projectService } from "@/modules/projects";
import { ProjectWithRelations } from "@/modules/projects/project.types";
import { SkillIcon } from "@/components/skill-icon";
import { Category } from "@/modules/categories/category.types";
import { Skill } from "@/modules/skills/skill.types";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const project: ProjectWithRelations | null = await projectService.getProjectBySlug(slug);

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
    const project: ProjectWithRelations | null = await projectService.getProjectBySlug(slug);

    if (!project) {
        notFound();
    }

    return (
        <main className="min-h-screen pt-24 pb-16">
            <div className="container mx-auto px-4 max-w-4xl">
                <Link
                    href="/projects"
                    className="inline-flex items-center text-foreground-muted hover:text-primary mb-8 transition-colors"
                >
                    <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 19l-7-7m0 0l7-7m-7 7h18"
                        />
                    </svg>
                    Back to Projects
                </Link>
                <div className="grid grid-cols-1 lg:grid-cols-[2fr,1fr] gap-12">
                    {/* Main Content */}
                    <div className="space-y-8">
                        {/* Header */}
                        <div>
                            <h1 className="text-4xl font-bold mb-4 gradient-text">{project.title}</h1>
                            <div className="flex flex-wrap gap-2 mb-6">
                                {project.categories.map((cat: Category) => (
                                    <span
                                        key={cat.id}
                                        className="text-sm px-3 py-1 rounded-full bg-background-secondary text-foreground-muted"
                                    >
                                        {cat.name}
                                    </span>
                                ))}
                            </div>
                            <p className="text-xl text-foreground-muted leading-relaxed">
                                {project.shortDescription}
                            </p>
                        </div>

                        {/* Thumbnail */}
                        {project.thumbnailUrl && (
                            <div className="aspect-video relative rounded-2xl overflow-hidden shadow-2xl border border-white/5">
                                <img
                                    src={project.thumbnailUrl}
                                    alt={project.title}
                                    className="object-cover w-full h-full"
                                />
                            </div>
                        )}

                        {/* Description */}
                        <div>
                            <h2 className="text-2xl font-bold mb-4 text-primary">About the Project</h2>
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                components={{
                                    h1: ({ node, ...props }) => <h1 className="text-3xl font-bold border-b border-border pb-2 mb-4 mt-6" {...props} />,
                                    h2: ({ node, ...props }) => <h2 className="text-2xl font-semibold border-b border-border pb-2 mb-4 mt-6" {...props} />,
                                    h3: ({ node, ...props }) => <h3 className="text-xl font-semibold mb-2 mt-4" {...props} />,
                                    ul: ({ node, ...props }) => <ul className="list-disc pl-6 mb-4 space-y-1" {...props} />,
                                    ol: ({ node, ...props }) => <ol className="list-decimal pl-6 mb-4 space-y-1" {...props} />,
                                    li: ({ node, ...props }) => <li className="mb-1" {...props} />,
                                    blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-primary/50 pl-4 py-1 italic text-foreground-muted bg-background-secondary/30 rounded-r my-4" {...props} />,
                                    code: ({ node, className, children, ...props }: any) => {
                                        const match = /language-(\w+)/.exec(className || '')
                                        const isInline = !match && !String(children).includes('\n')
                                        return isInline ? (
                                            <code className="bg-background-secondary px-1.5 py-0.5 rounded text-sm text-accent font-mono" {...props}>
                                                {children}
                                            </code>
                                        ) : (
                                            <div className="bg-[#0d1117] rounded-md overflow-hidden my-4 border border-border/50">
                                                <div className="flex items-center justify-between px-4 py-2 bg-background-secondary border-b border-border/50 text-xs text-foreground-muted font-mono">
                                                    <span>{match?.[1] || 'text'}</span>
                                                </div>
                                                <code className={`block p-4 overflow-x-auto text-sm font-mono ${className || ''}`} {...props}>
                                                    {children}
                                                </code>
                                            </div>
                                        )
                                    },
                                    table: ({ node, ...props }) => <div className="overflow-x-auto my-6 border border-border rounded-lg"><table className="w-full text-left text-sm" {...props} /></div>,
                                    thead: ({ node, ...props }) => <thead className="bg-background-secondary text-foreground font-semibold border-b border-border" {...props} />,
                                    tbody: ({ node, ...props }) => <tbody className="divide-y divide-border" {...props} />,
                                    tr: ({ node, ...props }) => <tr className="hover:bg-background-secondary/50 transition-colors" {...props} />,
                                    th: ({ node, ...props }) => <th className="px-4 py-3" {...props} />,
                                    td: ({ node, ...props }) => <td className="px-4 py-3" {...props} />,
                                    a: ({ node, ...props }) => (
                                        <a {...props} className="text-primary hover:text-primary-hover underline decoration-primary/30 hover:decoration-primary/100 transition-all" target="_blank" rel="noopener noreferrer" />
                                    ),
                                    p: ({ node, ...props }) => <p className="mb-4 leading-7" {...props} />,
                                    img: ({ node, ...props }) => <img className="rounded-lg border border-border shadow-md my-6 max-h-[500px] object-contain" {...props} />,
                                }}
                            >
                                {project.fullDescription}
                            </ReactMarkdown>
                        </div>

                        {/* Buttons */}
                        <div className="flex flex-wrap gap-4 pt-4">
                            {project.githubUrl && (
                                <a
                                    href={project.githubUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn-secondary"
                                >
                                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                    </svg>
                                    View Code
                                </a>
                            )}
                            {project.docsUrl && (
                                <a
                                    href={project.docsUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn-secondary"
                                >
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    Read Docs
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

                    {/* Sidebar */}
                    <div className="space-y-8">
                        {/* Languages */}
                        {project.skills.some((s: Skill) => s.type === "LANGUAGE") && (
                            <div className="card">
                                <h3 className="font-semibold mb-4">Languages</h3>
                                <div className="flex flex-wrap gap-2">
                                    {project.skills
                                        .filter((s: Skill) => s.type === "LANGUAGE")
                                        .map((skill: Skill) => (
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

                        {/* Technologies Grouped by Category */}
                        {(() => {
                            // Get all unique categories from non-language skills
                            const techSkills = project.skills.filter((s: Skill) => s.type !== "LANGUAGE");

                            if (techSkills.length === 0) return null;

                            // Group skills by categoryId
                            const skillsByCategory = techSkills.reduce((acc: Record<string, Skill[]>, skill: Skill) => {
                                const catId = skill.categoryId || "other";
                                if (!acc[catId]) acc[catId] = [];
                                acc[catId].push(skill);
                                return acc;
                            }, {} as Record<string, Skill[]>);

                            // Helper to get category name
                            const getCategoryName = (catId: string) => {
                                if (catId === "other") return "Other";
                                const cat = project.categories.find((c: Category) => c.id === catId);
                                return cat ? cat.name : "Other";
                            };

                            return Object.entries(skillsByCategory).map(([catId, skills]) => {
                                const categoryName = getCategoryName(catId);

                                return (
                                    <div key={catId} className="card">
                                        <h3 className="font-semibold mb-4">{categoryName}</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {skills.map((skill: Skill) => (
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
                                );
                            });
                        })()}
                    </div>
                </div>
                <section className="mt-12 text-center">
                    <Link href="/projects" className="btn-ghost">
                        ← Back to All Projects
                    </Link>
                </section>
            </div>

            {/* Footer */}
            <footer className="py-8 border-t border-border">
                <div className="container-custom text-center text-foreground-subtle">
                    <p>© {new Date().getFullYear()} Arpit Sharma. All rights reserved.</p>
                </div>
            </footer>
        </main>
    );
}
