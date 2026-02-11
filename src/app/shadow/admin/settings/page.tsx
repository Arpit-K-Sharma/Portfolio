"use client";

import { useState, useRef, useEffect } from "react";
import { useToast } from "@/components/ui/toast-context";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

interface AppSettings {
    enableSearchFilters?: string;
}

export default function AdminSettingsPage() {
    const [exporting, setExporting] = useState(false);
    const [importing, setImporting] = useState(false);
    const [message, setMessage] = useState("");
    const [pendingFile, setPendingFile] = useState<File | null>(null);
    const [showImportConfirm, setShowImportConfirm] = useState(false);
    const [settings, setSettings] = useState<AppSettings>({});
    const [savingSettings, setSavingSettings] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { showToast } = useToast();

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const response = await fetch("/api/shadow/admin/settings");
            const data = await response.json();
            setSettings(data);
        } catch (error) {
            console.error("Failed to fetch settings:", error);
        }
    };

    const updateSetting = async (key: string, value: string) => {
        setSavingSettings(true);
        try {
            await fetch("/api/shadow/admin/settings", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ key, value }),
            });
            setSettings((prev) => ({ ...prev, [key]: value }));
            showToast("Setting updated", "success");
        } catch (error) {
            console.error("Failed to update setting:", error);
            showToast("Failed to update setting", "error");
        } finally {
            setSavingSettings(false);
        }
    };

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

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setPendingFile(file);
        setShowImportConfirm(true);
        e.target.value = "";
    };

    const handleImport = async () => {
        if (!pendingFile) return;
        setShowImportConfirm(false);
        setImporting(true);
        setMessage("");

        try {
            const text = await pendingFile.text();
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

            showToast(result.message || "Data restored successfully!", "success");
            setMessage(result.message || "Data restored successfully!");
        } catch (err) {
            const errMsg = err instanceof Error ? err.message : "Failed to import backup";
            showToast(errMsg, "error");
            setMessage(errMsg);
        } finally {
            setImporting(false);
            setPendingFile(null);
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8">Settings</h1>

            {/* UI Preferences Section */}
            <div className="card mb-8">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <span className="bg-primary/20 text-primary p-1.5 rounded-lg">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                        </svg>
                    </span>
                    UI Preferences
                </h2>

                <div className="space-y-6">
                    <div className="flex items-start justify-between p-4 rounded-lg bg-white/[0.02] border border-white/[0.05]">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-medium">Project Search & Filters</h3>
                                <span className={`text-xs px-2 py-0.5 rounded-full ${settings.enableSearchFilters === "false"
                                        ? "bg-yellow-500/10 text-yellow-400"
                                        : "bg-green-500/10 text-green-400"
                                    }`}>
                                    {settings.enableSearchFilters === "false" ? "Disabled" : "Enabled"}
                                </span>
                            </div>
                            <p className="text-sm text-foreground-muted">
                                Show or hide the search bar and filter options on the projects page.
                                Disable this when you have a small number of projects to keep the UI clean.
                            </p>
                        </div>
                        <button
                            onClick={() => updateSetting("enableSearchFilters", settings.enableSearchFilters === "false" ? "true" : "false")}
                            disabled={savingSettings}
                            className={`ml-6 relative inline-flex h-7 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-background ${settings.enableSearchFilters === "false"
                                    ? "bg-white/10"
                                    : "bg-primary"
                                }`}
                        >
                            <span
                                className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${settings.enableSearchFilters === "false"
                                        ? "translate-x-0"
                                        : "translate-x-7"
                                    }`}
                            />
                        </button>
                    </div>
                </div>
            </div>

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
                    onChange={handleFileSelect}
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
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" /></svg>
                    Monthly Backup Reminder
                </h3>
                <p className="text-foreground-muted text-sm">
                    Set a monthly reminder to export your backup. It takes 30 seconds and gives you peace of mind.
                    Store backups in Google Drive or a private GitHub repository.
                </p>
            </div>

            <ConfirmDialog
                open={showImportConfirm}
                title="Replace All Data"
                message="This will replace ALL existing data with the contents of the backup file. This action cannot be undone. Are you absolutely sure?"
                confirmLabel="Replace All Data"
                cancelLabel="Cancel"
                variant="danger"
                onConfirm={handleImport}
                onCancel={() => { setShowImportConfirm(false); setPendingFile(null); }}
            />
        </div>
    );
}
