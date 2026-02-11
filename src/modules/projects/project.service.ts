import { projectRepository } from "./project.repository";
import type { ProjectInsert, ProjectUpdate } from "./project.types";

export const projectService = {
    async getAllProjects(filters?: { search?: string; categorySlugs?: string[]; skillSlugs?: string[] }) {
        return projectRepository.getAll(filters);
    },

    async getFeaturedProjects() {
        return projectRepository.getFeatured();
    },

    async getProjectById(id: string) {
        return projectRepository.getById(id);
    },

    async getProjectBySlug(slug: string) {
        return projectRepository.getBySlug(slug);
    },

    async getProjectsByCategory(categorySlug: string) {
        return projectRepository.getByCategory(categorySlug);
    },

    async createProject(data: ProjectInsert) {
        return projectRepository.create(data);
    },

    async updateProject(id: string, data: ProjectUpdate) {
        return projectRepository.update(id, data);
    },

    async deleteProject(id: string) {
        return projectRepository.delete(id);
    },
};
