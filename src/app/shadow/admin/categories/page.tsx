"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/toast-context";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

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
    const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
    const { showToast } = useToast();

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
            setForm({ name: "", description: "", isVisible: true });
            setEditing(null);
            showToast(editing ? "Category updated" : "Category created", "success");
        } catch (error) {
            console.error(error);
            showToast("Failed to save category", "error");
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
        try {
            await fetch(`/api/shadow/admin/categories/${id}`, { method: "DELETE" });
            await fetchCategories();
            showToast("Category deleted", "success");
        } catch (error) {
            console.error(error);
            showToast("Failed to delete category", "error");
        } finally {
            setDeleteTarget(null);
        }
    };

    return (
        <div className="max-w-5xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Categories</h1>

            {/* Add/Edit Form */}
            <form onSubmit={handleSubmit} className="card p-6 md:p-8 mb-12 bg-card/30 border-white/5">
                <h2 className="text-xl font-bold mb-8 flex items-center gap-3">
                    <span className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z" />
                        </svg>
                    </span>
                    {editing ? "Edit Category" : "Create Category"}
                </h2>

                <div className="space-y-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-foreground-muted uppercase tracking-widest ml-1">
                                Category Name
                            </label>
                            <input
                                type="text"
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                placeholder="e.g., Full-Stack Development"
                                className="input w-full bg-neutral-900/50"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-foreground-muted uppercase tracking-widest ml-1">
                                Description
                            </label>
                            <input
                                type="text"
                                value={form.description}
                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                                placeholder="Brief overview of this category"
                                className="input w-full bg-neutral-900/50"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-5 rounded-2xl bg-white/[0.02] border border-white/5">
                        <div className="flex items-center gap-4">
                            <button
                                type="button"
                                onClick={() => setForm({ ...form, isVisible: !form.isVisible })}
                                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${form.isVisible ? 'bg-primary' : 'bg-neutral-700'}`}
                            >
                                <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${form.isVisible ? 'translate-x-5' : 'translate-x-0'}`} />
                            </button>
                            <div className="space-y-0.5">
                                <p className="text-sm font-bold">Public Visibility</p>
                                <p className="text-xs text-foreground-muted">Make this category visible in project filters</p>
                            </div>
                        </div>

                        <div className="flex w-full sm:w-auto gap-3">
                            {editing && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setForm({ name: "", description: "", isVisible: true });
                                        setEditing(null);
                                    }}
                                    className="btn-secondary flex-1 sm:flex-none"
                                >
                                    Cancel
                                </button>
                            )}
                            <button type="submit" disabled={saving} className="btn-primary flex-1 sm:flex-none px-8">
                                {saving ? "Saving..." : editing ? "Update" : "Add Category"}
                            </button>
                        </div>
                    </div>
                </div>
            </form>

            <div className="flex items-center gap-3 mb-6">
                <h2 className="text-xl font-bold">All Categories</h2>
                <span className="px-2 py-0.5 rounded-lg bg-white/5 border border-white/10 text-[10px] font-bold text-foreground-muted uppercase tracking-widest">
                    {categories.length} Total
                </span>
            </div>

            {/* Categories List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((category) => (
                    <div key={category.id} className="card p-5 group hover:border-primary/20 transition-all duration-300 flex flex-col h-full">
                        <div className="flex items-start justify-between mb-4 gap-4">
                            <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-lg truncate group-hover:text-primary transition-colors">
                                    {category.name}
                                </h3>
                                <div className="mt-1 flex items-center gap-2">
                                    {category.isVisible ? (
                                        <span className="flex items-center gap-1 text-[10px] font-bold text-green-400 uppercase tracking-widest bg-green-500/10 px-2 py-0.5 rounded-md border border-green-500/20">
                                            <span className="w-1 h-1 rounded-full bg-green-400 animate-pulse"></span>
                                            Public
                                        </span>
                                    ) : (
                                        <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest bg-neutral-500/10 px-2 py-0.5 rounded-md border border-neutral-500/20">
                                            Hidden
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => handleEdit(category)}
                                    className="p-2 rounded-lg hover:bg-white/5 text-foreground-muted hover:text-white transition-all"
                                    title="Edit"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                </button>
                                <button
                                    onClick={() => setDeleteTarget(category.id)}
                                    className="p-2 rounded-lg hover:bg-red-500/10 text-foreground-muted hover:text-red-400 transition-all"
                                    title="Delete"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                </button>
                            </div>
                        </div>

                        {category.description && (
                            <p className="text-sm text-foreground-muted leading-relaxed line-clamp-3 mb-6 flex-1">
                                {category.description}
                            </p>
                        )}

                        <div className="mt-auto md:hidden pt-4 flex gap-2 border-t border-white/5">
                            <button onClick={() => handleEdit(category)} className="flex-1 py-2 text-xs font-bold uppercase tracking-wider bg-white/5 rounded-lg">Edit</button>
                            <button onClick={() => setDeleteTarget(category.id)} className="flex-1 py-2 text-xs font-bold uppercase tracking-wider bg-red-500/10 text-red-400 rounded-lg">Delete</button>
                        </div>
                    </div>
                ))}
            </div>

            {categories.length === 0 && (
                <p className="text-center text-foreground-muted py-12">No categories yet. Add your first category!</p>
            )}

            <ConfirmDialog
                open={!!deleteTarget}
                title="Delete Category"
                message="Are you sure? Projects using this category will lose the association."
                confirmLabel="Delete"
                cancelLabel="Cancel"
                variant="danger"
                onConfirm={() => deleteTarget && handleDelete(deleteTarget)}
                onCancel={() => setDeleteTarget(null)}
            />
        </div>
    );
}
