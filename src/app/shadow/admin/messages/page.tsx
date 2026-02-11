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
                            className={`card ${!message.isRead ? "border-primary/50" : ""}`}
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-semibold">{message.senderName}</span>
                                        {!message.isRead && (
                                            <span className="badge text-xs">New</span>
                                        )}
                                    </div>
                                    <a
                                        href={`mailto:${message.senderEmail}`}
                                        className="text-sm text-primary hover:underline"
                                    >
                                        {message.senderEmail}
                                    </a>
                                </div>
                                <span className="text-sm text-foreground-muted">
                                    {new Date(message.createdAt).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "short",
                                        day: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </span>
                            </div>

                            <p className="text-foreground-muted whitespace-pre-wrap mb-4">
                                {message.message}
                            </p>

                            <div className="flex gap-4 pt-4 border-t border-border">
                                <a
                                    href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(message.senderEmail)}&su=${encodeURIComponent('Re: Contact from Portfolio')}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn-primary text-sm"
                                >
                                    Reply via Email
                                </a>
                                {!message.isRead && (
                                    <button
                                        onClick={() => handleMarkAsRead(message.id)}
                                        className="btn-secondary text-sm"
                                    >
                                        Mark as Read
                                    </button>
                                )}
                                <button
                                    onClick={() => setDeleteTarget(message.id)}
                                    className="btn-ghost text-sm text-red-400 hover:text-red-300"
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
