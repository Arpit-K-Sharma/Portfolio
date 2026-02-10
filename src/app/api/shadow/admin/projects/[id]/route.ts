import { NextResponse } from "next/server";
import { projectService } from "@/modules/projects";
import { requireAdminApi } from "@/lib/admin-middleware";
import { revalidatePath } from "next/cache";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const error = await requireAdminApi();
    if (error) return error;

    try {
        const { id } = await params;
        const project = await projectService.getProjectById(id);
        if (!project) {
            return NextResponse.json({ error: "Project not found" }, { status: 404 });
        }
        return NextResponse.json(project);
    } catch (err) {
        console.error("Error fetching project:", err);
        return NextResponse.json({ error: "Failed to fetch project" }, { status: 500 });
    }
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const error = await requireAdminApi();
    if (error) return error;

    try {
        const { id } = await params;
        const body = await request.json();
        const project = await projectService.updateProject(id, body);

        if (!project) {
            return NextResponse.json({ error: "Project not found" }, { status: 404 });
        }

        // Clear cache
        revalidatePath("/projects");
        revalidatePath("/");
        revalidatePath(`/projects/${project.slug}`);

        return NextResponse.json(project);
    } catch (err) {
        console.error("Error updating project:", err);
        return NextResponse.json({ error: "Failed to update project" }, { status: 500 });
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
        await projectService.deleteProject(id);

        // Clear cache
        revalidatePath("/projects");
        revalidatePath("/");

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error("Error deleting project:", err);
        return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
    }
}
