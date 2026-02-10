import Link from "next/link";
import { profileService } from "@/modules/profile";
import { projectService } from "@/modules/projects";
import { skillService } from "@/modules/skills";
import { categoryService } from "@/modules/categories";
import { SkillIcon } from "@/components/skill-icon";

export const metadata = {
    title: "Arpit Sharma | Portfolio",
    description: "Full-stack developer portfolio showcasing projects and skills.",
};

export default async function HomePage() {
    // Fetch data in parallel
    const [profile, featuredProjects, skills, categories] = await Promise.all([
        profileService.getProfile(),
        projectService.getFeaturedProjects(),
        skillService.getAllSkills(),
        categoryService.getAllCategories(),
    ]);

    // Group skills by category
    const skillsByCategory: Record<string, typeof skills> = {};

    // Sort categories logic if needed, but array order is fine
    categories.forEach((cat) => {
        const catSkills = skills.filter((s: any) => s.categoryId === cat.id);
        if (catSkills.length > 0) {
            skillsByCategory[cat.name] = catSkills;
        }
    });

    // Handle uncategorized skills
    const uncategorizedSkills = skills.filter((s: any) => !s.categoryId);
    if (uncategorizedSkills.length > 0) {
        skillsByCategory["Other"] = uncategorizedSkills;
    }

    // Fallback if no profile exists yet
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
            {/* Hero Section */}
            <section className="section min-h-screen flex items-center justify-center">
                <div className="container-custom text-center">
                    <div className="animate-in">
                        {/* Avatar */}
                        {profile.avatarUrl ? (
                            <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary to-accent p-1">
                                <img
                                    src={profile.avatarUrl}
                                    alt={profile.name}
                                    className="w-full h-full rounded-full object-cover bg-background-secondary"
                                />
                            </div>
                        ) : (
                            <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary to-accent p-1">
                                <div className="w-full h-full rounded-full bg-background-secondary flex items-center justify-center">
                                    <span className="text-4xl">👨‍💻</span>
                                </div>
                            </div>
                        )}

                        <h1 className="text-4xl md:text-6xl font-bold mb-4">
                            <span className="gradient-text">{profile.name}</span>
                        </h1>

                        <p className="text-xl md:text-2xl text-foreground-muted mb-6">
                            {profile.title}
                        </p>

                        <p className="max-w-2xl mx-auto text-foreground-subtle mb-8 whitespace-pre-wrap">
                            {profile.bio}
                        </p>

                        {/* Social Links */}
                        <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
                            {profile.githubUrl && (
                                <a
                                    href={profile.githubUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn-secondary"
                                >
                                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                                    </svg>
                                    GitHub
                                </a>
                            )}
                            {profile.linkedinUrl && (
                                <a
                                    href={profile.linkedinUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn-secondary"
                                >
                                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                    </svg>
                                    LinkedIn
                                </a>
                            )}
                            {profile.twitterUrl && (
                                <a
                                    href={profile.twitterUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn-secondary"
                                >
                                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                                    </svg>
                                    Twitter
                                </a>
                            )}
                            {profile.cvUrl && (
                                <a
                                    href={profile.cvUrl}
                                    target="_blank"
                                    className="btn-primary"
                                >
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    Download CV
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Featured Projects Preview */}
                    <div className="animate-in delay-200">
                        <h2 className="text-2xl font-semibold mb-8">Featured Projects</h2>
                        {featuredProjects.length > 0 ? (
                            <div className="grid md:grid-cols-3 gap-6">
                                {featuredProjects.map((project) => (
                                    <Link key={project.id} href={`/projects/${project.slug}`} className="card-hover block text-left">
                                        <div className="h-40 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg mb-4 overflow-hidden">
                                            {project.thumbnailUrl ? (
                                                <img
                                                    src={project.thumbnailUrl}
                                                    alt={project.title}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-4xl">
                                                    💻
                                                </div>
                                            )}
                                        </div>
                                        <h3 className="text-lg font-semibold mb-2">{project.title}</h3>
                                        <p className="text-foreground-muted text-sm mb-3 line-clamp-2">
                                            {project.shortDescription}
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            <span className="badge text-xs">View Project</span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <p className="text-foreground-muted">No featured projects yet.</p>
                        )}
                        <Link href="/projects" className="btn-ghost mt-8 inline-flex">
                            View All Projects →
                        </Link>
                    </div>
                </div>
            </section>

            {/* Skills Section */}
            <section className="section bg-background-secondary">
                <div className="container-custom">
                    <div className="animate-in">
                        <h2 className="text-2xl font-semibold mb-12 text-center">Skills & Technologies</h2>

                        <div className="space-y-12">
                            {Object.entries(skillsByCategory).length > 0 ? (
                                Object.entries(skillsByCategory).map(([categoryName, categorySkills]) => (
                                    <div key={categoryName} className="text-center">
                                        <h3 className="text-foreground-muted uppercase tracking-wider text-sm font-semibold mb-6">
                                            {categoryName}
                                        </h3>
                                        <div className="flex flex-wrap justify-center gap-4">
                                            {categorySkills.map((skill) => (
                                                <span key={skill.id} className="badge px-4 py-2 flex items-center gap-2 bg-background border border-border">
                                                    <SkillIcon icon={skill.iconUrl} alt={skill.name} className="w-5 h-5" />
                                                    <span className="text-base">{skill.name}</span>
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center text-foreground-muted">No skills listed yet.</p>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact CTA */}
            <section className="section">
                <div className="container-custom text-center">
                    <div className="animate-in">
                        <h2 className="text-3xl font-bold mb-4">Let&apos;s Work Together</h2>
                        <p className="text-foreground-muted mb-8 max-w-lg mx-auto">
                            Have a project in mind? I&apos;d love to hear about it. Let&apos;s discuss how we can collaborate.
                        </p>
                        <Link href="/contact" className="btn-primary text-lg px-8 py-3">
                            Get in Touch
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-8 border-t border-border">
                <div className="container-custom text-center text-foreground-subtle">
                    <p>© {new Date().getFullYear()} {profile.name}. All rights reserved.</p>
                </div>
            </footer>
        </main>
    );
}
