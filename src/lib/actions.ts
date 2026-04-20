"use server";

import { prisma } from "./prisma";
import { revalidatePath } from "next/cache";

export async function getCategories() {
  return await prisma.category.findMany({
    include: {
      guides: true,
    },
    orderBy: {
      id: "asc",
    },
  });
}

export async function getGuideBySlug(slug: string) {
  return await prisma.guide.findUnique({
    where: { slug },
    include: { category: true },
  });
}

export async function getGuides({ 
  skip = 0, 
  take = 9, 
  categoryId 
}: { 
  skip?: number; 
  take?: number; 
  categoryId?: number;
} = {}) {
  return await prisma.guide.findMany({
    where: categoryId ? { categoryId } : {},
    include: { category: true },
    orderBy: { createdAt: "desc" },
    skip,
    take,
  });
}

export async function searchGuides(query: string) {
  if (!query) return [];
  const q = query.trim();
  
  return await prisma.guide.findMany({
    where: {
      OR: [
        { title: { contains: q } },
        { content: { contains: q } },
        { tags: { contains: q } },
      ],
    },
    include: { category: true },
    orderBy: { createdAt: "desc" },
    take: 10, // Limit results for the command palette
  });
}

// Admin Actions
export async function createCategory(data: { slug: string; name: string }) {
  await prisma.category.create({ data });
  revalidatePath("/");
  revalidatePath("/admin");
}

export async function createGuide(data: {
  categoryId: number;
  slug: string;
  title: string;
  content: string;
}) {
  await prisma.guide.create({ data });
  revalidatePath("/");
  revalidatePath("/admin");
}

export async function updateGuide(id: number, data: any) {
  await prisma.guide.update({
    where: { id },
    data,
  });
  revalidatePath("/");
  revalidatePath(`/guide/${data.slug || id}`);
  revalidatePath("/admin");
}

export async function deleteGuide(id: number) {
  await prisma.guide.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin");
}

