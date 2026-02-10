import { db } from "@/db/client";
import { skills } from "@/db/schema";
import { eq } from "drizzle-orm";
import type { SkillInsert, SkillUpdate } from "./skill.types";
import slugify from "slugify";

export const skillRepository = {
    /**
     * Get all skills
     */
    async getAll() {
        return db.select().from(skills).orderBy(skills.name);
    },

    /**
     * Get skill by ID
     */
    async getById(id: string) {
        const result = await db.select().from(skills).where(eq(skills.id, id));
        return result[0] ?? null;
    },

    /**
     * Get skill by slug
     */
    async getBySlug(slug: string) {
        const result = await db.select().from(skills).where(eq(skills.slug, slug));
        return result[0] ?? null;
    },

    /**
     * Create a new skill
     */
    async create(data: SkillInsert) {
        const slug = slugify(data.name, { lower: true, strict: true });
        const result = await db
            .insert(skills)
            .values({ ...data, slug })
            .returning();
        return result[0];
    },

    /**
     * Update a skill
     */
    async update(id: string, data: SkillUpdate) {
        const updateData: SkillUpdate & { slug?: string } = { ...data };
        if (data.name) {
            updateData.slug = slugify(data.name, { lower: true, strict: true });
        }
        const result = await db
            .update(skills)
            .set(updateData)
            .where(eq(skills.id, id))
            .returning();
        return result[0] ?? null;
    },

    /**
     * Delete a skill
     */
    async delete(id: string) {
        await db.delete(skills).where(eq(skills.id, id));
    },
};
