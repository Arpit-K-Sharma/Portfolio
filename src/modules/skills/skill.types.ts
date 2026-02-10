// Skill types
export interface Skill {
    id: string;
    name: string;
    slug: string;
    type: "LANGUAGE" | "TECHNOLOGY";
    iconUrl: string | null;
    categoryId: string | null;
    createdAt: Date;
}

export type SkillInsert = Omit<Skill, "id" | "createdAt" | "slug">;
export type SkillUpdate = Partial<SkillInsert>;
