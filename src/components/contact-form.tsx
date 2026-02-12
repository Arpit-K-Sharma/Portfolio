"use client";

import { useState } from "react";
import { useSession, signIn } from "next-auth/react";

export function ContactForm() {
    const { data: session, status } = useSession();
    const [message, setMessage] = useState("");
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSending(true);

        try {
            const response = await fetch("/api/public/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to send message");
            }

            setSent(true);
            setMessage("");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong");
        } finally {
            setSending(false);
        }
    };

    if (status === "loading") {
        return (
            <div className="text-center py-12">
                <div className="w-8 h-8 mx-auto mb-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                <p className="text-foreground-muted text-sm">Loading...</p>
            </div>
        );
    }

    if (!session) {
        return (
            <div className="text-center py-10">
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <svg className="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                </div>
                <h2 className="text-xl font-semibold mb-2">Sign in to send a message</h2>
                <p className="text-foreground-muted mb-8 text-sm leading-relaxed max-w-sm mx-auto">
                    Please sign in with your Google account so I know who I&apos;m talking to and can reply to you.
                </p>
                <button
                    onClick={() => signIn("google")}
                    className="inline-flex items-center justify-center gap-3 bg-white hover:bg-gray-100 text-gray-900 font-medium py-3 px-6 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-white/10"
                >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Sign in with Google
                </button>
            </div>
        );
    }

    if (sent) {
        return (
            <div className="text-center py-10">
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                    <svg className="w-7 h-7 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h2 className="text-xl font-semibold mb-2">Message Sent!</h2>
                <p className="text-foreground-muted mb-8 text-sm">
                    Thanks for reaching out. I&apos;ll get back to you at <span className="text-foreground">{session.user.email}</span> soon.
                </p>
                <button
                    onClick={() => setSent(false)}
                    className="btn-secondary"
                >
                    Send Another Message
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit}>
            {/* Signed-in user info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-white/[0.03] rounded-xl mb-6 border border-white/[0.06]">
                <div className="flex items-center gap-3">
                    {session.user.image && (
                        <img
                            src={session.user.image}
                            alt={session.user.name || ""}
                            className="w-10 h-10 rounded-xl shrink-0"
                        />
                    )}
                    <div className="min-w-0">
                        <p className="font-medium text-sm truncate">{session.user.name}</p>
                        <p className="text-xs text-foreground-muted truncate">{session.user.email}</p>
                    </div>
                </div>
                <button
                    type="button"
                    onClick={() => {
                        const { signOut } = require("next-auth/react");
                        signOut();
                    }}
                    className="text-xs text-red-400/80 hover:text-red-400 hover:bg-red-500/10 px-3 py-1.5 rounded-lg transition-all duration-200 border border-red-500/20 w-fit"
                >
                    Switch Account
                </button>
            </div>

            <div className="mb-6">
                <label htmlFor="message" className="block text-sm font-medium mb-2 text-foreground-muted">
                    Your Message
                </label>
                <textarea
                    id="message"
                    rows={6}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Hi Arpit, I'd like to discuss..."
                    className="input resize-y font-light"
                    required
                    minLength={10}
                />
            </div>

            {error && (
                <div className="mb-5 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                    {error}
                </div>
            )}

            <button
                type="submit"
                disabled={sending || message.trim().length < 10}
                className="btn-primary w-full disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none"
            >
                {sending ? (
                    <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Sending...
                    </span>
                ) : (
                    <span className="flex items-center justify-center gap-2">
                        Send Message
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </span>
                )}
            </button>
        </form>
    );
}
