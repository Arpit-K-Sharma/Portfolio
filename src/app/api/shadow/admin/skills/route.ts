import { NextResponse } from "next/server";
import { skillService } from "@/modules/skills";
import { requireAdminApi } from "@/lib/admin-middleware";
import { revalidatePath } from "next/cache";

export async function GET() {
    const error = await requireAdminApi();
    if (error) return error;

    try {
        const skills = await skillService.getAllSkills();
        return NextResponse.json(skills);
    } catch (err) {
        console.error("Error fetching skills:", err);
        return NextResponse.json({ error: "Failed to fetch skills" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const error = await requireAdminApi();
    if (error) return error;

    try {
        const body = await request.json();
        const skill = await skillService.createSkill(body);

        // Clear cache for homepage where skills are listed
        revalidatePath("/");

        return NextResponse.json(skill, { status: 201 });
    } catch (err) {
        console.error("Error creating skill:", err);
        return NextResponse.json({ error: "Failed to create skill" }, { status: 500 });
    }
}
