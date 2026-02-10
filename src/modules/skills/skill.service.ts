import { skillRepository } from "./skill.repository";
import type { SkillInsert, SkillUpdate } from "./skill.types";

export const skillService = {
    async getAllSkills() {
        return skillRepository.getAll();
    },

    async getSkillById(id: string) {
        return skillRepository.getById(id);
    },

    async getSkillBySlug(slug: string) {
        return skillRepository.getBySlug(slug);
    },

    async createSkill(data: SkillInsert) {
        return skillRepository.create(data);
    },

    async updateSkill(id: string, data: SkillUpdate) {
        return skillRepository.update(id, data);
    },

    async deleteSkill(id: string) {
        return skillRepository.delete(id);
    },
};
