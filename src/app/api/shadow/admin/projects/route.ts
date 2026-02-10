import { NextResponse } from "next/server";
import { projectService } from "@/modules/projects";
import { requireAdminApi } from "@/lib/admin-middleware";
import { revalidatePath } from "next/cache";

export async function GET() {
    const error = await requireAdminApi();
    if (error) return error;

    try {
        const projects = await projectService.getAllProjects();
        return NextResponse.json(projects);
    } catch (err) {
        console.error("Error fetching projects:", err);
        return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const error = await requireAdminApi();
    if (error) return error;

    try {
        const body = await request.json();
        const project = await projectService.createProject(body);

        // Clear cache for projects page and homepage
        revalidatePath("/projects");
        revalidatePath("/");

        return NextResponse.json(project, { status: 201 });
    } catch (err) {
        console.error("Error creating project:", err);
        return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
    }
}
