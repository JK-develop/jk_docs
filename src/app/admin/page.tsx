import { getCategories } from "@/lib/actions";
import Link from "next/link";
import { AdminClientList } from "./AdminClientList";

export default async function AdminPage() {
  const categories = await getCategories();

  return (
    <div className="prose" style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h2>Admin Management</h2>
        <div>
          <Link href="/admin/editor" className="btn-primary" style={{ textDecoration: 'none', marginLeft: '12px', marginRight: '12px' }}>
            + Add New Guide
          </Link>

          <Link href="/admin/category" className="btn-secondary" style={{ textDecoration: 'none' }}>
            + Add Category
          </Link>
        </div>
      </div>

      <AdminClientList categories={categories} />
    </div>
  );
}
