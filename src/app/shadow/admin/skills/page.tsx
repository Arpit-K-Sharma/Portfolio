"use client";

import { useState, useEffect } from "react";
import { SkillIcon } from "@/components/skill-icon";

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
        if (!confirm("Delete this skill?")) return;
        await fetch(`/api/shadow/admin/skills/${id}`, { method: "DELETE" });
        await fetchData();
    };

    const getCategoryName = (id: string | null) => {
        if (!id) return "Uncategorized";
        return categories.find((c) => c.id === id)?.name || "Unknown";
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8">Skills</h1>

            {/* Add/Edit Form */}
            <form onSubmit={handleSubmit} className="card mb-8">
                <h2 className="text-lg font-semibold mb-4">
                    {editing ? "Edit Skill" : "Add New Skill"}
                </h2>
                <div className="grid md:grid-cols-4 gap-4">
                    <input
                        type="text"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="Skill name"
                        className="input"
                        required
                    />
                    <select
                        value={form.type}
                        onChange={(e) => setForm({ ...form, type: e.target.value as any })}
                        className="input"
                    >
                        <option value="TECHNOLOGY" className="bg-neutral-900 text-white">Technology</option>
                        <option value="LANGUAGE" className="bg-neutral-900 text-white">Language</option>
                    </select>
                    {form.type === "TECHNOLOGY" && (
                        <select
                            value={form.categoryId}
                            onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                            className="input"
                        >
                            <option value="" className="bg-neutral-900 text-white">Select Category</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id} className="bg-neutral-900 text-white">
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    )}
                    <input
                        type="url"
                        value={form.iconUrl}
                        onChange={(e) => setForm({ ...form, iconUrl: e.target.value })}
                        placeholder="Icon URL"
                        className="input"
                    />
                </div>
                <div className="flex gap-4 mt-4">
                    <button type="submit" disabled={saving} className="btn-primary">
                        {saving ? "Saving..." : editing ? "Update" : "Add"}
                    </button>
                    {editing && (
                        <button
                            type="button"
                            onClick={() => {
                                setForm({ name: "", iconUrl: "", categoryId: "", type: "TECHNOLOGY" });
                                setEditing(null);
                            }}
                            className="btn-secondary"
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </form>

            {/* Skills List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {skills.map((skill) => (
                    <div key={skill.id} className="card flex items-center justify-between p-4">
                        <div className="flex items-center gap-3">
                            <SkillIcon icon={skill.iconUrl} alt={skill.name} className="w-8 h-8" />
                            <div>
                                <div className="font-semibold flex items-center gap-2">
                                    {skill.name}
                                    {skill.type === "LANGUAGE" && (
                                        <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded uppercase tracking-wider">
                                            Lang
                                        </span>
                                    )}
                                </div>
                                {skill.type !== "LANGUAGE" && (
                                    <div className="text-xs text-foreground-muted bg-background-secondary px-2 py-0.5 rounded inline-block mt-1">
                                        {getCategoryName(skill.categoryId)}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => handleEdit(skill)} className="text-sm text-primary hover:underline">
                                Edit
                            </button>
                            <button onClick={() => handleDelete(skill.id)} className="text-sm text-red-400 hover:underline">
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {skills.length === 0 && (
                <p className="text-center text-foreground-muted py-12">No skills yet. Add your first skill!</p>
            )}
        </div>
    );
}
