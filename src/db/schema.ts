import { pgTable, text, timestamp, boolean, uuid, integer } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ======================
// Profile Table (Single Row)
// ======================
export const profile = pgTable("profile", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    title: text("title").notNull(), // e.g., "Blockchain & Full-Stack Developer"
    bio: text("bio").notNull(),
    avatarUrl: text("avatar_url"),
    githubUrl: text("github_url"),
    linkedinUrl: text("linkedin_url"),
    twitterUrl: text("twitter_url"),
    cvUrl: text("cv_url"), // Link to download CV PDF
    cvViewUrl: text("cv_view_url"), // Link to view CV online
    email: text("email"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ======================
// Categories Table
// ======================
export const categories = pgTable("categories", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull().unique(),
    slug: text("slug").notNull().unique(),
    description: text("description"),
    isVisible: boolean("is_visible").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ======================
// Skills Table
// ======================
export const skills = pgTable("skills", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull().unique(),
    slug: text("slug").notNull().unique(),
    type: text("type").notNull().default("TECHNOLOGY"), // 'LANGUAGE' | 'TECHNOLOGY'
    iconUrl: text("icon_url"), // Optional skill icon
    categoryId: uuid("category_id").references(() => categories.id), // Link to category
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ======================
// Projects Table
// ======================
export const projects = pgTable("projects", {
    id: uuid("id").primaryKey().defaultRandom(),
    title: text("title").notNull(),
    slug: text("slug").notNull().unique(),
    shortDescription: text("short_description").notNull(), // For cards (2 lines)
    fullDescription: text("full_description").notNull(), // For detail page
    thumbnailUrl: text("thumbnail_url"),
    githubUrl: text("github_url"),
    demoUrl: text("demo_url"),
    docsUrl: text("docs_url"),
    youtubeUrl: text("youtube_url"),
    isFeatured: boolean("is_featured").default(false).notNull(),
    displayOrder: integer("display_order").default(0).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ======================
// Project-Skills Junction (Many-to-Many)
// ======================
export const projectSkills = pgTable("project_skills", {
    id: uuid("id").primaryKey().defaultRandom(),
    projectId: uuid("project_id")
        .notNull()
        .references(() => projects.id, { onDelete: "cascade" }),
    skillId: uuid("skill_id")
        .notNull()
        .references(() => skills.id, { onDelete: "cascade" }),
});

// ======================
// Project-Categories Junction (Many-to-Many)
// ======================
export const projectCategories = pgTable("project_categories", {
    id: uuid("id").primaryKey().defaultRandom(),
    projectId: uuid("project_id")
        .notNull()
        .references(() => projects.id, { onDelete: "cascade" }),
    categoryId: uuid("category_id")
        .notNull()
        .references(() => categories.id, { onDelete: "cascade" }),
});

// ======================
// Contact Messages Table
// ======================
export const contactMessages = pgTable("contact_messages", {
    id: uuid("id").primaryKey().defaultRandom(),
    senderName: text("sender_name").notNull(),
    senderEmail: text("sender_email").notNull(), // From Google OAuth - you can reply
    message: text("message").notNull(),
    isRead: boolean("is_read").default(false).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ======================
// Settings Table
// ======================
export const settings = pgTable("settings", {
    id: uuid("id").primaryKey().defaultRandom(),
    key: text("key").notNull().unique(),
    value: text("value").notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ======================
// Relations
// ======================
export const projectsRelations = relations(projects, ({ many }) => ({
    projectSkills: many(projectSkills),
    projectCategories: many(projectCategories),
}));

export const skillsRelations = relations(skills, ({ one, many }) => ({
    projectSkills: many(projectSkills),
    category: one(categories, {
        fields: [skills.categoryId],
        references: [categories.id],
    }),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
    projectCategories: many(projectCategories),
}));

export const projectSkillsRelations = relations(projectSkills, ({ one }) => ({
    project: one(projects, {
        fields: [projectSkills.projectId],
        references: [projects.id],
    }),
    skill: one(skills, {
        fields: [projectSkills.skillId],
        references: [skills.id],
    }),
}));

export const projectCategoriesRelations = relations(projectCategories, ({ one }) => ({
    project: one(projects, {
        fields: [projectCategories.projectId],
        references: [projects.id],
    }),
    category: one(categories, {
        fields: [projectCategories.categoryId],
        references: [categories.id],
    }),
}));
