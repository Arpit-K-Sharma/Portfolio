"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
    type: string;
    iconUrl: string | null;
}

interface ProjectSearchFiltersProps {
    categories: Category[];
    skills: Skill[];
}

export function ProjectSearchFilters({ categories, skills }: ProjectSearchFiltersProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const initialSearch = searchParams.get("search") || "";
    const initialCategory = searchParams.get("category") || "";
    const initialSkill = searchParams.get("skill") || "";

    const [search, setSearch] = useState(initialSearch);
    const [category, setCategory] = useState(initialCategory);
    const [skill, setSkill] = useState(initialSkill);
    const [showAllSkills, setShowAllSkills] = useState(false);

    const languages = skills.filter(s => s.type === "LANGUAGE");
    const technologies = skills.filter(s => s.type === "TECHNOLOGY");
    const VISIBLE_SKILL_COUNT = 8;
    const hasHiddenSkills = languages.length + technologies.length > VISIBLE_SKILL_COUNT;

    const updateFilters = useCallback((newFilters: { search: string; category: string; skill: string }) => {
        const params = new URLSearchParams();
        if (newFilters.search) params.set("search", newFilters.search);
        if (newFilters.category) params.set("category", newFilters.category);
        if (newFilters.skill) params.set("skill", newFilters.skill);
        router.replace(`/projects?${params.toString()}`, { scroll: false });
    }, [router]);

    // Debounced search
    useEffect(() => {
        const timer = setTimeout(() => {
            updateFilters({ search, category, skill });
        }, 400);
        return () => clearTimeout(timer);
    }, [search]);

    const toggleCategory = (slug: string) => {
        const newCat = category === slug ? "" : slug;
        setCategory(newCat);
        updateFilters({ search, category: newCat, skill });
    };

    const toggleSkill = (slug: string) => {
        const newSkill = skill === slug ? "" : slug;
        setSkill(newSkill);
        updateFilters({ search, category, skill: newSkill });
    };

    const clearAll = () => {
        setSearch("");
        setCategory("");
        setSkill("");
        updateFilters({ search: "", category: "", skill: "" });
    };

    const hasFilters = search || category || skill;

    // Decide which skills to show
    const allSkills = [...languages, ...technologies];
    const visibleSkills = showAllSkills ? allSkills : allSkills.slice(0, VISIBLE_SKILL_COUNT);

    return (
        <div className="w-full max-w-5xl mx-auto mb-8 space-y-5">
            {/* Search Bar */}
            <div className="relative">
                <input
                    type="text"
                    placeholder="Search projects by name or description..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-11 pr-10 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-foreground placeholder:text-foreground-muted/60 focus:bg-white/[0.06] focus:border-primary/40 focus:ring-1 focus:ring-primary/30 outline-none transition-all text-sm"
                />
                <svg className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-foreground-muted/60 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                {search && (
                    <button
                        onClick={() => setSearch("")}
                        className="absolute right-3 top-3 p-0.5 rounded-md hover:bg-white/10 text-foreground-muted hover:text-foreground transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                )}
            </div>

            {/* Category Tabs */}
            <div className="flex flex-wrap gap-2">
                <button
                    onClick={() => { setCategory(""); updateFilters({ search, category: "", skill }); }}
                    className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 border ${!category
                            ? "bg-primary/15 text-primary border-primary/25"
                            : "bg-white/[0.03] border-white/[0.06] text-foreground-muted hover:bg-white/[0.06] hover:text-foreground"
                        }`}
                >
                    All
                </button>
                {categories.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => toggleCategory(cat.slug)}
                        className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 border ${category === cat.slug
                                ? "bg-primary/15 text-primary border-primary/25"
                                : "bg-white/[0.03] border-white/[0.06] text-foreground-muted hover:bg-white/[0.06] hover:text-foreground"
                            }`}
                    >
                        {cat.name}
                    </button>
                ))}
            </div>

            {/* Tech & Language Chips */}
            <div className="space-y-3">
                <div className="flex items-center gap-2">
                    <span className="text-[11px] font-medium uppercase tracking-wider text-foreground-muted/50">Filter by tech</span>
                    <div className="flex-1 h-px bg-white/[0.05]" />
                    {hasFilters && (
                        <button onClick={clearAll} className="text-[11px] text-foreground-muted/50 hover:text-foreground transition-colors">
                            Clear all
                        </button>
                    )}
                </div>
                <div className="flex flex-wrap gap-2">
                    {visibleSkills.map((s) => (
                        <button
                            key={s.id}
                            onClick={() => toggleSkill(s.slug)}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 border ${skill === s.slug
                                    ? "bg-primary/15 text-primary border-primary/25 shadow-sm shadow-primary/10"
                                    : "bg-white/[0.03] border-white/[0.06] text-foreground-muted hover:bg-white/[0.06] hover:text-foreground hover:border-white/10"
                                }`}
                        >
                            {s.iconUrl && <SkillIcon icon={s.iconUrl} alt={s.name} className="w-3.5 h-3.5" />}
                            {s.name}
                            {s.type === "LANGUAGE" && (
                                <span className={`w-1.5 h-1.5 rounded-full ${skill === s.slug ? "bg-primary" : "bg-blue-400/40"}`} />
                            )}
                        </button>
                    ))}
                    {hasHiddenSkills && !showAllSkills && (
                        <button
                            onClick={() => setShowAllSkills(true)}
                            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white/[0.02] border border-dashed border-white/[0.08] text-foreground-muted/60 hover:text-foreground-muted hover:border-white/10 transition-all"
                        >
                            +{allSkills.length - VISIBLE_SKILL_COUNT} more
                        </button>
                    )}
                    {showAllSkills && hasHiddenSkills && (
                        <button
                            onClick={() => setShowAllSkills(false)}
                            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white/[0.02] border border-dashed border-white/[0.08] text-foreground-muted/60 hover:text-foreground-muted hover:border-white/10 transition-all"
                        >
                            Show less
                        </button>
                    )}
                </div>
            </div>

            {/* Active Filters Summary */}
            {hasFilters && (
                <div className="flex items-center gap-2 pt-1 text-xs text-foreground-muted/50">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                    </svg>
                    <span>
                        Filtering
                        {search && <> by &quot;{search}&quot;</>}
                        {category && <> in {categories.find(c => c.slug === category)?.name}</>}
                        {skill && <> with {skills.find(s => s.slug === skill)?.name}</>}
                    </span>
                </div>
            )}
        </div>
    );
}
