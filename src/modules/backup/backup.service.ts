import { db } from "@/db/client";
import {
    profile,
    categories,
    skills,
    projects,
    projectSkills,
    projectCategories
} from "@/db/schema";
import { sql } from "drizzle-orm";

// Backup data structure
export interface BackupData {
    exportedAt: string;
    version: "1.0";
    profile: typeof profile.$inferSelect | null;
    categories: (typeof categories.$inferSelect)[];
    skills: (typeof skills.$inferSelect)[];
    projects: (typeof projects.$inferSelect)[];
    projectSkills: { projectId: string; skillId: string }[];
    projectCategories: { projectId: string; categoryId: string }[];
}

export const backupService = {
    /**
     * Export all portfolio data as JSON
     */
    async exportData(): Promise<BackupData> {
        const [profileData] = await db.select().from(profile).limit(1);
        const categoriesData = await db.select().from(categories);
        const skillsData = await db.select().from(skills);
        const projectsData = await db.select().from(projects);
        const projectSkillsData = await db
            .select({ projectId: projectSkills.projectId, skillId: projectSkills.skillId })
            .from(projectSkills);
        const projectCategoriesData = await db
            .select({ projectId: projectCategories.projectId, categoryId: projectCategories.categoryId })
            .from(projectCategories);

        return {
            exportedAt: new Date().toISOString(),
            version: "1.0",
            profile: profileData ?? null,
            categories: categoriesData,
            skills: skillsData,
            projects: projectsData,
            projectSkills: projectSkillsData,
            projectCategories: projectCategoriesData,
        };
    },

    /**
     * Import portfolio data from JSON backup
     * Warning: This clears existing data!
     */
    async importData(data: BackupData): Promise<{ success: boolean; message: string }> {
        try {
            // Validate version
            if (data.version !== "1.0") {
                return { success: false, message: "Unsupported backup version" };
            }

            // Clear existing data (in correct order due to foreign keys)
            await db.delete(projectSkills);
            await db.delete(projectCategories);
            await db.delete(projects);
            await db.delete(skills);
            await db.delete(categories);
            await db.delete(profile);

            // Import profile
            if (data.profile) {
                await db.insert(profile).values(data.profile);
            }

            // Import categories
            if (data.categories.length > 0) {
                await db.insert(categories).values(data.categories);
            }

            // Import skills
            if (data.skills.length > 0) {
                await db.insert(skills).values(data.skills);
            }

            // Import projects
            if (data.projects.length > 0) {
                await db.insert(projects).values(data.projects);
            }

            // Import project-skill relations
            if (data.projectSkills.length > 0) {
                await db.insert(projectSkills).values(
                    data.projectSkills.map(ps => ({
                        projectId: ps.projectId,
                        skillId: ps.skillId,
                    }))
                );
            }

            // Import project-category relations
            if (data.projectCategories.length > 0) {
                await db.insert(projectCategories).values(
                    data.projectCategories.map(pc => ({
                        projectId: pc.projectId,
                        categoryId: pc.categoryId,
                    }))
                );
            }

            return {
                success: true,
                message: `Successfully restored: ${data.projects.length} projects, ${data.skills.length} skills, ${data.categories.length} categories`
            };
        } catch (error) {
            console.error("Import error:", error);
            return {
                success: false,
                message: error instanceof Error ? error.message : "Unknown error during import"
            };
        }
    },
};
