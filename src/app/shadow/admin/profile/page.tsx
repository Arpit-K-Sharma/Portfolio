"use client";

import { useState, useEffect } from "react";

interface Profile {
    id?: string;
    name: string;
    title: string;
    bio: string;
    avatarUrl: string;
    githubUrl: string;
    linkedinUrl: string;
    twitterUrl: string;
    cvUrl: string;
    cvViewUrl: string;
    email: string;
}

export default function AdminProfilePage() {
    const [profile, setProfile] = useState<Profile>({
        name: "",
        title: "",
        bio: "",
        avatarUrl: "",
        githubUrl: "",
        linkedinUrl: "",
        twitterUrl: "",
        cvUrl: "",
        cvViewUrl: "",
        email: "",
    });
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        fetch("/api/shadow/admin/profile")
            .then((res) => res.json())
            .then((data) => {
                if (data && !data.error) {
                    setProfile(data);
                }
            });
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage("");

        try {
            const response = await fetch("/api/shadow/admin/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(profile),
            });

            if (!response.ok) throw new Error("Failed to save");

            setMessage("Profile saved successfully!");
        } catch {
            setMessage("Failed to save profile");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Profile Settings</h1>

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Basic Info Column */}
                    <div className="space-y-6">
                        <div className="card">
                            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                                <span className="bg-primary/20 text-primary p-1.5 rounded-lg">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </span>
                                Basic Information
                            </h2>

                            <div className="space-y-5">
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-foreground-muted">Full Name</label>
                                    <input
                                        type="text"
                                        value={profile.name}
                                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                        className="input"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2 text-foreground-muted">Professional Title</label>
                                    <input
                                        type="text"
                                        value={profile.title}
                                        onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                                        placeholder="e.g., Blockchain & Full-Stack Developer"
                                        className="input"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2 text-foreground-muted">Email Address</label>
                                    <input
                                        type="email"
                                        value={profile.email}
                                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                        className="input"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2 text-foreground-muted">Bio</label>
                                    <textarea
                                        rows={6}
                                        value={profile.bio}
                                        onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                                        className="input resize-none leading-relaxed"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="card">
                            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                                <span className="bg-primary/20 text-primary p-1.5 rounded-lg">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </span>
                                Avatar & Images
                            </h2>
                            <div>
                                <label className="block text-sm font-medium mb-2 text-foreground-muted">Avatar URL</label>
                                <div className="flex gap-4 items-start">
                                    <input
                                        type="url"
                                        value={profile.avatarUrl}
                                        onChange={(e) => setProfile({ ...profile, avatarUrl: e.target.value })}
                                        className="input flex-1"
                                    />
                                    {profile.avatarUrl && (
                                        <div className="w-12 h-12 rounded-full overflow-hidden border border-white/10 shrink-0">
                                            <img src={profile.avatarUrl} alt="Preview" className="w-full h-full object-cover" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Links Column */}
                    <div className="space-y-6">
                        <div className="card">
                            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                                <span className="bg-primary/20 text-primary p-1.5 rounded-lg">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                    </svg>
                                </span>
                                Social Links
                            </h2>

                            <div className="space-y-5">
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-foreground-muted">GitHub Profile</label>
                                    <input
                                        type="url"
                                        value={profile.githubUrl}
                                        onChange={(e) => setProfile({ ...profile, githubUrl: e.target.value })}
                                        className="input"
                                        placeholder="https://github.com/..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2 text-foreground-muted">LinkedIn Profile</label>
                                    <input
                                        type="url"
                                        value={profile.linkedinUrl}
                                        onChange={(e) => setProfile({ ...profile, linkedinUrl: e.target.value })}
                                        className="input"
                                        placeholder="https://linkedin.com/in/..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2 text-foreground-muted">Twitter Profile</label>
                                    <input
                                        type="url"
                                        value={profile.twitterUrl}
                                        onChange={(e) => setProfile({ ...profile, twitterUrl: e.target.value })}
                                        className="input"
                                        placeholder="https://twitter.com/..."
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="card">
                            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                                <span className="bg-primary/20 text-primary p-1.5 rounded-lg">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 011.414.586l5.414 5.414a1 1 0 01.586 1.414V19a2 2 0 01-2 2z" />
                                    </svg>
                                </span>
                                Resume / CV
                            </h2>

                            <div className="space-y-5">
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-foreground-muted">View Link</label>
                                    <input
                                        type="url"
                                        value={profile.cvViewUrl}
                                        onChange={(e) => setProfile({ ...profile, cvViewUrl: e.target.value })}
                                        placeholder="Online preview link"
                                        className="input"
                                    />
                                    <p className="text-xs text-foreground-muted/60 mt-1">Direct link to view CV in browser</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2 text-foreground-muted">Download Link</label>
                                    <input
                                        type="url"
                                        value={profile.cvUrl}
                                        onChange={(e) => setProfile({ ...profile, cvUrl: e.target.value })}
                                        placeholder="Direct download link"
                                        className="input"
                                    />
                                    <p className="text-xs text-foreground-muted/60 mt-1">Direct link to download PDF file</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex items-center justify-end gap-4 border-t border-white/[0.08] pt-6">
                    {message && (
                        <div className={`px-4 py-2 rounded-lg text-sm font-medium ${message.includes("success") ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}`}>
                            {message}
                        </div>
                    )}

                    <button type="submit" disabled={saving} className="btn-primary min-w-[150px]">
                        {saving ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </form>
        </div>
    );
}
