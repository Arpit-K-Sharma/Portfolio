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

            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Basic Info Column */}
                    <div className="space-y-8">
                        <section className="card p-6 md:p-8 bg-card/30 border-white/5 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                            </div>
                            <h2 className="text-xl font-bold mb-8 flex items-center gap-3">
                                <span className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </span>
                                Basic Information
                            </h2>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-foreground-muted uppercase tracking-widest ml-1">Full Name</label>
                                    <input
                                        type="text"
                                        value={profile.name}
                                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                        className="input bg-neutral-900/50"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-foreground-muted uppercase tracking-widest ml-1">Professional Title</label>
                                    <input
                                        type="text"
                                        value={profile.title}
                                        onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                                        placeholder="e.g., Blockchain & Full-Stack Developer"
                                        className="input bg-neutral-900/50"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-foreground-muted uppercase tracking-widest ml-1">Email Address</label>
                                    <input
                                        type="email"
                                        value={profile.email}
                                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                        className="input bg-neutral-900/50"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-foreground-muted uppercase tracking-widest ml-1">Bio</label>
                                    <textarea
                                        rows={8}
                                        value={profile.bio}
                                        onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                                        className="input bg-neutral-900/50 resize-none leading-relaxed text-sm"
                                        required
                                    />
                                </div>
                            </div>
                        </section>

                        <section className="card p-6 md:p-8 bg-card/30 border-white/5">
                            <h2 className="text-xl font-bold mb-8 flex items-center gap-3">
                                <span className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </span>
                                Avatar & Images
                            </h2>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-foreground-muted uppercase tracking-widest ml-1">Avatar URL</label>
                                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                                    <input
                                        type="url"
                                        value={profile.avatarUrl}
                                        onChange={(e) => setProfile({ ...profile, avatarUrl: e.target.value })}
                                        className="input flex-1 bg-neutral-900/50"
                                    />
                                    {profile.avatarUrl && (
                                        <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-primary/20 shrink-0 shadow-lg shadow-primary/5">
                                            <img src={profile.avatarUrl} alt="Preview" className="w-full h-full object-cover" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Links Column */}
                    <div className="space-y-8">
                        <section className="card p-6 md:p-8 bg-card/30 border-white/5">
                            <h2 className="text-xl font-bold mb-8 flex items-center gap-3">
                                <span className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                    </svg>
                                </span>
                                Social Presence
                            </h2>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-foreground-muted uppercase tracking-widest ml-1">GitHub Profile</label>
                                    <input
                                        type="url"
                                        value={profile.githubUrl}
                                        onChange={(e) => setProfile({ ...profile, githubUrl: e.target.value })}
                                        className="input bg-neutral-900/50"
                                        placeholder="https://github.com/..."
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-foreground-muted uppercase tracking-widest ml-1">LinkedIn Profile</label>
                                    <input
                                        type="url"
                                        value={profile.linkedinUrl}
                                        onChange={(e) => setProfile({ ...profile, linkedinUrl: e.target.value })}
                                        className="input bg-neutral-900/50"
                                        placeholder="https://linkedin.com/in/..."
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-foreground-muted uppercase tracking-widest ml-1">Twitter Profile</label>
                                    <input
                                        type="url"
                                        value={profile.twitterUrl}
                                        onChange={(e) => setProfile({ ...profile, twitterUrl: e.target.value })}
                                        className="input bg-neutral-900/50"
                                        placeholder="https://twitter.com/..."
                                    />
                                </div>
                            </div>
                        </section>

                        <section className="card p-6 md:p-8 bg-card/30 border-white/5">
                            <h2 className="text-xl font-bold mb-8 flex items-center gap-3">
                                <span className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 011.414.586l5.414 5.414a1 1 0 01.586 1.414V19a2 2 0 01-2 2z" />
                                    </svg>
                                </span>
                                Resume/CV Assets
                            </h2>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-foreground-muted uppercase tracking-widest ml-1">View Link</label>
                                    <input
                                        type="url"
                                        value={profile.cvViewUrl}
                                        onChange={(e) => setProfile({ ...profile, cvViewUrl: e.target.value })}
                                        placeholder="Direct preview URL"
                                        className="input bg-neutral-900/50"
                                    />
                                    <p className="text-[10px] text-foreground-muted ml-1 opacity-60">Shown for &quot;View CV&quot; actions</p>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-foreground-muted uppercase tracking-widest ml-1">Download Link</label>
                                    <input
                                        type="url"
                                        value={profile.cvUrl}
                                        onChange={(e) => setProfile({ ...profile, cvUrl: e.target.value })}
                                        placeholder="Direct download URL"
                                        className="input bg-neutral-900/50"
                                    />
                                    <p className="text-[10px] text-foreground-muted ml-1 opacity-60">Shown for &quot;Download PDF&quot; actions</p>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>

                <div className="sticky bottom-0 bg-background/80 backdrop-blur-md border-t border-white/5 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 z-10 -mx-4 md:-mx-8 lg:-mx-8">
                    <div className="flex-1">
                        {message && (
                            <p className={`text-sm font-semibold flex items-center gap-2 ${message.includes("success") ? "text-green-400" : "text-red-400"}`}>
                                <span className={`w-2 h-2 rounded-full ${message.includes("success") ? "bg-green-400 animate-pulse" : "bg-red-400"}`}></span>
                                {message}
                            </p>
                        )}
                    </div>

                    <button type="submit" disabled={saving} className="btn-primary w-full sm:w-auto min-w-[200px] py-3 shadow-lg shadow-primary/20">
                        {saving ? "Saving Changes..." : "Save Profile Settings"}
                    </button>
                </div>
            </form>
        </div>
    );
}
