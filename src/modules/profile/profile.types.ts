// Profile types
export interface Profile {
    id: string;
    name: string;
    title: string;
    bio: string;
    avatarUrl: string | null;
    githubUrl: string | null;
    linkedinUrl: string | null;
    twitterUrl: string | null;
    cvUrl: string | null;
    cvViewUrl: string | null;
    email: string | null;
    createdAt: Date;
    updatedAt: Date;
}

export type ProfileInsert = Omit<Profile, "id" | "createdAt" | "updatedAt">;
export type ProfileUpdate = Partial<ProfileInsert>;
