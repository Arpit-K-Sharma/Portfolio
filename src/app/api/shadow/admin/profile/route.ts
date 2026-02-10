import { NextResponse } from "next/server";
import { profileService } from "@/modules/profile";
import { requireAdminApi } from "@/lib/admin-middleware";
import { revalidatePath } from "next/cache";

export async function GET() {
    const error = await requireAdminApi();
    if (error) return error;

    try {
        const profile = await profileService.getProfile();
        return NextResponse.json(profile);
    } catch (err) {
        console.error("Error fetching profile:", err);
        return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    const error = await requireAdminApi();
    if (error) return error;

    try {
        const body = await request.json();
        const profile = await profileService.upsertProfile(body);

        // Clear cache for homepage and profile API
        revalidatePath("/", "layout");

        return NextResponse.json(profile);
    } catch (err) {
        console.error("Error updating profile:", err);
        return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
    }
}
