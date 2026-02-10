import { NextResponse } from "next/server";
import { skillService } from "@/modules/skills";
import { requireAdminApi } from "@/lib/admin-middleware";
import { revalidatePath } from "next/cache";

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const error = await requireAdminApi();
    if (error) return error;

    try {
        const { id } = await params;
        const body = await request.json();
        const skill = await skillService.updateSkill(id, body);

        // Clear cache
        revalidatePath("/");

        return NextResponse.json(skill);
    } catch (err) {
        console.error("Error updating skill:", err);
        return NextResponse.json({ error: "Failed to update skill" }, { status: 500 });
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
        await skillService.deleteSkill(id);

        // Clear cache
        revalidatePath("/");

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error("Error deleting skill:", err);
        return NextResponse.json({ error: "Failed to delete skill" }, { status: 500 });
    }
}
