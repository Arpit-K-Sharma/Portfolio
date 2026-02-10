import { db } from "@/db/client";
import { profile } from "@/db/schema";
import { eq } from "drizzle-orm";
import type { ProfileInsert, ProfileUpdate } from "./profile.types";

export const profileRepository = {
    /**
     * Get the profile (single row)
     */
    async get() {
        const result = await db.select().from(profile).limit(1);
        return result[0] ?? null;
    },

    /**
     * Create or update the profile
     */
    async upsert(data: ProfileInsert) {
        const existing = await this.get();

        // Sanitize data -> remove id, createdAt, updatedAt if present
        // (even though ProfileInsert omits them, runtime object might have them)
        const { name, title, bio, avatarUrl, githubUrl, linkedinUrl, twitterUrl, cvUrl, cvViewUrl, email } = data as any;
        const cleanData = { name, title, bio, avatarUrl, githubUrl, linkedinUrl, twitterUrl, cvUrl, cvViewUrl, email };

        if (existing) {
            const result = await db
                .update(profile)
                .set({ ...cleanData, updatedAt: new Date() })
                .where(eq(profile.id, existing.id))
                .returning();
            return result[0];
        } else {
            const result = await db
                .insert(profile)
                .values(cleanData)
                .returning();
            return result[0];
        }
    },

    /**
     * Update the profile
     */
    async update(id: string, data: ProfileUpdate) {
        // Sanitize data
        const { name, title, bio, avatarUrl, githubUrl, linkedinUrl, twitterUrl, cvUrl, cvViewUrl, email } = data as any;
        // Only include defined fields
        const cleanData: any = {};
        if (name !== undefined) cleanData.name = name;
        if (title !== undefined) cleanData.title = title;
        if (bio !== undefined) cleanData.bio = bio;
        if (avatarUrl !== undefined) cleanData.avatarUrl = avatarUrl;
        if (githubUrl !== undefined) cleanData.githubUrl = githubUrl;
        if (linkedinUrl !== undefined) cleanData.linkedinUrl = linkedinUrl;
        if (twitterUrl !== undefined) cleanData.twitterUrl = twitterUrl;
        if (cvUrl !== undefined) cleanData.cvUrl = cvUrl;
        if (cvViewUrl !== undefined) cleanData.cvViewUrl = cvViewUrl;
        if (email !== undefined) cleanData.email = email;

        const result = await db
            .update(profile)
            .set({ ...cleanData, updatedAt: new Date() })
            .where(eq(profile.id, id))
            .returning();
        return result[0] ?? null;
    },
};
