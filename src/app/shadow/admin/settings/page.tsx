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
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Settings</h1>

            {/* UI Preferences Section */}
            <section className="card p-6 md:p-8 mb-8 bg-card/30 border-white/5">
                <h2 className="text-xl font-bold mb-8 flex items-center gap-3">
                    <span className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                        </svg>
                    </span>
                    UI Preferences
                </h2>

                <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 rounded-2xl bg-white/[0.02] border border-white/5 gap-4">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <h3 className="font-bold text-foreground">Project Search & Filters</h3>
                                <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-lg ${settings.enableSearchFilters === "false"
                                    ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                                    : "bg-green-500/10 text-green-400 border border-green-500/20"
                                    }`}>
                                    {settings.enableSearchFilters === "false" ? "Disabled" : "Active"}
                                </span>
                            </div>
                            <p className="text-xs text-foreground-muted leading-relaxed max-w-md">
                                Show or hide the search bar and filter options on the projects page.
                                Useful for keeping the UI clean when you have only a few projects.
                            </p>
                        </div>
                        <button
                            onClick={() => updateSetting("enableSearchFilters", settings.enableSearchFilters === "false" ? "true" : "false")}
                            disabled={savingSettings}
                            className={`relative inline-flex h-8 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary/50 ${settings.enableSearchFilters === "false"
                                ? "bg-neutral-800"
                                : "bg-primary shadow-lg shadow-primary/20"
                                }`}
                        >
                            <span
                                className={`pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow-xl ring-0 transition duration-300 ease-in-out ${settings.enableSearchFilters === "false"
                                    ? "translate-x-0"
                                    : "translate-x-6"
                                    }`}
                            />
                        </button>
                    </div>
                </div>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                {/* Backup Section */}
                <section className="card p-6 md:p-8 bg-card/30 border-white/5 flex flex-col h-full">
                    <h2 className="text-xl font-bold mb-4">Export Data</h2>
                    <p className="text-xs text-foreground-muted mb-8 leading-relaxed flex-1">
                        Download a complete snapshot of your portfolio data as a JSON file.
                        It is recommended to store backups in a secure cloud storage.
                    </p>
                    <button
                        onClick={handleExport}
                        disabled={exporting}
                        className="btn-primary w-full py-3"
                    >
                        {exporting ? "Preparing JSON..." : "Download Backup"}
                    </button>
                </section>

                {/* Restore Section */}
                <section className="card p-6 md:p-8 bg-card/30 border-white/5 flex flex-col h-full">
                    <h2 className="text-xl font-bold mb-4">Restore Data</h2>
                    <p className="text-xs text-foreground-muted mb-8 leading-relaxed flex-1">
                        Upload a previously exported JSON backup to restore your data.
                        <span className="text-red-400 font-bold block mt-1">Caution: This will overwrite ALL current information.</span>
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
                        className="btn-secondary w-full py-3"
                    >
                        {importing ? "Processing..." : "Import Backup"}
                    </button>
                </section>
            </div>

            {/* Message Area */}
            {message && (
                <div
                    className={`p-4 rounded-2xl mb-8 border animate-in fade-in slide-in-from-top-2 duration-300 ${message.includes("success") || message.includes("Successfully")
                        ? "bg-green-500/10 text-green-400 border-green-500/20"
                        : "bg-red-500/10 text-red-400 border-red-500/20"
                        }`}
                >
                    <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${message.includes("success") || message.includes("Successfully") ? "bg-green-400 animate-pulse" : "bg-red-400"}`}></span>
                        <p className="text-sm font-medium">{message}</p>
                    </div>
                </div>
            )}

            {/* Monthly Reminder */}
            <div className="card p-6 border-primary/20 bg-primary/[0.03] relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5">
                    <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" /></svg>
                </div>
                <h3 className="font-bold text-primary mb-2 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><rect width="18" height="18" x="3" y="4" rx="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" /></svg>
                    Pro Tip: Monthly Backups
                </h3>
                <p className="text-xs text-foreground-muted leading-relaxed relative z-10">
                    Set a recurring calendar reminder to export your data. It takes less than a minute and ensures you never lose years of curated content.
                    Store backups in a private GitHub repository or secure cloud drive.
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
