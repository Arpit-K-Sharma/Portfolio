import { NextResponse } from "next/server";
import { contactService } from "@/modules/contact";
import { auth } from "@/lib/auth";

export async function POST(request: Request) {
    try {
        // Require authentication to send message
        const session = await auth();

        if (!session?.user) {
            return NextResponse.json(
                { error: "You must be signed in to send a message" },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { message } = body;

        if (!message || typeof message !== "string" || message.trim().length === 0) {
            return NextResponse.json(
                { error: "Message is required" },
                { status: 400 }
            );
        }

        // Use the authenticated user's info
        const contactMessage = await contactService.sendMessage({
            senderName: session.user.name || "Anonymous",
            senderEmail: session.user.email || "",
            message: message.trim(),
        });

        return NextResponse.json({
            success: true,
            message: "Message sent successfully",
            id: contactMessage.id,
        });
    } catch (error) {
        console.error("Error sending message:", error);
        return NextResponse.json(
            { error: "Failed to send message" },
            { status: 500 }
        );
    }
}
