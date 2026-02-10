"use client";

import { useState, useEffect } from "react";

interface Category {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    isVisible: boolean;
}

export default function AdminCategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [form, setForm] = useState({ name: "", description: "", isVisible: true });
    const [editing, setEditing] = useState<Category | null>(null);
    const [saving, setSaving] = useState(false);

    const fetchCategories = async () => {
        const res = await fetch("/api/shadow/admin/categories");
        setCategories(await res.json());
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const url = editing
                ? `/api/shadow/admin/categories/${editing.id}`
                : "/api/shadow/admin/categories";
            const method = editing ? "PUT" : "POST";

            await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            await fetchCategories();
            await fetchCategories();
            setForm({ name: "", description: "", isVisible: true });
            setEditing(null);
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (category: Category) => {
        setForm({
            name: category.name,
            description: category.description || "",
            isVisible: category.isVisible ?? true
        });
        setEditing(category);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this category?")) return;
        await fetch(`/api/shadow/admin/categories/${id}`, { method: "DELETE" });
        await fetchCategories();
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8">Categories</h1>

            {/* Add/Edit Form */}
            <form onSubmit={handleSubmit} className="card mb-8">
                <h2 className="text-lg font-semibold mb-4">
                    {editing ? "Edit Category" : "Add New Category"}
                </h2>
                <div className="space-y-4">
                    <div className="flex gap-4">
                        <input
                            type="text"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            placeholder="Category name (e.g., Web Application)"
                            className="input flex-1"
                            required
                        />
                        <input
                            type="text"
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                            placeholder="Description (optional)"
                            className="input flex-1"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="isVisible"
                            checked={form.isVisible}
                            onChange={(e) => setForm({ ...form, isVisible: e.target.checked })}
                            className="rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <label htmlFor="isVisible" className="text-sm font-medium">
                            Visible in public filters
                        </label>
                    </div>
                    <div className="flex gap-4">
                        <button type="submit" disabled={saving} className="btn-primary">
                            {saving ? "Saving..." : editing ? "Update" : "Add"}
                        </button>
                        {editing && (
                            <button
                                type="button"
                                onClick={() => {
                                    setForm({ name: "", description: "", isVisible: true });
                                    setEditing(null);
                                }}
                                className="btn-secondary"
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </div>
            </form>

            {/* Categories List */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {categories.map((category) => (
                    <div key={category.id} className="card">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <span className="font-medium">{category.name}</span>
                                {!category.isVisible && (
                                    <span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded uppercase tracking-wider">
                                        Hidden
                                    </span>
                                )}
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => handleEdit(category)} className="text-sm text-primary hover:underline">
                                    Edit
                                </button>
                                <button onClick={() => handleDelete(category.id)} className="text-sm text-red-400 hover:underline">
                                    Delete
                                </button>
                            </div>
                        </div>
                        {category.description && (
                            <p className="text-sm text-foreground-muted">{category.description}</p>
                        )}
                    </div>
                ))}
            </div>

            {categories.length === 0 && (
                <p className="text-center text-foreground-muted py-12">No categories yet. Add your first category!</p>
            )}
        </div>
    );
}
