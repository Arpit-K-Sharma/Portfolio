"use client";

import { useState, useEffect } from "react";
import { SkillIcon } from "@/components/skill-icon";
import { useToast } from "@/components/ui/toast-context";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

interface Skill {
    id: string;
    name: string;
    slug: string;
    type: "LANGUAGE" | "TECHNOLOGY";
    iconUrl: string | null;
    categoryId: string | null;
}

interface Category {
    id: string;
    name: string;
}

export default function AdminSkillsPage() {
    const [skills, setSkills] = useState<Skill[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [form, setForm] = useState({ name: "", iconUrl: "", categoryId: "", type: "TECHNOLOGY" });
    const [editing, setEditing] = useState<Skill | null>(null);
    const [saving, setSaving] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
    const { showToast } = useToast();

    const fetchData = async () => {
        const [skillsRes, categoriesRes] = await Promise.all([
            fetch("/api/shadow/admin/skills").then((r) => r.json()),
            fetch("/api/shadow/admin/categories").then((r) => r.json()),
        ]);
        setSkills(skillsRes);
        setCategories(categoriesRes);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const url = editing
                ? `/api/shadow/admin/skills/${editing.id}`
                : "/api/shadow/admin/skills";
            const method = editing ? "PUT" : "POST";

            // If categoryId is empty string, make it null
            // Also ensure categoryId is null if type is LANGUAGE
            const payload = {
                ...form,
                categoryId: form.type === "LANGUAGE" ? null : (form.categoryId || null),
            };

            await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            await fetchData();
            setForm({ name: "", iconUrl: "", categoryId: "", type: "TECHNOLOGY" });
            setEditing(null);
            showToast(editing ? "Skill updated" : "Skill created", "success");
        } catch (error) {
            console.error(error);
            showToast("Failed to save skill", "error");
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (skill: Skill) => {
        setForm({
            name: skill.name,
            iconUrl: skill.iconUrl || "",
            categoryId: skill.categoryId || "",
            type: skill.type || "TECHNOLOGY",
        });
        setEditing(skill);
    };

    const handleDelete = async (id: string) => {
        try {
            await fetch(`/api/shadow/admin/skills/${id}`, { method: "DELETE" });
            await fetchData();
            showToast("Skill deleted", "success");
        } catch (error) {
            console.error(error);
            showToast("Failed to delete skill", "error");
        } finally {
            setDeleteTarget(null);
        }
    };

    const getCategoryName = (id: string | null) => {
        if (!id) return "Uncategorized";
        return categories.find((c) => c.id === id)?.name || "Unknown";
    };

    return (
        <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Skills & Technologies</h1>

            {/* Add/Edit Form */}
            <form onSubmit={handleSubmit} className="card p-6 md:p-8 mb-12 bg-card/30 border-white/5">
                <h2 className="text-xl font-bold mb-8 flex items-center gap-3">
                    <span className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                        </svg>
                    </span>
                    {editing ? "Edit Skill" : "Create New Skill"}
                </h2>

                <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="space-y-2 lg:col-span-1">
                            <label className="text-xs font-bold text-foreground-muted uppercase tracking-widest ml-1">
                                Skill Name
                            </label>
                            <input
                                type="text"
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                placeholder="e.g., React"
                                className="input w-full bg-neutral-900/50"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-foreground-muted uppercase tracking-widest ml-1">
                                Type
                            </label>
                            <select
                                value={form.type}
                                onChange={(e) => setForm({ ...form, type: e.target.value as any })}
                                className="input w-full bg-neutral-900/50"
                            >
                                <option value="TECHNOLOGY">Technology</option>
                                <option value="LANGUAGE">Language</option>
                            </select>
                        </div>
                        {form.type === "TECHNOLOGY" && (
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-foreground-muted uppercase tracking-widest ml-1">
                                    Category
                                </label>
                                <select
                                    value={form.categoryId}
                                    onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                                    className="input w-full bg-neutral-900/50 font-medium"
                                >
                                    <option value="">None (Uncategorized)</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}
                        <div className="space-y-2 lg:col-span-1">
                            <label className="text-xs font-bold text-foreground-muted uppercase tracking-widest ml-1">
                                Icon URL
                            </label>
                            <input
                                type="url"
                                value={form.iconUrl}
                                onChange={(e) => setForm({ ...form, iconUrl: e.target.value })}
                                placeholder="SVG or Image URL"
                                className="input w-full bg-neutral-900/50"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 pt-2 justify-end">
                        {editing && (
                            <button
                                type="button"
                                onClick={() => {
                                    setForm({ name: "", iconUrl: "", categoryId: "", type: "TECHNOLOGY" });
                                    setEditing(null);
                                }}
                                className="btn-secondary w-full sm:w-auto px-8"
                            >
                                Cancel
                            </button>
                        )}
                        <button type="submit" disabled={saving} className="btn-primary w-full sm:w-auto px-8">
                            {saving ? "Saving..." : editing ? "Update Skill" : "Add Skill"}
                        </button>
                    </div>
                </div>
            </form>

            <div className="flex items-center gap-3 mb-6">
                <h2 className="text-xl font-bold">All Skills</h2>
                <span className="px-2 py-0.5 rounded-lg bg-white/5 border border-white/10 text-[10px] font-bold text-foreground-muted uppercase tracking-widest">
                    {skills.length} Total
                </span>
            </div>

            {/* Skills List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {skills.map((skill) => (
                    <div key={skill.id} className="card p-4 group hover:border-primary/20 transition-all duration-300 flex items-center justify-between">
                        <div className="flex items-center gap-4 min-w-0">
                            <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center shrink-0">
                                <SkillIcon icon={skill.iconUrl} alt={skill.name} className="w-6 h-6" />
                            </div>
                            <div className="min-w-0">
                                <div className="font-bold truncate text-sm">
                                    {skill.name}
                                    {skill.type === "LANGUAGE" && (
                                        <span className="ml-2 text-[8px] bg-blue-500/10 text-blue-400 px-1.5 py-0.5 rounded border border-blue-500/20 uppercase tracking-tighter">
                                            Lang
                                        </span>
                                    )}
                                </div>
                                {skill.type !== "LANGUAGE" && (
                                    <p className="text-[10px] text-foreground-muted font-bold uppercase tracking-widest truncate mt-0.5">
                                        {getCategoryName(skill.categoryId)}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={() => handleEdit(skill)}
                                className="p-2 rounded-lg hover:bg-white/5 text-foreground-muted hover:text-white transition-all"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                            </button>
                            <button
                                onClick={() => setDeleteTarget(skill.id)}
                                className="p-2 rounded-lg hover:bg-red-500/10 text-foreground-muted hover:text-red-400 transition-all"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {skills.length === 0 && (
                <p className="text-center text-foreground-muted py-12">No skills yet. Add your first skill!</p>
            )}

            <ConfirmDialog
                open={!!deleteTarget}
                title="Delete Skill"
                message="Are you sure you want to delete this skill? Projects using it will lose this association."
                confirmLabel="Delete"
                cancelLabel="Cancel"
                variant="danger"
                onConfirm={() => deleteTarget && handleDelete(deleteTarget)}
                onCancel={() => setDeleteTarget(null)}
            />
        </div>
    );
}
