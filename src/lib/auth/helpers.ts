import { auth } from "./auth";
import { redirect } from "next/navigation";

/**
 * Check if the current user is the admin
 * Uses Google sub ID comparison (not email)
 */
export async function isAdmin(): Promise<boolean> {
    const session = await auth();
    return session?.user?.isAdmin ?? false;
}

/**
 * Protect admin routes - redirects if not admin
 */
export async function requireAdmin(): Promise<void> {
    const session = await auth();

    if (!session?.user) {
        redirect("/auth/signin?callbackUrl=/shadow/admin");
    }

    if (!session.user.isAdmin) {
        // Not admin - redirect to home, don't reveal admin route exists
        redirect("/");
    }
}

/**
 * Get current session (for pages that need user info)
 */
export async function getSession() {
    return await auth();
}
