import { db } from "@/db/client";
import { contactMessages } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import type { ContactMessageInsert } from "./contact.types";

export const contactRepository = {
    /**
     * Get all messages (admin only)
     */
    async getAll() {
        return db
            .select()
            .from(contactMessages)
            .orderBy(desc(contactMessages.createdAt));
    },

    /**
     * Get unread messages count
     */
    async getUnreadCount() {
        const result = await db
            .select()
            .from(contactMessages)
            .where(eq(contactMessages.isRead, false));
        return result.length;
    },

    /**
     * Create a new message
     */
    async create(data: ContactMessageInsert) {
        const result = await db
            .insert(contactMessages)
            .values(data)
            .returning();
        return result[0];
    },

    /**
     * Mark message as read
     */
    async markAsRead(id: string) {
        const result = await db
            .update(contactMessages)
            .set({ isRead: true })
            .where(eq(contactMessages.id, id))
            .returning();
        return result[0] ?? null;
    },

    /**
     * Delete a message
     */
    async delete(id: string) {
        await db.delete(contactMessages).where(eq(contactMessages.id, id));
    },
};
