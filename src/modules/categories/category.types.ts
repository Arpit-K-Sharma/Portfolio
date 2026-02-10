// Category types
export interface Category {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    isVisible: boolean;
    createdAt: Date;
}

export type CategoryInsert = Omit<Category, "id" | "createdAt" | "slug">;
export type CategoryUpdate = Partial<CategoryInsert>;
