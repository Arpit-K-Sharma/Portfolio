import { profileRepository } from "./profile.repository";
import type { ProfileInsert, ProfileUpdate } from "./profile.types";

export const profileService = {
    /**
     * Get the public profile
     */
    async getProfile() {
        return profileRepository.get();
    },

    /**
     * Create or update the profile (admin only)
     */
    async upsertProfile(data: ProfileInsert) {
        return profileRepository.upsert(data);
    },

    /**
     * Update specific profile fields (admin only)
     */
    async updateProfile(id: string, data: ProfileUpdate) {
        return profileRepository.update(id, data);
    },
};
