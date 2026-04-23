import { getCategories } from "@/lib/actions";
import { EditorClient } from "./EditorClient";
import { prisma } from "@/lib/prisma";
import { getServerTranslation } from "@/lib/i18n/server";

export default async function EditorPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { t } = await getServerTranslation();
  const resolvedParams = await searchParams;
  const categories = await getCategories();
  let guide = null;

  if (resolvedParams.id) {
    guide = await prisma.guide.findUnique({
      where: { id: parseInt(resolvedParams.id) },
      include: { categories: true },
    });
  }

  return (
    <div className="max-w-5xl mx-auto py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-extrabold text-app tracking-tight mb-2">
          {guide ? t("edit_guide_title") : t("new_guide_title")} <span className="accent-green">Guide</span>
        </h1>
        <p className="text-muted">{t("guide_knowledge_tagline")}</p>
      </div>
      
      <div className="glass-panel rounded-3xl p-8 border border-white/10 shadow-2xl">
        <EditorClient categories={categories} initialData={guide} />
      </div>
    </div>
  );
}
