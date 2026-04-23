import { prisma } from "@/lib/prisma";
import { HomePageClient } from "./HomePageClient";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const cookieStore = await cookies();
  const lang = cookieStore.get("lang")?.value || "en";

  // Fetch initial guides from the database, newest first
  const guides = await prisma.guide.findMany({
    where: category ? { categories: { some: { name: category } } } : {},
    include: { categories: true },
    orderBy: { createdAt: "desc" },
    take: 9, // Initial load limit
  });

  return <HomePageClient guides={guides as any} />;
}
