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

    // Parse initial state from URL
    const initialSearch = searchParams.get("search") || "";
    const initialCategories = searchParams.get("categories")
        ? searchParams.get("categories")!.split(",").filter(Boolean)
        : [];
    const initialSkills = searchParams.get("skills")
        ? searchParams.get("skills")!.split(",").filter(Boolean)
        : [];

    const [search, setSearch] = useState(initialSearch);
    const [selectedCategories, setSelectedCategories] = useState<string[]>(initialCategories);
    const [selectedSkills, setSelectedSkills] = useState<string[]>(initialSkills);
    const [showAllSkills, setShowAllSkills] = useState(false);

    // Sort skills alphabetically
    const sortedSkills = [...skills].sort((a, b) => a.name.localeCompare(b.name));

    const languages = sortedSkills.filter(s => s.type === "LANGUAGE");
    const technologies = sortedSkills.filter(s => s.type === "TECHNOLOGY");

    // Combine for display, preserving sections if desired, or just list all sorted
    // The requirement was "make the filtered skills appear alphabetically"
    const allSkills = [...languages, ...technologies];

    const VISIBLE_SKILL_COUNT = 10;
    const hasHiddenSkills = allSkills.length > VISIBLE_SKILL_COUNT;
    const visibleSkills = showAllSkills ? allSkills : allSkills.slice(0, VISIBLE_SKILL_COUNT);

    const updateFilters = useCallback((newFilters: { search: string; categories: string[]; skills: string[] }) => {
        const params = new URLSearchParams();

        if (newFilters.search) params.set("search", newFilters.search);

        if (newFilters.categories.length > 0) {
            params.set("categories", newFilters.categories.join(","));
        }

        if (newFilters.skills.length > 0) {
            params.set("skills", newFilters.skills.join(","));
        }

        router.replace(`/projects?${params.toString()}`, { scroll: false });
    }, [router]);

    // Debounced search
    useEffect(() => {
        const timer = setTimeout(() => {
            updateFilters({
                search,
                categories: selectedCategories,
                skills: selectedSkills
            });
        }, 150); // Reduced from 400ms for snappier response
        return () => clearTimeout(timer);
    }, [search, selectedCategories, selectedSkills]); // Dependencies for search debounce only, but here we include all to keep state synced

    const toggleCategory = (slug: string) => {
        setSelectedCategories(prev => {
            const newCats = prev.includes(slug)
                ? prev.filter(c => c !== slug)
                : [...prev, slug];
            return newCats;
        });
        // Effect will handle update
    };

    const toggleSkill = (slug: string) => {
        setSelectedSkills(prev => {
            const newSkills = prev.includes(slug)
                ? prev.filter(s => s !== slug)
                : [...prev, slug];
            return newSkills;
        });
        // Effect will handle update
    };

    const clearAll = () => {
        setSearch("");
        setSelectedCategories([]);
        setSelectedSkills([]);
        // Effect will handle update
    };

    const hasFilters = search || selectedCategories.length > 0 || selectedSkills.length > 0;

    return (
        <div className="w-full max-w-5xl mx-auto mb-10 space-y-8">
            {/* Search Bar & Categories */}
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">

                {/* Search - Redesigned to be cleaner/subtler */}
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
                                {s.type === "LANGUAGE" && !s.iconUrl && (
                                    <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? "bg-primary" : "bg-blue-400/60"}`} />
                                )}
                            </button>
                        );
                    })}

                    {hasHiddenSkills && !showAllSkills && (
                        <button
                            onClick={() => setShowAllSkills(true)}
                            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white/[0.03] border border-dashed border-white/[0.1] text-foreground-muted hover:text-foreground hover:border-white/[0.15] hover:bg-white/[0.05] transition-all"
                        >
                            +{allSkills.length - VISIBLE_SKILL_COUNT} more
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

            {/* Active Filters Summary - Only show if very relevant/needed, user wanted cleaner UI so maybe redundant if chips show state clearly. Keeping separate "Clear" button above. */}
        </div>
    );
}
