import { NextResponse } from "next/server";
import { categoryService } from "@/modules/categories";
import { requireAdminApi } from "@/lib/admin-middleware";
import { revalidatePath } from "next/cache";

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const error = await requireAdminApi();
    if (error) return error;

    try {
        const { id } = await params;
        const body = await request.json();
        const category = await categoryService.updateCategory(id, body);

        // Clear cache
        revalidatePath("/projects");

        return NextResponse.json(category);
    } catch (err) {
        console.error("Error updating category:", err);
        return NextResponse.json({ error: "Failed to update category" }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const error = await requireAdminApi();
    if (error) return error;

    try {
        const { id } = await params;
        await categoryService.deleteCategory(id);

        // Clear cache
        revalidatePath("/projects");

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error("Error deleting category:", err);
        return NextResponse.json({ error: "Failed to delete category" }, { status: 500 });
    }
}
