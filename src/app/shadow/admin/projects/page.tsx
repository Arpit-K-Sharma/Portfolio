"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

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
        } catch (error) {
            console.error("Error saving project:", error);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this project?")) return;

        await fetch(`/api/shadow/admin/projects/${id}`, { method: "DELETE" });
        await fetchData();
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
                        <h2 className="text-xl font-semibold mb-4">
                            {editing ? "Edit Project" : "New Project"}
                        </h2>
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
                                <div className="space-y-2 border border-border rounded-lg p-4">
                                    <div className="flex flex-wrap gap-2">
                                        {skills.filter((s: any) => s.type === "LANGUAGE").map((skill) => (
                                            <label
                                                key={skill.id}
                                                className={`cursor-pointer px-3 py-1.5 rounded-full border text-sm transition-colors flex items-center gap-2 ${form.skillIds.includes(skill.id)
                                                    ? "bg-primary text-primary-foreground border-primary"
                                                    : "bg-background hover:bg-background-secondary border-border"
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
                                            <option key={cat.id} value={cat.id} disabled={form.categoryIds.includes(cat.id)}>
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
                                                                    : "bg-background hover:bg-background-secondary border-border"
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

                            <div className="flex items-center gap-4">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={form.isFeatured}
                                        onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                                        className="rounded"
                                    />
                                    <span className="text-sm">Featured Project</span>
                                </label>

                                <div>
                                    <label className="text-sm font-medium mr-2">Display Order:</label>
                                    <input
                                        type="number"
                                        value={form.displayOrder}
                                        onChange={(e) => setForm({ ...form, displayOrder: parseInt(e.target.value) || 0 })}
                                        className="input w-20"
                                    />
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
            <div className="space-y-4">
                {projects.length === 0 ? (
                    <div className="card text-center py-12">
                        <p className="text-foreground-muted">No projects yet. Create your first project!</p>
                    </div>
                ) : (
                    projects.map((project) => (
                        <div key={project.id} className="card flex items-center justify-between">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <h3 className="font-semibold">{project.title}</h3>
                                    {project.isFeatured && <span className="badge">Featured</span>}
                                </div>
                                <p className="text-sm text-foreground-muted mb-2">{project.shortDescription}</p>
                                <div className="flex flex-wrap gap-1">
                                    {project.skills.slice(0, 5).map((skill) => (
                                        <span key={skill.id} className="text-xs bg-background-secondary px-2 py-1 rounded">
                                            {skill.name}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Link href={`/projects/${project.slug}`} target="_blank" className="btn-ghost text-sm">
                                    View
                                </Link>
                                <button onClick={() => handleEdit(project)} className="btn-ghost text-sm">
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(project.id)}
                                    className="btn-ghost text-sm text-red-400 hover:text-red-300"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
