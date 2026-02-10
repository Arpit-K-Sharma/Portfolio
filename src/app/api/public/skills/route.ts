import { NextResponse } from "next/server";
import { skillService } from "@/modules/skills";

// Disable caching - revalidate on every request
export const revalidate = 0;

export async function GET() {
    try {
        const skills = await skillService.getAllSkills();
        return NextResponse.json(skills);
    } catch (error) {
        console.error("Error fetching skills:", error);
        return NextResponse.json(
            { error: "Failed to fetch skills" },
            { status: 500 }
        );
    }
}
