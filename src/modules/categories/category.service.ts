import { categoryRepository } from "./category.repository";
import type { CategoryInsert, CategoryUpdate } from "./category.types";

export const categoryService = {
    async getAllCategories() {
        return categoryRepository.getAll();
    },

    async getAllVisibleCategories() {
        return categoryRepository.getAllVisible();
    },

    async getCategoryById(id: string) {
        return categoryRepository.getById(id);
    },

    async getCategoryBySlug(slug: string) {
        return categoryRepository.getBySlug(slug);
    },

    async createCategory(data: CategoryInsert) {
        return categoryRepository.create(data);
    },

    async updateCategory(id: string, data: CategoryUpdate) {
        return categoryRepository.update(id, data);
    },

    async deleteCategory(id: string) {
        return categoryRepository.delete(id);
    },
};
