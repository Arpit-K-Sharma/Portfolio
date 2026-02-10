import { NextResponse } from "next/server";
import { profileService } from "@/modules/profile";

// Disable caching - revalidate on every request
export const revalidate = 0;

export async function GET() {
    try {
        const profile = await profileService.getProfile();

        if (!profile) {
            return NextResponse.json(
                { error: "Profile not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(profile);
    } catch (error) {
        console.error("Error fetching profile:", error);
        return NextResponse.json(
            { error: "Failed to fetch profile" },
            { status: 500 }
        );
    }
}
