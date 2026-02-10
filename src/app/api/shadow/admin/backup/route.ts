import { NextResponse } from "next/server";
import { backupService } from "@/modules/backup";
import { requireAdminApi } from "@/lib/admin-middleware";

export async function GET() {
    const error = await requireAdminApi();
    if (error) return error;

    try {
        const data = await backupService.exportData();

        // Return as downloadable JSON file
        return new NextResponse(JSON.stringify(data, null, 2), {
            headers: {
                "Content-Type": "application/json",
                "Content-Disposition": `attachment; filename="portfolio-backup-${new Date().toISOString().split("T")[0]}.json"`,
            },
        });
    } catch (err) {
        console.error("Error exporting data:", err);
        return NextResponse.json({ error: "Failed to export data" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const error = await requireAdminApi();
    if (error) return error;

    try {
        const data = await request.json();
        const result = await backupService.importData(data);

        if (!result.success) {
            return NextResponse.json({ error: result.message }, { status: 400 });
        }

        return NextResponse.json(result);
    } catch (err) {
        console.error("Error importing data:", err);
        return NextResponse.json({ error: "Failed to import data" }, { status: 500 });
    }
}
