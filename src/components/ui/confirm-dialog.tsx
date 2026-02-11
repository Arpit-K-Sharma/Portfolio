"use client";

import React from "react";

interface ConfirmDialogProps {
    open: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    variant?: "danger" | "default";
    onConfirm: () => void;
    onCancel: () => void;
}

export function ConfirmDialog({
    open,
    title,
    message,
    confirmLabel = "Confirm",
    cancelLabel = "Cancel",
    variant = "default",
    onConfirm,
    onCancel,
}: ConfirmDialogProps) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[9998] flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
                onClick={onCancel}
            />

            {/* Dialog */}
            <div className="relative bg-neutral-900 border border-white/10 rounded-2xl shadow-2xl w-full max-w-md mx-4 animate-in zoom-in-95 fade-in duration-200">
                <div className="p-6">
                    {/* Icon */}
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${variant === "danger" ? "bg-red-500/10" : "bg-primary/10"
                        }`}>
                        {variant === "danger" ? (
                            <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                                <path d="M12 9v4" /><path d="M12 17h.01" />
                            </svg>
                        ) : (
                            <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10" /><path d="M12 8v4" /><path d="M12 16h.01" />
                            </svg>
                        )}
                    </div>

                    {/* Content */}
                    <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
                    <p className="text-sm text-foreground-muted leading-relaxed">{message}</p>
                </div>

                {/* Actions */}
                <div className="flex gap-3 p-4 pt-0 justify-end">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 text-sm font-medium rounded-xl bg-white/5 border border-white/10 text-foreground-muted hover:bg-white/10 hover:text-foreground transition-all"
                    >
                        {cancelLabel}
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`px-4 py-2 text-sm font-medium rounded-xl transition-all ${variant === "danger"
                                ? "bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30"
                                : "bg-primary/20 border border-primary/30 text-primary hover:bg-primary/30"
                            }`}
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}
