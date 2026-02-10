"use client";

import { useState, useEffect } from "react";

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
        if (!confirm("Delete this message?")) return;
        await fetch(`/api/shadow/admin/messages/${id}`, { method: "DELETE" });
        await fetchMessages();
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
                                    href={`mailto:${message.senderEmail}?subject=Re: Contact from Portfolio`}
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
                                    onClick={() => handleDelete(message.id)}
                                    className="btn-ghost text-sm text-red-400 hover:text-red-300"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
