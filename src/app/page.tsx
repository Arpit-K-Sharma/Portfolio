import Link from "next/link";
import { profileService } from "@/modules/profile";
import { projectService } from "@/modules/projects";
import { skillService } from "@/modules/skills";
import { categoryService } from "@/modules/categories";
import { SkillIcon } from "@/components/skill-icon";
import { Category } from "@/modules/categories/category.types";
import { Skill } from "@/modules/skills/skill.types";

export const metadata = {
    title: "Arpit Sharma | Portfolio",
    description: "Full-stack developer portfolio showcasing projects and skills.",
};

export default async function HomePage() {
    const [profile, featuredProjects, skills, categories] = await Promise.all([
        profileService.getProfile(),
        projectService.getFeaturedProjects(),
        skillService.getAllSkills(),
        categoryService.getAllCategories(),
    ]);

    // Group skills by category
    // Group skills by category
    const skillsByCategory: Record<string, Skill[]> = {};
    categories.forEach((cat: Category) => {
        const catSkills = skills.filter((s: Skill) => s.categoryId === cat.id);
        if (catSkills.length > 0) {
            skillsByCategory[cat.name] = catSkills;
        }
    });

    const uncategorizedSkills = skills.filter((s: Skill) => !s.categoryId);
    if (uncategorizedSkills.length > 0) {
        skillsByCategory["Other"] = uncategorizedSkills;
    }

    if (!profile) {
        return (
            <main className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Welcome</h1>
                    <p className="text-foreground-muted">Please configure your profile in the admin panel.</p>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen">
            {/* ═══════════ HERO ═══════════ */}
            <section className="relative min-h-screen flex items-center overflow-hidden pt-28 pb-16">
                {/* Background Effects */}
                <div className="absolute inset-0">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[128px] animate-pulse-slow" />
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-[128px] animate-pulse-slow delay-500" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[200px]" />
                </div>

                <div className="container-custom relative z-10">
                    <div className="flex flex-col md:flex-row items-center gap-16 md:gap-24">
                        {/* Left — Avatar */}
                        <div className="animate-in shrink-0">
                            <div className="relative w-64 h-64 md:w-80 md:h-80">
                                {/* Glow ring */}
                                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary via-accent to-primary opacity-50 blur-lg animate-pulse-slow" />
                                <div className="relative w-full h-full rounded-full bg-gradient-to-br from-primary to-accent p-[3px]">
                                    {profile.avatarUrl ? (
                                        <img
                                            src={profile.avatarUrl}
                                            alt={profile.name}
                                            className="w-full h-full rounded-full object-cover bg-background"
                                        />
                                    ) : (
                                        <div className="w-full h-full rounded-full bg-background flex items-center justify-center">
                                            <span className="text-6xl">👨‍💻</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Right — Info */}
                        <div className="text-center md:text-left">
                            <h1 className="text-5xl md:text-7xl font-extrabold mb-4 tracking-tight animate-in delay-100">
                                <span className="gradient-text animate-shimmer">{profile.name}</span>
                            </h1>

                            <p className="text-xl md:text-2xl text-foreground-muted mb-5 font-light animate-in delay-200">
                                {profile.title}
                            </p>

                            <p className="max-w-xl text-foreground-subtle mb-8 leading-relaxed whitespace-pre-wrap animate-in delay-300">
                                {profile.bio}
                            </p>

                            {/* Social + CV Links */}
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 animate-in delay-400">
                                {profile.githubUrl && (
                                    <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer"
                                        className="p-3 rounded-2xl bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] hover:border-white/[0.15] transition-all duration-300 group">
                                        <svg className="w-5 h-5 text-foreground-muted group-hover:text-foreground transition-colors" fill="currentColor" viewBox="0 0 24 24">
                                            <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                                        </svg>
                                    </a>
                                )}
                                {profile.linkedinUrl && (
                                    <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer"
                                        className="p-3 rounded-2xl bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] hover:border-white/[0.15] transition-all duration-300 group">
                                        <svg className="w-5 h-5 text-foreground-muted group-hover:text-foreground transition-colors" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                        </svg>
                                    </a>
                                )}
                                {profile.twitterUrl && (
                                    <a href={profile.twitterUrl} target="_blank" rel="noopener noreferrer"
                                        className="p-3 rounded-2xl bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] hover:border-white/[0.15] transition-all duration-300 group">
                                        <svg className="w-5 h-5 text-foreground-muted group-hover:text-foreground transition-colors" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                        </svg>
                                    </a>
                                )}

                                {/* CV Buttons */}
                                {profile.cvViewUrl && (
                                    <a href={profile.cvViewUrl} target="_blank" rel="noopener noreferrer"
                                        className="btn-secondary ml-1">
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                        View CV
                                    </a>
                                )}
                                {profile.cvUrl && (
                                    <a href={profile.cvUrl} download
                                        className="btn-primary">
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        Download CV
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══════════ FEATURED PROJECTS ═══════════ */}
            <section className="section relative">
                <div className="container-custom">
                    <div className="animate-in">
                        <h2 className="section-heading">
                            Featured <span className="gradient-text">Projects</span>
                        </h2>
                        <p className="section-subheading">
                            Handpicked work that showcases my expertise in blockchain, AI, and full-stack development.
                        </p>
                    </div>

                    {featuredProjects.length > 0 ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {featuredProjects.map((project, i) => (
                                <Link
                                    key={project.id}
                                    href={`/projects/${project.slug}`}
                                    className={`glass-card group block animate-in delay-${(i + 1) * 100}`}
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
                                        {/* Hover overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                                            <span className="text-sm font-medium text-primary">View Project →</span>
                                        </div>
                                    </div>

                                    <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors duration-300">
                                        {project.title}
                                    </h3>
                                    <p className="text-foreground-muted text-sm leading-relaxed line-clamp-2">
                                        {project.shortDescription}
                                    </p>

                                    {/* Categories */}
                                    <div className="flex flex-wrap gap-2 mt-4">
                                        {project.categories.slice(0, 2).map((cat) => (
                                            <span key={cat.id} className="badge text-xs">
                                                {cat.name}
                                            </span>
                                        ))}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-foreground-muted">No featured projects yet.</p>
                    )}

                    <div className="text-center mt-12">
                        <Link href="/projects" className="btn-secondary">
                            View All Projects
                            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </Link>
                    </div>
                </div>
            </section>

            {/* ═══════════ SKILLS ═══════════ */}
            <section className="section relative bg-background-secondary/30 overflow-hidden">
                {/* Decorative background */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
                <div className="absolute -top-32 -right-32 w-64 h-64 bg-primary/5 rounded-full blur-[100px]" />
                <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-accent/5 rounded-full blur-[100px]" />

                <div className="container-custom relative z-10">
                    <div className="animate-in">
                        <h2 className="section-heading">
                            Skills & <span className="gradient-text">Technologies</span>
                        </h2>
                        <p className="section-subheading">
                            Tools and technologies I use to bring ideas to life.
                        </p>
                    </div>

                    {Object.entries(skillsByCategory).length > 0 ? (
                        <div className="space-y-6">
                            {Object.entries(skillsByCategory).map(([categoryName, categorySkills], catIdx) => (
                                <div key={categoryName} className={`animate-in delay-${Math.min((catIdx + 1) * 100, 500)}`}>
                                    <h3 className="text-xs uppercase tracking-[0.2em] text-primary font-semibold mb-3 flex items-center gap-3">
                                        <span className="w-6 h-px bg-primary/40" />
                                        {categoryName}
                                        <span className="text-foreground-subtle font-normal">({categorySkills.length})</span>
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {categorySkills.map((skill) => (
                                            <div
                                                key={skill.id}
                                                className="group flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/[0.03] border border-white/[0.07] hover:bg-white/[0.08] hover:border-primary/30 transition-all duration-200 cursor-default"
                                            >
                                                <SkillIcon icon={skill.iconUrl} alt={skill.name} className="w-5 h-5 opacity-80 group-hover:opacity-100 transition-opacity" />
                                                <span className="text-sm text-foreground-muted group-hover:text-foreground transition-colors">
                                                    {skill.name}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-foreground-muted">No skills listed yet.</p>
                    )}
                </div>
            </section>

            {/* ═══════════ CONTACT CTA ═══════════ */}
            <section className="section relative overflow-hidden">
                {/* Background glow */}
                <div className="absolute inset-0">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-primary/10 rounded-full blur-[120px]" />
                </div>

                <div className="container-custom text-center relative z-10">
                    <div className="animate-in">
                        <h2 className="text-4xl md:text-5xl font-bold mb-5">
                            Let&apos;s Build Something <span className="gradient-text">Together</span>
                        </h2>
                        <p className="text-foreground-muted mb-10 max-w-lg mx-auto leading-relaxed">
                            Have a project in mind or just want to chat? I&apos;m always open to discussing new opportunities.
                        </p>
                        <Link href="/contact" className="btn-primary text-lg px-8 py-3.5">
                            Get in Touch
                            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}
