import { NextResponse } from "next/server";
import { projectService } from "@/modules/projects";

// Disable caching - revalidate on every request
export const revalidate = 0;

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const category = searchParams.get("category");
        const featured = searchParams.get("featured");

        let projects;

        if (featured === "true") {
            projects = await projectService.getFeaturedProjects();
        } else if (category) {
            projects = await projectService.getProjectsByCategory(category);
        } else {
            projects = await projectService.getAllProjects();
        }

        return NextResponse.json(projects);
    } catch (error) {
        console.error("Error fetching projects:", error);
        return NextResponse.json(
            { error: "Failed to fetch projects" },
            { status: 500 }
        );
    }
}
