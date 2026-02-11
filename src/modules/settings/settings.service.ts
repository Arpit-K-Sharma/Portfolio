import { settingsRepository } from "./settings.repository";

export const settingsService = {
    async getSetting(key: string, defaultValue: string = "") {
        const setting = await settingsRepository.getByKey(key);
        return setting?.value || defaultValue;
    },

    async setSetting(key: string, value: string) {
        return settingsRepository.upsert(key, value);
    },

    async getAllSettings() {
        return settingsRepository.getAll();
    },

    // Helper methods for specific settings
    async isSearchFiltersEnabled() {
        const value = await this.getSetting("enableSearchFilters", "true");
        return value === "true";
    },

    async setSearchFiltersEnabled(enabled: boolean) {
        return this.setSetting("enableSearchFilters", enabled.toString());
    },
};
