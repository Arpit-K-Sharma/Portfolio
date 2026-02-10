import { contactRepository } from "./contact.repository";
import type { ContactMessageInsert } from "./contact.types";

export const contactService = {
    async getAllMessages() {
        return contactRepository.getAll();
    },

    async getUnreadCount() {
        return contactRepository.getUnreadCount();
    },

    async sendMessage(data: ContactMessageInsert) {
        return contactRepository.create(data);
    },

    async markAsRead(id: string) {
        return contactRepository.markAsRead(id);
    },

    async deleteMessage(id: string) {
        return contactRepository.delete(id);
    },
};
