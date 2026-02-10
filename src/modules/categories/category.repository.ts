import { db } from "@/db/client";
import { categories } from "@/db/schema";
import { eq } from "drizzle-orm";
import type { CategoryInsert, CategoryUpdate } from "./category.types";
import slugify from "slugify";

export const categoryRepository = {
    async getAll() {
        return db.select().from(categories).orderBy(categories.name);
    },

    async getAllVisible() {
        return db.select().from(categories).where(eq(categories.isVisible, true)).orderBy(categories.name);
    },

    async getById(id: string) {
        const result = await db.select().from(categories).where(eq(categories.id, id));
        return result[0] ?? null;
    },

    async getBySlug(slug: string) {
        const result = await db.select().from(categories).where(eq(categories.slug, slug));
        return result[0] ?? null;
    },

    async create(data: CategoryInsert) {
        const slug = slugify(data.name, { lower: true, strict: true });
        const result = await db
            .insert(categories)
            .values({ ...data, slug })
            .returning();
        return result[0];
    },

    async update(id: string, data: CategoryUpdate) {
        const updateData: CategoryUpdate & { slug?: string } = { ...data };
        if (data.name) {
            updateData.slug = slugify(data.name, { lower: true, strict: true });
        }
        const result = await db
            .update(categories)
            .set(updateData)
            .where(eq(categories.id, id))
            .returning();
        return result[0] ?? null;
    },

    async delete(id: string) {
        await db.delete(categories).where(eq(categories.id, id));
    },
};
