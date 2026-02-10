// Contact message types
export interface ContactMessage {
    id: string;
    senderName: string;
    senderEmail: string;
    message: string;
    isRead: boolean;
    createdAt: Date;
}

export type ContactMessageInsert = Pick<ContactMessage, "senderName" | "senderEmail" | "message">;
