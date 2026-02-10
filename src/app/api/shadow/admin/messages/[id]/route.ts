import { NextResponse } from "next/server";
import { contactService } from "@/modules/contact";
import { requireAdminApi } from "@/lib/admin-middleware";

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const error = await requireAdminApi();
    if (error) return error;

    try {
        const { id } = await params;
        const message = await contactService.markAsRead(id);
        return NextResponse.json(message);
    } catch (err) {
        console.error("Error updating message:", err);
        return NextResponse.json({ error: "Failed to update message" }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const error = await requireAdminApi();
    if (error) return error;

    try {
        const { id } = await params;
        await contactService.deleteMessage(id);
        return NextResponse.json({ success: true });
    } catch (err) {
        console.error("Error deleting message:", err);
        return NextResponse.json({ error: "Failed to delete message" }, { status: 500 });
    }
}
