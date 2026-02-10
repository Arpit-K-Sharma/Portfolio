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
        <div>
            <h1 className="text-3xl font-bold mb-8">Profile Settings</h1>

            <form onSubmit={handleSubmit} className="max-w-2xl">
                <div className="card mb-6">
                    <h2 className="text-xl font-semibold mb-4">Basic Information</h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Name</label>
                            <input
                                type="text"
                                value={profile.name}
                                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                className="input"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Title</label>
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
                            <label className="block text-sm font-medium mb-2">Bio</label>
                            <textarea
                                rows={4}
                                value={profile.bio}
                                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                                className="input resize-none"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Email</label>
                            <input
                                type="email"
                                value={profile.email}
                                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                className="input"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Avatar URL</label>
                            <input
                                type="url"
                                value={profile.avatarUrl}
                                onChange={(e) => setProfile({ ...profile, avatarUrl: e.target.value })}
                                className="input"
                            />
                        </div>
                    </div>
                </div>

                <div className="card mb-6">
                    <h2 className="text-xl font-semibold mb-4">Social Links</h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">GitHub URL</label>
                            <input
                                type="url"
                                value={profile.githubUrl}
                                onChange={(e) => setProfile({ ...profile, githubUrl: e.target.value })}
                                className="input"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">LinkedIn URL</label>
                            <input
                                type="url"
                                value={profile.linkedinUrl}
                                onChange={(e) => setProfile({ ...profile, linkedinUrl: e.target.value })}
                                className="input"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Twitter URL</label>
                            <input
                                type="url"
                                value={profile.twitterUrl}
                                onChange={(e) => setProfile({ ...profile, twitterUrl: e.target.value })}
                                className="input"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">CV View URL</label>
                            <input
                                type="url"
                                value={profile.cvViewUrl}
                                onChange={(e) => setProfile({ ...profile, cvViewUrl: e.target.value })}
                                placeholder="Link to view CV online (e.g., Google Drive preview)"
                                className="input"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">CV Download URL</label>
                            <input
                                type="url"
                                value={profile.cvUrl}
                                onChange={(e) => setProfile({ ...profile, cvUrl: e.target.value })}
                                placeholder="Direct link to download CV PDF"
                                className="input"
                            />
                        </div>
                    </div>
                </div>

                {message && (
                    <div className={`mb-4 p-4 rounded-lg ${message.includes("success") ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}`}>
                        {message}
                    </div>
                )}

                <button type="submit" disabled={saving} className="btn-primary">
                    {saving ? "Saving..." : "Save Profile"}
                </button>
            </form>
        </div>
    );
}
