import type { Skill } from "../skills/skill.types";
import type { Category } from "../categories/category.types";

// Project types
export interface Project {
    id: string;
    title: string;
    slug: string;
    shortDescription: string;
    fullDescription: string;
    thumbnailUrl: string | null;
    githubUrl: string | null;
    demoUrl: string | null;
    docsUrl: string | null;
    youtubeUrl: string | null;
    isFeatured: boolean;
    displayOrder: number;
    createdAt: Date;
    updatedAt: Date;
}

// Project with relations for display
export interface ProjectWithRelations extends Project {
    skills: Skill[];
    categories: Category[];
}

export type ProjectInsert = Omit<Project, "id" | "createdAt" | "updatedAt" | "slug"> & {
    skillIds?: string[];
    categoryIds?: string[];
};

export type ProjectUpdate = Partial<Omit<ProjectInsert, "skillIds" | "categoryIds">> & {
    skillIds?: string[];
    categoryIds?: string[];
};
