"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useToast } from "@/components/ui/toast-context";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

interface Skill {
    id: string;
    name: string;
    slug: string;
}

interface Category {
    id: string;
    name: string;
    slug: string;
}

interface Project {
    id: string;
    title: string;
    slug: string;
    shortDescription: string;
    fullDescription: string;
    thumbnailUrl: string;
    githubUrl: string;
    demoUrl: string | null;
    docsUrl: string | null;
    youtubeUrl: string | null;
    isFeatured: boolean;
    displayOrder: number;
    skills: Skill[];
    categories: Category[];
}

export default function AdminProjectsPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [skills, setSkills] = useState<Skill[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState<Project | null>(null);
    const [form, setForm] = useState({
        title: "",
        shortDescription: "",
        fullDescription: "",
        thumbnailUrl: "",
        githubUrl: "",
        demoUrl: "",
        docsUrl: "",
        youtubeUrl: "",
        isFeatured: false,
        displayOrder: 0,
        skillIds: [] as string[],
        categoryIds: [] as string[],
    });
    const [saving, setSaving] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

    const fetchData = async () => {
        const [projectsRes, skillsRes, categoriesRes] = await Promise.all([
            fetch("/api/shadow/admin/projects").then((r) => r.json()),
            fetch("/api/shadow/admin/skills").then((r) => r.json()),
            fetch("/api/shadow/admin/categories").then((r) => r.json()),
        ]);
        setProjects(projectsRes);
        setSkills(skillsRes);
        setCategories(categoriesRes);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const resetForm = () => {
        setForm({
            title: "",
            shortDescription: "",
            fullDescription: "",
            thumbnailUrl: "",
            githubUrl: "",
            demoUrl: "",
            docsUrl: "",
            youtubeUrl: "",
            isFeatured: false,
            displayOrder: 0,
            skillIds: [],
            categoryIds: [],
        });
        setEditing(null);
        setShowForm(false);
    };

    const handleEdit = (project: Project) => {
        setForm({
            title: project.title,
            shortDescription: project.shortDescription,
            fullDescription: project.fullDescription,
            thumbnailUrl: project.thumbnailUrl || "",
            githubUrl: project.githubUrl || "",
            demoUrl: project.demoUrl || "",
            docsUrl: project.docsUrl || "",
            youtubeUrl: project.youtubeUrl || "",
            isFeatured: project.isFeatured,
            displayOrder: project.displayOrder,
            skillIds: project.skills.map((s) => s.id),
            categoryIds: project.categories.map((c) => c.id),
        });
        setEditing(project);
        setShowForm(true);
    };

    const { showToast } = useToast();

    // ... (fetchData) ...

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const url = editing
                ? `/api/shadow/admin/projects/${editing.id}`
                : "/api/shadow/admin/projects";
            const method = editing ? "PUT" : "POST";

            await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            await fetchData();
            resetForm();
            showToast(editing ? "Project updated successfully" : "Project created successfully", "success");
        } catch (error) {
            console.error("Error saving project:", error);
            showToast("Failed to save project", "error");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await fetch(`/api/shadow/admin/projects/${id}`, { method: "DELETE" });
            await fetchData();
            showToast("Project deleted successfully", "success");
        } catch (error) {
            console.error("Error deleting project:", error);
            showToast("Failed to delete project", "error");
        } finally {
            setDeleteTarget(null);
        }
    };

    // Inline update for featured toggle and display order
    const handleInlineUpdate = async (id: string, field: string, value: boolean | number) => {
        try {
            await fetch(`/api/shadow/admin/projects/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ [field]: value }),
            });
            await fetchData();
            showToast("Updated successfully", "success");
        } catch (error) {
            console.error("Error updating project:", error);
            showToast(`Failed to update ${field}`, "error");
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold">Projects</h1>
                <button onClick={() => setShowForm(true)} className="btn-primary">
                    + New Project
                </button>
            </div>

            {/* Form Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-background-secondary rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">
                                {editing ? "Edit Project" : "New Project"}
                            </h2>
                            <button
                                onClick={resetForm}
                                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Title</label>
                                <input
                                    type="text"
                                    value={form.title}
                                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                                    className="input"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Short Description</label>
                                <textarea
                                    rows={2}
                                    value={form.shortDescription}
                                    onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
                                    className="input resize-none"
                                    required
                                />
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label className="block text-sm font-medium">Full Description</label>
                                    <span className="text-xs text-foreground-muted">Markdown Supported</span>
                                </div>
                                <textarea
                                    rows={15}
                                    value={form.fullDescription}
                                    onChange={(e) => setForm({ ...form, fullDescription: e.target.value })}
                                    className="input resize-y font-mono text-sm leading-relaxed"
                                    required
                                    placeholder="# Project Title\n\nWrite your description in Markdown..."
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">GitHub URL</label>
                                    <input
                                        type="url"
                                        value={form.githubUrl}
                                        onChange={(e) => setForm({ ...form, githubUrl: e.target.value })}
                                        className="input"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Demo URL</label>
                                    <input
                                        type="url"
                                        value={form.demoUrl}
                                        onChange={(e) => setForm({ ...form, demoUrl: e.target.value })}
                                        className="input"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Docs URL</label>
                                    <input
                                        type="url"
                                        value={form.docsUrl}
                                        onChange={(e) => setForm({ ...form, docsUrl: e.target.value })}
                                        className="input"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">YouTube URL</label>
                                    <input
                                        type="url"
                                        value={form.youtubeUrl}
                                        onChange={(e) => setForm({ ...form, youtubeUrl: e.target.value })}
                                        className="input"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Thumbnail URL</label>
                                <input
                                    type="url"
                                    value={form.thumbnailUrl}
                                    onChange={(e) => setForm({ ...form, thumbnailUrl: e.target.value })}
                                    className="input"
                                />
                            </div>


                            {/* Languages Selection (Global) */}
                            <div>
                                <label className="block text-sm font-medium mb-2">Languages</label>
                                <div className="space-y-2 border border-border rounded-lg p-4 bg-background/50">
                                    <div className="flex flex-wrap gap-2">
                                        {skills.filter((s: any) => s.type === "LANGUAGE").map((skill) => (
                                            <label
                                                key={skill.id}
                                                className={`cursor-pointer px-3 py-1.5 rounded-full border text-sm transition-colors flex items-center gap-2 ${form.skillIds.includes(skill.id)
                                                    ? "bg-primary text-primary-foreground border-primary shadow-sm shadow-primary/20"
                                                    : "bg-white/5 text-foreground-muted hover:text-foreground border-white/10 hover:border-primary/50"
                                                    }`}
                                            >
                                                <input
                                                    type="checkbox"
                                                    className="hidden"
                                                    checked={form.skillIds.includes(skill.id)}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setForm({ ...form, skillIds: [...form.skillIds, skill.id] });
                                                        } else {
                                                            setForm({ ...form, skillIds: form.skillIds.filter((id) => id !== skill.id) });
                                                        }
                                                    }}
                                                />
                                                {skill.name}
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Categories Selection */}
                            <div>
                                <label className="block text-sm font-medium mb-2">Categories</label>
                                <div className="space-y-3">
                                    <select
                                        className="input w-full"
                                        onChange={(e) => {
                                            const catId = e.target.value;
                                            if (catId && !form.categoryIds.includes(catId)) {
                                                setForm({ ...form, categoryIds: [...form.categoryIds, catId] });
                                            }
                                            e.target.value = ""; // Reset dropdown
                                        }}
                                    >
                                        <option value="">+ Add Category</option>
                                        {categories.map((cat) => (
                                            <option key={cat.id} value={cat.id} disabled={form.categoryIds.includes(cat.id)} className="bg-neutral-900 text-white">
                                                {cat.name}
                                            </option>
                                        ))}
                                    </select>

                                    <div className="flex flex-wrap gap-2 min-h-[32px]">
                                        {form.categoryIds.map((id) => {
                                            const cat = categories.find((c) => c.id === id);
                                            return (
                                                <span
                                                    key={id}
                                                    className="badge flex items-center gap-1 bg-primary/10 text-primary border-primary/20"
                                                >
                                                    {cat?.name}
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setForm({
                                                                ...form,
                                                                categoryIds: form.categoryIds.filter((cid) => cid !== id),
                                                            })
                                                        }
                                                        className="hover:text-red-500 ml-1"
                                                    >
                                                        ×
                                                    </button>
                                                </span>
                                            );
                                        })}
                                        {form.categoryIds.length === 0 && (
                                            <p className="text-sm text-foreground-muted italic">No categories selected.</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Technologies Selection (Filtered by Category) */}
                            <div>
                                <label className="block text-sm font-medium mb-2">Technologies</label>
                                <div className="space-y-4 border border-border rounded-lg p-4 max-h-[400px] overflow-y-auto">

                                    {/* Category-Specific Skills */}
                                    {form.categoryIds.length === 0 ? (
                                        <div className="p-4 text-center text-foreground-muted text-sm italic">
                                            Select a project category to see Technology skills (Frameworks, Tools, etc.)
                                        </div>
                                    ) : (
                                        form.categoryIds.map((catId) => {
                                            const category = categories.find((c) => c.id === catId);
                                            // Filter for TECHNOLOGY skills in this category
                                            const categorySkills = skills.filter((s: any) => s.categoryId === catId && s.type !== "LANGUAGE");

                                            if (categorySkills.length === 0) return null;

                                            return (
                                                <div key={catId} className="space-y-2">
                                                    <h4 className="text-xs font-bold uppercase tracking-wider text-foreground-muted">
                                                        {category?.name}
                                                    </h4>
                                                    <div className="flex flex-wrap gap-2">
                                                        {categorySkills.map((skill) => (
                                                            <label
                                                                key={skill.id}
                                                                className={`cursor-pointer px-3 py-1.5 rounded-full border text-sm transition-colors flex items-center gap-2 ${form.skillIds.includes(skill.id)
                                                                    ? "bg-primary text-primary-foreground border-primary"
                                                                    : "bg-white/5 hover:bg-white/10 border-white/10"
                                                                    }`}
                                                            >
                                                                <input
                                                                    type="checkbox"
                                                                    className="hidden"
                                                                    checked={form.skillIds.includes(skill.id)}
                                                                    onChange={(e) => {
                                                                        if (e.target.checked) {
                                                                            setForm({
                                                                                ...form,
                                                                                skillIds: [...form.skillIds, skill.id],
                                                                            });
                                                                        } else {
                                                                            setForm({
                                                                                ...form,
                                                                                skillIds: form.skillIds.filter((id) => id !== skill.id),
                                                                            });
                                                                        }
                                                                    }}
                                                                />
                                                                {skill.name}
                                                            </label>
                                                        ))}
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-6 p-4 bg-background/50 rounded-lg border border-border">
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <div className="relative">
                                        <input
                                            type="checkbox"
                                            checked={form.isFeatured}
                                            onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                    </div>
                                    <span className="text-sm font-medium">Featured Project</span>
                                </label>

                                <div className="flex-1">
                                    <label className="block text-sm font-medium mb-1">
                                        Display Order
                                        <span className="text-xs text-foreground-muted ml-2 font-normal">(1 = First, 2 = Second...)</span>
                                    </label>
                                    <input
                                        type="number"
                                        value={form.displayOrder}
                                        onChange={(e) => setForm({ ...form, displayOrder: parseInt(e.target.value) || 0 })}
                                        className="input w-24"
                                        placeholder="0"
                                    />
                                    <p className="text-xs text-foreground-muted mt-1">
                                        Order swaps automatically if ID exists.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button type="submit" disabled={saving} className="btn-primary">
                                    {saving ? "Saving..." : "Save Project"}
                                </button>
                                <button type="button" onClick={resetForm} className="btn-secondary">
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Projects List */}
            <div className="bg-card/30 border border-white/5 rounded-2xl overflow-x-auto custom-scrollbar">
                {projects.length === 0 ? (
                    <div className="p-12 text-center text-foreground-muted">No projects yet. Create your first project!</div>
                ) : (
                    <div className="min-w-[700px] divide-y divide-white/5">
                        {/* Header */}
                        <div className="grid grid-cols-[1fr_100px_100px_140px] gap-4 items-center px-6 py-4 text-xs font-bold uppercase tracking-wider text-foreground-muted bg-white/[0.02]">
                            <span>Project</span>
                            <span className="text-center">Featured</span>
                            <span className="text-center">Order</span>
                            <span className="text-right">Actions</span>
                        </div>

                        {projects.map((project) => (
                            <div
                                key={project.id}
                                className="grid grid-cols-[1fr_100px_100px_140px] gap-4 items-center px-6 py-4 hover:bg-white/[0.03] transition-colors"
                            >
                                {/* Project Info */}
                                <div className="flex items-center gap-4 min-w-0">
                                    <div className="w-12 h-12 rounded-xl bg-neutral-900 border border-white/10 flex-shrink-0 overflow-hidden shadow-inner">
                                        {project.thumbnailUrl ? (
                                            <img src={project.thumbnailUrl} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-foreground-muted bg-white/5">
                                                <svg className="w-6 h-6 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>
                                            </div>
                                        )}
                                    </div>
                                    <div className="min-w-0">
                                        <h3 className="font-medium text-foreground truncate">{project.title}</h3>
                                        <p className="text-xs text-foreground-muted truncate mt-0.5">
                                            {project.categories.map(c => c.name).join(", ") || "No categories"}
                                        </p>
                                    </div>
                                </div>

                                {/* Featured Toggle */}
                                <div className="flex justify-center">
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={project.isFeatured}
                                            onChange={(e) => handleInlineUpdate(project.id, "isFeatured", e.target.checked)}
                                            className="sr-only peer"
                                        />
                                        <div className="w-10 h-5 bg-neutral-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary shadow-sm"></div>
                                    </label>
                                </div>

                                {/* Display Order */}
                                <div className="flex justify-center">
                                    <input
                                        type="number"
                                        defaultValue={project.displayOrder}
                                        onBlur={(e) => {
                                            const newVal = parseInt(e.target.value) || 0;
                                            if (newVal !== project.displayOrder) {
                                                handleInlineUpdate(project.id, "displayOrder", newVal);
                                            }
                                        }}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                (e.target as HTMLInputElement).blur();
                                            }
                                        }}
                                        className="w-16 text-center bg-neutral-900/50 border border-white/10 rounded-lg py-1.5 text-sm text-foreground focus:border-primary/50 focus:ring-1 focus:ring-primary/20 focus:outline-none transition-all"
                                    />
                                </div>

                                {/* Actions */}
                                <div className="flex items-center justify-end gap-1.5">
                                    <Link
                                        href={`/projects/${project.slug}`}
                                        target="_blank"
                                        className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/[0.03] border border-white/5 text-foreground-muted hover:text-white hover:bg-white/[0.08] transition-all"
                                        title="View"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>
                                    </Link>
                                    <button
                                        onClick={() => handleEdit(project)}
                                        className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/[0.03] border border-white/5 text-foreground-muted hover:text-white hover:bg-white/[0.08] transition-all"
                                        title="Edit"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /><path d="m15 5 4 4" /></svg>
                                    </button>
                                    <button
                                        onClick={() => setDeleteTarget(project.id)}
                                        className="w-9 h-9 flex items-center justify-center rounded-xl bg-red-500/5 border border-red-500/10 text-foreground-muted hover:text-red-400 hover:bg-red-500/10 transition-all"
                                        title="Delete"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /><line x1="10" x2="10" y1="11" y2="17" /><line x1="14" x2="14" y1="11" y2="17" /></svg>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Delete Confirmation Dialog */}
            <ConfirmDialog
                open={!!deleteTarget}
                title="Delete Project"
                message="Are you sure you want to delete this project? This action cannot be undone."
                confirmLabel="Delete"
                cancelLabel="Cancel"
                variant="danger"
                onConfirm={() => deleteTarget && handleDelete(deleteTarget)}
                onCancel={() => setDeleteTarget(null)}
            />
        </div>
    );
}
