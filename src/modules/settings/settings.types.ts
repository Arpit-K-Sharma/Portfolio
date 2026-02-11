export interface Setting {
    id: string;
    key: string;
    value: string;
    updatedAt: Date;
}

export type SettingInsert = Omit<Setting, "id" | "updatedAt">;
export type SettingUpdate = Partial<SettingInsert>;
