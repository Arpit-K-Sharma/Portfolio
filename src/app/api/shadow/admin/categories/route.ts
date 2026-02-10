import { NextResponse } from "next/server";
import { categoryService } from "@/modules/categories";
import { requireAdminApi } from "@/lib/admin-middleware";
import { revalidatePath } from "next/cache";

export async function GET() {
    const error = await requireAdminApi();
    if (error) return error;

    try {
        const categories = await categoryService.getAllCategories();
        return NextResponse.json(categories);
    } catch (err) {
        console.error("Error fetching categories:", err);
        return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const error = await requireAdminApi();
    if (error) return error;

    try {
        const body = await request.json();
        const category = await categoryService.createCategory(body);

        // Clear cache for projects page where categories are listed
        revalidatePath("/projects");

        return NextResponse.json(category, { status: 201 });
    } catch (err) {
        console.error("Error creating category:", err);
        return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
    }
}
