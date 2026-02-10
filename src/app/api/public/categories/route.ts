import { NextResponse } from "next/server";
import { categoryService } from "@/modules/categories";

// Disable caching - revalidate on every request
export const revalidate = 0;

export async function GET() {
    try {
        const categories = await categoryService.getAllCategories();
        return NextResponse.json(categories);
    } catch (error) {
        console.error("Error fetching categories:", error);
        return NextResponse.json(
            { error: "Failed to fetch categories" },
            { status: 500 }
        );
    }
}
