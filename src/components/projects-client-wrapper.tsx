"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { SkillIcon } from "@/components/skill-icon";

interface Category {
    id: string;
    name: string;
    slug: string;
}

interface Skill {
    id: string;
    name: string;
    slug: string;
    type: "LANGUAGE" | "TECHNOLOGY";
    iconUrl: string | null;
}

interface Project {
    id: string;
    title: string;
    slug: string;
    shortDescription: string;
    thumbnailUrl: string | null;
    categories: Category[];
    skills: Skill[];
}

interface ProjectsClientWrapperProps {
    allProjects: Project[];
    categories: Category[];
    skills: Skill[];
    enableSearchFilters: boolean;
}

export function ProjectsClientWrapper({
    allProjects,
    categories,
    skills,
    enableSearchFilters,
}: ProjectsClientWrapperProps) {
    // Local state - NO URL updates for instant performance!
    const [search, setSearch] = useState("");
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
    const [showAllSkills, setShowAllSkills] = useState(false);

    // Sort skills alphabetically
    const sortedSkills = useMemo(() => {
        const languages = skills.filter(s => s.type === "LANGUAGE");
        const technologies = skills.filter(s => s.type === "TECHNOLOGY");
        return [...languages, ...technologies].sort((a, b) => a.name.localeCompare(b.name));
    }, [skills]);

    const VISIBLE_SKILL_COUNT = 10;
    const hasHiddenSkills = sortedSkills.length > VISIBLE_SKILL_COUNT;
    const visibleSkills = showAllSkills ? sortedSkills : sortedSkills.slice(0, VISIBLE_SKILL_COUNT);

    // Instant client-side filtering - no server calls, no URL updates!
    const filteredProjects = useMemo(() => {
        return allProjects.filter((project) => {
            // Search filter
            if (search) {
                const searchLower = search.toLowerCase();
                const matchesSearch =
                    project.title.toLowerCase().includes(searchLower) ||
                    project.shortDescription.toLowerCase().includes(searchLower);
                if (!matchesSearch) return false;
            }

            // Category filter (OR logic)
            if (selectedCategories.length > 0) {
                const hasCategory = project.categories.some((cat) =>
                    selectedCategories.includes(cat.slug)
                );
                if (!hasCategory) return false;
            }

            // Skill filter (AND logic)
            if (selectedSkills.length > 0) {
                const projectSkillSlugs = project.skills.map((s) => s.slug);
                const hasAllSkills = selectedSkills.every((skillSlug) =>
                    projectSkillSlugs.includes(skillSlug)
                );
                if (!hasAllSkills) return false;
            }

            return true;
        });
    }, [allProjects, search, selectedCategories, selectedSkills]);

    const toggleCategory = (slug: string) => {
        setSelectedCategories(prev =>
            prev.includes(slug) ? prev.filter(c => c !== slug) : [...prev, slug]
        );
    };

    const toggleSkill = (slug: string) => {
        setSelectedSkills(prev =>
            prev.includes(slug) ? prev.filter(s => s !== slug) : [...prev, slug]
        );
    };

    const clearAll = () => {
        setSearch("");
        setSelectedCategories([]);
        setSelectedSkills([]);
    };

    const hasFilters = search || selectedCategories.length > 0 || selectedSkills.length > 0;

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
                    <div className="container-custom max-w-[1400px]">
                        <div className="w-full max-w-5xl mx-auto mb-10 space-y-8">
                            {/* Search Bar & Categories */}
                            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
                                {/* Search */}
                                <div className="w-full md:max-w-xs relative group">
                                    <input
                                        type="text"
                                        placeholder="Search projects..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white/[0.05] border border-white/[0.1] text-foreground placeholder:text-foreground-muted focus:bg-white/[0.08] focus:border-primary/40 focus:ring-1 focus:ring-primary/20 outline-none transition-all text-sm"
                                    />
                                    <svg className="absolute left-3.5 top-3 w-4 h-4 text-foreground-muted group-focus-within:text-primary/80 transition-colors pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                    {search && (
                                        <button
                                            onClick={() => setSearch("")}
                                            className="absolute right-2 top-2 p-1 rounded-md hover:bg-white/10 text-foreground-muted hover:text-foreground transition-colors"
                                        >
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    )}
                                </div>

                                {/* Categories */}
                                <div className="flex flex-wrap gap-2 w-full md:w-auto md:justify-end">
                                    <button
                                        onClick={() => setSelectedCategories([])}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 border ${selectedCategories.length === 0
                                            ? "bg-white/[0.1] text-foreground border-white/[0.15] shadow-sm"
                                            : "bg-transparent border-transparent text-foreground-muted hover:text-foreground hover:bg-white/[0.05]"
                                            }`}
                                    >
                                        All
                                    </button>
                                    {categories.map((cat) => {
                                        const isSelected = selectedCategories.includes(cat.slug);
                                        return (
                                            <button
                                                key={cat.id}
                                                onClick={() => toggleCategory(cat.slug)}
                                                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 border ${isSelected
                                                    ? "bg-primary/20 text-primary-light border-primary/30 shadow-sm shadow-primary/10"
                                                    : "bg-white/[0.05] border-white/[0.1] text-foreground-muted hover:bg-white/[0.08] hover:text-foreground hover:border-white/[0.15]"
                                                    }`}
                                            >
                                                {cat.name}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Tech & Language Chips */}
                            <div className="space-y-3 pt-2 border-t border-white/[0.08]">
                                <div className="flex items-center justify-between">
                                    <span className="text-[11px] font-medium uppercase tracking-wider text-foreground-muted">Filter by tech</span>
                                    {hasFilters && (
                                        <button
                                            onClick={clearAll}
                                            className="text-[11px] font-medium text-red-400 hover:text-red-300 transition-colors flex items-center gap-1"
                                        >
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                            Clear filters
                                        </button>
                                    )}
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    {visibleSkills.map((s) => {
                                        const isSelected = selectedSkills.includes(s.slug);
                                        return (
                                            <button
                                                key={s.id}
                                                onClick={() => toggleSkill(s.slug)}
                                                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 border ${isSelected
                                                    ? "bg-primary/20 text-primary-light border-primary/30 shadow-sm shadow-primary/10"
                                                    : "bg-white/[0.05] border-white/[0.08] text-foreground-muted hover:bg-white/[0.08] hover:text-foreground hover:border-white/[0.15]"
                                                    }`}
                                            >
                                                {s.iconUrl && <SkillIcon icon={s.iconUrl} alt={s.name} className="w-3.5 h-3.5 opacity-90" />}
                                                {s.name}
                                            </button>
                                        );
                                    })}

                                    {hasHiddenSkills && !showAllSkills && (
                                        <button
                                            onClick={() => setShowAllSkills(true)}
                                            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white/[0.03] border border-dashed border-white/[0.1] text-foreground-muted hover:text-foreground hover:border-white/[0.15] hover:bg-white/[0.05] transition-all"
                                        >
                                            +{sortedSkills.length - VISIBLE_SKILL_COUNT} more
                                        </button>
                                    )}

                                    {showAllSkills && hasHiddenSkills && (
                                        <button
                                            onClick={() => setShowAllSkills(false)}
                                            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white/[0.03] border border-dashed border-white/[0.1] text-foreground-muted hover:text-foreground hover:border-white/[0.15] hover:bg-white/[0.05] transition-all"
                                        >
                                            Show less
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Projects Grid */}
            <section className="pb-20">
                <div className="container-custom max-w-[1400px]">
                    {filteredProjects.length === 0 ? (
                        <div className="text-center py-20">
                            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center">
                                <span className="text-3xl opacity-50">📂</span>
                            </div>
                            <p className="text-foreground-muted text-lg">No projects found matching your filters.</p>
                            {hasFilters && (
                                <button onClick={clearAll} className="btn-ghost mt-4 inline-flex">
                                    Clear filters
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredProjects.map((project, i) => (
                                <Link
                                    key={project.id}
                                    href={`/projects/${project.slug}`}
                                    className={`glass-card group flex flex-col h-full animate-in delay-${Math.min((i + 1) * 100, 700)} hover:border-primary/30 transition-all duration-300`}
                                >
                                    {/* Thumbnail */}
                                    <div className="aspect-video bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl mb-5 overflow-hidden relative shrink-0">
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
                                    <div className="flex-1 flex flex-col">
                                        <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors duration-300">
                                            {project.title}
                                        </h3>
                                        <p className="text-foreground-muted text-sm mb-4 line-clamp-2 leading-relaxed">
                                            {project.shortDescription}
                                        </p>

                                        {/* Categories */}
                                        <div className="flex flex-wrap gap-2 mb-4 mt-auto">
                                            {project.categories.slice(0, 2).map((cat) => (
                                                <span key={cat.id} className="badge text-xs bg-primary/10 text-primary border-primary/20">{cat.name}</span>
                                            ))}
                                            {project.categories.length > 2 && (
                                                <span className="badge text-xs bg-primary/5 text-primary/70 border-primary/10 cursor-help" title={`${project.categories.length - 2} more categories`}>
                                                    +{project.categories.length - 2}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Skills */}
                                    <div className="flex flex-wrap gap-2 pt-4 border-t border-white/[0.08] mt-4">
                                        {project.skills.slice(0, 5).map((skill) => (
                                            <div
                                                key={skill.id}
                                                title={skill.name}
                                                className="w-8 h-8 rounded-lg bg-white/[0.08] hover:bg-white/[0.15] border border-white/[0.1] hover:border-primary/40 flex items-center justify-center transition-all duration-200 hover:scale-110 cursor-help group/skill"
                                            >
                                                <SkillIcon icon={skill.iconUrl} alt={skill.name} className="w-4.5 h-4.5 opacity-90 group-hover/skill:opacity-100" />
                                            </div>
                                        ))}
                                        {project.skills.length > 5 && (
                                            <div
                                                title={`${project.skills.length - 5} more skills`}
                                                className="w-8 h-8 rounded-lg bg-white/[0.06] border border-white/[0.08] flex items-center justify-center text-[10px] font-semibold text-foreground-muted cursor-help"
                                            >
                                                +{project.skills.length - 5}
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
