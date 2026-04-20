import { prisma } from "@/lib/prisma";
import { HomePageClient } from "./HomePageClient";

export const dynamic = "force-dynamic";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;

  // Fetch initial guides from the database, newest first
  const guides = await prisma.guide.findMany({
    where: category ? { category: { name: category } } : {},
    include: { category: true },
    orderBy: { createdAt: "desc" },
    take: 9, // Initial load limit
  });

  return <HomePageClient guides={guides as any} />;
}
