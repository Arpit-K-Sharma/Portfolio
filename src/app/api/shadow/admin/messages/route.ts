import { NextResponse } from "next/server";
import { contactService } from "@/modules/contact";
import { requireAdminApi } from "@/lib/admin-middleware";

export async function GET() {
    const error = await requireAdminApi();
    if (error) return error;

    try {
        const messages = await contactService.getAllMessages();
        const unreadCount = await contactService.getUnreadCount();
        return NextResponse.json({ messages, unreadCount });
    } catch (err) {
        console.error("Error fetching messages:", err);
        return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
    }
}
