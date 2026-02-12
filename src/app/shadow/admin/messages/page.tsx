"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/toast-context";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

interface Message {
    id: string;
    senderName: string;
    senderEmail: string;
    message: string;
    isRead: boolean;
    createdAt: string;
}

export default function AdminMessagesPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
    const { showToast } = useToast();

    const fetchMessages = async () => {
        const res = await fetch("/api/shadow/admin/messages");
        const data = await res.json();
        setMessages(data.messages || []);
        setUnreadCount(data.unreadCount || 0);
    };

    useEffect(() => {
        fetchMessages();
    }, []);

    const handleMarkAsRead = async (id: string) => {
        await fetch(`/api/shadow/admin/messages/${id}`, { method: "PATCH" });
        await fetchMessages();
    };

    const handleDelete = async (id: string) => {
        try {
            await fetch(`/api/shadow/admin/messages/${id}`, { method: "DELETE" });
            await fetchMessages();
            showToast("Message deleted", "success");
        } catch (error) {
            console.error(error);
            showToast("Failed to delete message", "error");
        } finally {
            setDeleteTarget(null);
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold">Messages</h1>
                {unreadCount > 0 && (
                    <span className="badge bg-primary text-white px-3 py-1">
                        {unreadCount} unread
                    </span>
                )}
            </div>

            {messages.length === 0 ? (
                <div className="card text-center py-12">
                    <p className="text-foreground-muted">No messages yet.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`card p-4 md:p-6 ${!message.isRead ? "border-primary/50 ring-1 ring-primary/20" : ""}`}
                        >
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-semibold text-foreground">{message.senderName}</span>
                                        {!message.isRead && (
                                            <span className="badge text-[10px] bg-primary text-white py-0.5 px-2">New</span>
                                        )}
                                    </div>
                                    <a
                                        href={`mailto:${message.senderEmail}`}
                                        className="text-sm text-primary hover:text-primary-light transition-colors break-all"
                                    >
                                        {message.senderEmail}
                                    </a>
                                </div>
                                <span className="text-xs md:text-sm text-foreground-muted whitespace-nowrap">
                                    {new Date(message.createdAt).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "short",
                                        day: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </span>
                            </div>

                            <p className="text-foreground-muted text-sm md:text-base whitespace-pre-wrap mb-6 leading-relaxed">
                                {message.message}
                            </p>

                            <div className="flex flex-wrap gap-3 pt-4 border-t border-white/5">
                                <a
                                    href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(message.senderEmail)}&su=${encodeURIComponent('Re: Contact from Portfolio')}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn-primary flex-1 sm:flex-none text-xs md:text-sm py-2 px-4 whitespace-nowrap"
                                >
                                    Reply via Email
                                </a>
                                {!message.isRead && (
                                    <button
                                        onClick={() => handleMarkAsRead(message.id)}
                                        className="btn-secondary flex-1 sm:flex-none text-xs md:text-sm py-2 px-4 whitespace-nowrap"
                                    >
                                        Mark as Read
                                    </button>
                                )}
                                <button
                                    onClick={() => setDeleteTarget(message.id)}
                                    className="btn-ghost flex-1 sm:flex-none text-xs md:text-sm py-2 px-4 text-red-400 hover:text-red-300 hover:bg-red-500/10 whitespace-nowrap"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Delete Confirmation Dialog */}
            <ConfirmDialog
                open={!!deleteTarget}
                title="Delete Message"
                message="Are you sure you want to delete this message? This cannot be undone."
                confirmLabel="Delete"
                cancelLabel="Cancel"
                variant="danger"
                onConfirm={() => deleteTarget && handleDelete(deleteTarget)}
                onCancel={() => setDeleteTarget(null)}
            />
        </div>
    );
}
