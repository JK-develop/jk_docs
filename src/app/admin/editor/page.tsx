import { getCategories, getGuideBySlug } from "@/lib/actions";
import { EditorClient } from "./EditorClient";
import { prisma } from "@/lib/prisma";

export default async function EditorPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const resolvedParams = await searchParams;
  const categories = await getCategories();
  let guide = null;

  if (resolvedParams.id) {
    guide = await prisma.guide.findUnique({
      where: { id: parseInt(resolvedParams.id) },
    });
  }

  return (
    <div className="prose glass" style={{ padding: '32px', borderRadius: '16px', maxWidth: '1200px', margin: '0 auto' }}>
      <h2>{guide ? 'Edit Guide' : 'Add Guide'}</h2>
      <EditorClient categories={categories} initialData={guide} />
    </div>
  );
}
