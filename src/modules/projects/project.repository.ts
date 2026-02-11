import { db } from "@/db/client";
import { projects, projectSkills, projectCategories, skills, categories } from "@/db/schema";
import { eq, desc, inArray, and, sql } from "drizzle-orm";
import type { ProjectInsert, ProjectUpdate, ProjectWithRelations } from "./project.types";
import slugify from "slugify";

export const projectRepository = {
    /**
     * Get all projects with their relations
     */
    async getAll(): Promise<ProjectWithRelations[]> {
        const allProjects = await db
            .select()
            .from(projects)
            .orderBy(desc(projects.isFeatured), projects.displayOrder);

        return this.attachRelations(allProjects);
    },

    /**
     * Get featured projects
     */
    async getFeatured(): Promise<ProjectWithRelations[]> {
        const featuredProjects = await db
            .select()
            .from(projects)
            .where(eq(projects.isFeatured, true))
            .orderBy(projects.displayOrder)
            .limit(3);

        return this.attachRelations(featuredProjects);
    },

    /**
     * Get project by ID
     */
    async getById(id: string): Promise<ProjectWithRelations | null> {
        const result = await db.select().from(projects).where(eq(projects.id, id));
        if (!result[0]) return null;
        const [withRelations] = await this.attachRelations([result[0]]);
        return withRelations;
    },

    /**
     * Get project by slug
     */
    async getBySlug(slug: string): Promise<ProjectWithRelations | null> {
        const result = await db.select().from(projects).where(eq(projects.slug, slug));
        if (!result[0]) return null;
        const [withRelations] = await this.attachRelations([result[0]]);
        return withRelations;
    },

    /**
     * Get projects by category slug
     */
    async getByCategory(categorySlug: string): Promise<ProjectWithRelations[]> {
        const category = await db
            .select()
            .from(categories)
            .where(eq(categories.slug, categorySlug))
            .limit(1);

        if (!category[0]) return [];

        const projectIds = await db
            .select({ projectId: projectCategories.projectId })
            .from(projectCategories)
            .where(eq(projectCategories.categoryId, category[0].id));

        if (projectIds.length === 0) return [];

        const projectResults = await db
            .select()
            .from(projects)
            .where(inArray(projects.id, projectIds.map(p => p.projectId)))
            .orderBy(projects.displayOrder);

        return this.attachRelations(projectResults);
    },

    /**
     * Create a new project
     */
    async create(data: ProjectInsert) {
        return await db.transaction(async (tx) => {
            const { skillIds, categoryIds, ...projectData } = data;

            // Handle Featured Logic Limit
            if (projectData.isFeatured) {
                const featuredCount = await tx
                    .select({ count: sql<number>`count(*)` })
                    .from(projects)
                    .where(eq(projects.isFeatured, true));

                if (Number(featuredCount[0].count) >= 6) {
                    throw new Error("Cannot add more than 6 featured projects. Please unfeature a project first.");
                }
            }

            const slug = slugify(projectData.title, { lower: true, strict: true });

            const result = await tx
                .insert(projects)
                .values({ ...projectData, slug })
                .returning();

            const project = result[0];

            // Add skill relations
            if (skillIds && skillIds.length > 0) {
                await tx.insert(projectSkills).values(
                    skillIds.map(skillId => ({ projectId: project.id, skillId }))
                );
            }

            // Add category relations
            if (categoryIds && categoryIds.length > 0) {
                await tx.insert(projectCategories).values(
                    categoryIds.map(categoryId => ({ projectId: project.id, categoryId }))
                );
            }

            return this.getById(project.id);
        });
    },

    /**
     * Update a project
     */
    async update(id: string, data: ProjectUpdate) {
        return await db.transaction(async (tx) => {
            const { skillIds, categoryIds, ...projectData } = data;

            // Get current state
            const currentProject = await tx.select().from(projects).where(eq(projects.id, id)).then(res => res[0]);
            if (!currentProject) throw new Error("Project not found");

            const updateData: typeof projectData & { slug?: string; updatedAt: Date } = {
                ...projectData,
                updatedAt: new Date(),
            };

            // Limit Check if becoming featured
            if (projectData.isFeatured === true && !currentProject.isFeatured) {
                const featuredCount = await tx
                    .select({ count: sql<number>`count(*)` })
                    .from(projects)
                    .where(eq(projects.isFeatured, true));

                if (Number(featuredCount[0].count) >= 6) {
                    throw new Error("Cannot add more than 6 featured projects. Please unfeature a project first.");
                }
            }

            // Swap Logic
            if (
                projectData.displayOrder !== undefined &&
                projectData.displayOrder !== currentProject.displayOrder
            ) {
                const existing = await tx
                    .select()
                    .from(projects)
                    .where(eq(projects.displayOrder, projectData.displayOrder));

                if (existing.length > 0) {
                    const otherProject = existing[0];
                    if (otherProject.id !== id) {
                        // Swap: Set other project to MY old order
                        await tx
                            .update(projects)
                            .set({
                                displayOrder: currentProject.displayOrder, // Take my old spot
                                updatedAt: new Date()
                            })
                            .where(eq(projects.id, otherProject.id));
                    }
                }
            }

            if (projectData.title) {
                updateData.slug = slugify(projectData.title, { lower: true, strict: true });
            }

            await tx.update(projects).set(updateData).where(eq(projects.id, id));

            // Update skill relations if provided
            if (skillIds !== undefined) {
                await tx.delete(projectSkills).where(eq(projectSkills.projectId, id));
                if (skillIds.length > 0) {
                    await tx.insert(projectSkills).values(
                        skillIds.map(skillId => ({ projectId: id, skillId }))
                    );
                }
            }

            // Update category relations if provided
            if (categoryIds !== undefined) {
                await tx.delete(projectCategories).where(eq(projectCategories.projectId, id));
                if (categoryIds.length > 0) {
                    await tx.insert(projectCategories).values(
                        categoryIds.map(categoryId => ({ projectId: id, categoryId }))
                    );
                }
            }

            return this.getById(id);
        });
    },

    /**
     * Delete a project
     */
    async delete(id: string) {
        // Relations are deleted automatically due to cascade
        await db.delete(projects).where(eq(projects.id, id));
    },

    /**
     * Helper: Attach skills and categories to projects
     */
    async attachRelations(projectList: typeof projects.$inferSelect[]): Promise<ProjectWithRelations[]> {
        if (projectList.length === 0) return [];

        const projectIds = projectList.map(p => p.id);

        // Get all skill relations
        const skillRelations = await db
            .select({
                projectId: projectSkills.projectId,
                skill: skills,
            })
            .from(projectSkills)
            .innerJoin(skills, eq(projectSkills.skillId, skills.id))
            .where(inArray(projectSkills.projectId, projectIds));

        // Get all category relations
        const categoryRelations = await db
            .select({
                projectId: projectCategories.projectId,
                category: categories,
            })
            .from(projectCategories)
            .innerJoin(categories, eq(projectCategories.categoryId, categories.id))
            .where(inArray(projectCategories.projectId, projectIds));

        // Map relations to projects
        return projectList.map(project => ({
            ...project,
            skills: skillRelations
                .filter(r => r.projectId === project.id)
                .map(r => ({
                    ...r.skill,
                    type: r.skill.type as "LANGUAGE" | "TECHNOLOGY",
                })),
            categories: categoryRelations
                .filter(r => r.projectId === project.id)
                .map(r => r.category),
        }));
    },
};
