"use client";

import { useState, useRef } from "react";

export default function AdminSettingsPage() {
    const [exporting, setExporting] = useState(false);
    const [importing, setImporting] = useState(false);
    const [message, setMessage] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleExport = async () => {
        setExporting(true);
        setMessage("");

        try {
            const response = await fetch("/api/shadow/admin/backup");
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `portfolio-backup-${new Date().toISOString().split("T")[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            setMessage("Backup downloaded successfully!");
        } catch {
            setMessage("Failed to export backup");
        } finally {
            setExporting(false);
        }
    };

    const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!confirm("This will replace ALL existing data. Are you sure?")) {
            e.target.value = "";
            return;
        }

        setImporting(true);
        setMessage("");

        try {
            const text = await file.text();
            const data = JSON.parse(text);

            const response = await fetch("/api/shadow/admin/backup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || "Failed to import");
            }

            setMessage(result.message || "Data restored successfully!");
        } catch (err) {
            setMessage(err instanceof Error ? err.message : "Failed to import backup");
        } finally {
            setImporting(false);
            e.target.value = "";
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8">Settings</h1>

            {/* Backup Section */}
            <div className="card mb-8">
                <h2 className="text-xl font-semibold mb-4">Data Backup</h2>
                <p className="text-foreground-muted mb-4">
                    Download a complete backup of your portfolio data as a JSON file.
                    Store this safely in Google Drive or a private GitHub repo.
                </p>
                <button
                    onClick={handleExport}
                    disabled={exporting}
                    className="btn-primary"
                >
                    {exporting ? "Exporting..." : "Export Portfolio JSON"}
                </button>
            </div>

            {/* Restore Section */}
            <div className="card mb-8">
                <h2 className="text-xl font-semibold mb-4">Restore Data</h2>
                <p className="text-foreground-muted mb-4">
                    Upload a previously exported JSON backup to restore your portfolio.
                    <span className="text-red-400 font-medium"> Warning: This will replace all existing data!</span>
                </p>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImport}
                    accept=".json"
                    className="hidden"
                />
                <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={importing}
                    className="btn-secondary"
                >
                    {importing ? "Importing..." : "Import Portfolio JSON"}
                </button>
            </div>

            {/* Message */}
            {message && (
                <div
                    className={`p-4 rounded-lg ${message.includes("success") || message.includes("Successfully")
                            ? "bg-green-500/10 text-green-400"
                            : "bg-red-500/10 text-red-400"
                        }`}
                >
                    {message}
                </div>
            )}

            {/* Monthly Reminder */}
            <div className="card bg-primary/10 border-primary/20">
                <h3 className="font-semibold mb-2">📅 Monthly Backup Reminder</h3>
                <p className="text-foreground-muted text-sm">
                    Set a monthly reminder to export your backup. It takes 30 seconds and gives you peace of mind.
                    Store backups in Google Drive or a private GitHub repository.
                </p>
            </div>
        </div>
    );
}
