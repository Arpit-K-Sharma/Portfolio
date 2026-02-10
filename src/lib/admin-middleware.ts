import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";

/**
 * Middleware helper to check admin access
 * Returns error response if not admin, null if authorized
 */
export async function requireAdminApi(): Promise<NextResponse | null> {
    const isAdminUser = await isAdmin();

    if (!isAdminUser) {
        return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 }
        );
    }

    return null;
}
