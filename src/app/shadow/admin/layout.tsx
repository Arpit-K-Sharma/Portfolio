import { requireAdmin } from "@/lib/auth";
import { AdminLayoutClient } from "@/components/admin-layout-client";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Protect all admin routes
    await requireAdmin();

    return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
