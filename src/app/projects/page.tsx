import Link from "next/link";
import { Suspense } from "react";
import { Metadata } from "next";
import { projectService } from "@/modules/projects";
import { categoryService } from "@/modules/categories";
import { skillService } from "@/modules/skills";
import { settingsService } from "@/modules/settings";
import { profileService } from "@/modules/profile";
import { SkillIcon } from "@/components/skill-icon";
import { ProjectSearchFilters } from "@/components/project-search-filters";

export async function generateMetadata(): Promise<Metadata> {
    const profile = await profileService.getProfile();
    const name = profile?.name || "Portfolio";

    return {
        title: `Projects | ${name}`,
        description: "Explore my portfolio of blockchain and full-stack development projects.",
    };
}

export default async function ProjectsPage({
    searchParams,
}: {
    searchParams: { search?: string; categories?: string; skills?: string };
}) {
    const search = searchParams.search || "";
    const categorySlugs = searchParams.categories?.split(",").filter(Boolean) || [];
    const skillSlugs = searchParams.skills?.split(",").filter(Boolean) || [];

    // Fetch settings
    const enableSearchFilters = await settingsService.isSearchFiltersEnabled();

    // Fetch data
    const projects = await projectService.getAllProjects({
        search,
        categorySlugs,
        skillSlugs,
    });
    const categories = await categoryService.getAllVisibleCategories();
    const skills = await skillService.getAllSkills();

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
            {enableSearchFilters && (
                <section className="pb-8">
                    <div className="container-custom">
                        <Suspense fallback={<div className="h-20 animate-pulse bg-white/5 rounded-xl max-w-5xl mx-auto" />}>
                            <ProjectSearchFilters categories={categories} skills={skills} />
                        </Suspense>
                    </div>
                </section>
            )}

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
                                    className={`glass-card group block animate-in delay-${Math.min((i + 1) * 100, 700)} hover:border-primary/30 transition-all duration-300`}
                                >
                                    {/* Thumbnail */}
                                    <div className="aspect-video bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl mb-5 overflow-hidden relative">
                                        {project.thumbnailUrl ? (
                                            <img
                                                src={project.thumbnailUrl}
                                                alt={project.title}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <span className="text-5xl opacity-20 group-hover:opacity-30 transition-opacity">🚀</span>
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-center pb-6">
                                            <span className="text-sm font-semibold text-primary flex items-center gap-2">
                                                View Details
                                                <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                                </svg>
                                            </span>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors duration-300">
                                        {project.title}
                                    </h3>
                                    <p className="text-foreground-muted text-sm mb-4 line-clamp-2 leading-relaxed">
                                        {project.shortDescription}
                                    </p>

                                    {/* Categories */}
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {project.categories.map((cat) => (
                                            <span key={cat.id} className="badge text-xs bg-primary/10 text-primary border-primary/20">{cat.name}</span>
                                        ))}
                                    </div>

                                    {/* Skills - Icon Only */}
                                    <div className="flex items-center gap-1.5 pt-4 border-t border-white/[0.08]">
                                        {project.skills.slice(0, 8).map((skill) => (
                                            <div
                                                key={skill.id}
                                                title={skill.name}
                                                className="w-8 h-8 rounded-lg bg-white/[0.08] hover:bg-white/[0.15] border border-white/[0.1] hover:border-primary/40 flex items-center justify-center transition-all duration-200 hover:scale-110 cursor-help group/skill"
                                            >
                                                <SkillIcon icon={skill.iconUrl} alt={skill.name} className="w-4.5 h-4.5 opacity-90 group-hover/skill:opacity-100" />
                                            </div>
                                        ))}
                                        {project.skills.length > 8 && (
                                            <div
                                                title={`${project.skills.length - 8} more skills`}
                                                className="w-8 h-8 rounded-lg bg-white/[0.06] border border-white/[0.08] flex items-center justify-center text-[10px] font-semibold text-foreground-muted cursor-help"
                                            >
                                                +{project.skills.length - 8}
                                            </div>
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
