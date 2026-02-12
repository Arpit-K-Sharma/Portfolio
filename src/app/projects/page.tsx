import { Metadata } from "next";
import { projectService } from "@/modules/projects";
import { categoryService } from "@/modules/categories";
import { skillService } from "@/modules/skills";
import { settingsService } from "@/modules/settings";
import { profileService } from "@/modules/profile";
import { ProjectsClientWrapper } from "@/components/projects-client-wrapper";

export async function generateMetadata(): Promise<Metadata> {
    const profile = await profileService.getProfile();
    const name = profile?.name || "Portfolio";

    return {
        title: `Projects | ${name}`,
        description: "Explore my portfolio of blockchain and full-stack development projects.",
    };
}

export default async function ProjectsPage() {
    // Fetch settings
    const enableSearchFilters = await settingsService.isSearchFiltersEnabled();

    // Fetch ALL data (client-side filtering for instant response!
    const projects = await projectService.getAllProjects();
    const categories = await categoryService.getAllVisibleCategories();
    const skills = await skillService.getAllSkills() as Array<{
        id: string;
        name: string;
        slug: string;
        type: "LANGUAGE" | "TECHNOLOGY";
        iconUrl: string | null;
    }>;

    return (
        <ProjectsClientWrapper
            allProjects={projects}
            categories={categories}
            skills={skills}
            enableSearchFilters={enableSearchFilters}
        />
    );
}
