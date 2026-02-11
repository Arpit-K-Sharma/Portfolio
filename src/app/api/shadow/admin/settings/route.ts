import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { settingsService } from "@/modules/settings";
import { Setting } from "@/modules/settings/settings.types";

export async function GET() {
    const session = await auth();
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const settings = (await settingsService.getAllSettings()) as Setting[];
        const settingsMap = settings.reduce<Record<string, string>>((acc, setting) => {
            acc[setting.key] = setting.value;
            return acc;
        }, {});

        return NextResponse.json(settingsMap);
    } catch (error) {
        console.error("Failed to fetch settings:", error);
        return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
    }
}

export async function PATCH(request: Request) {
    const session = await auth();
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { key, value } = body;

        if (!key || value === undefined) {
            return NextResponse.json({ error: "Key and value are required" }, { status: 400 });
        }

        await settingsService.setSetting(key, value);
        return NextResponse.json({ success: true, key, value });
    } catch (error) {
        console.error("Failed to update setting:", error);
        return NextResponse.json({ error: "Failed to update setting" }, { status: 500 });
    }
}
