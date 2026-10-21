import { NavLink } from "@/components/layout/nav-link";
import { AdminGate } from "@/features/auth/components/admin-gate";

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    <AdminGate>
      <nav aria-label="Admin" className="mb-6 flex flex-wrap gap-1 border-b border-border pb-3">
        <NavLink href="/admin/users">Users</NavLink>
        <NavLink href="/admin/notes">All notes</NavLink>
        <NavLink href="/admin/interests">Interests</NavLink>
      </nav>
      {children}
    </AdminGate>
  );
}
