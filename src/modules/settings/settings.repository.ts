import { db } from "@/db/client";
import { settings } from "@/db/schema";
import { eq } from "drizzle-orm";
import type { SettingInsert } from "./settings.types";

export const settingsRepository = {
    async getByKey(key: string) {
        const result = await db.select().from(settings).where(eq(settings.key, key)).limit(1);
        return result[0] || null;
    },

    async getAll() {
        return db.select().from(settings);
    },

    async upsert(key: string, value: string) {
        const existing = await this.getByKey(key);

        if (existing) {
            return db
                .update(settings)
                .set({ value, updatedAt: new Date() })
                .where(eq(settings.key, key))
                .returning();
        } else {
            return db.insert(settings).values({ key, value }).returning();
        }
    },
};
