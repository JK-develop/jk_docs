"use server";

import { prisma } from "./prisma";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function getCategories() {
  return await prisma.category.findMany({
    include: {
      guides: {
        include: {
          categories: true
        }
      },
    },
    orderBy: {
      id: "asc",
    },
  });
}

export async function getGuideBySlug(slug: string) {
  return await prisma.guide.findUnique({
    where: { slug },
    include: { categories: true },
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
    where: categoryId ? { categories: { some: { id: categoryId } } } : {},
    include: { categories: true },
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
    include: { categories: true },
    orderBy: { createdAt: "desc" },
    take: 10, // Limit results for the command palette
  });
}

// Admin Actions
export async function createCategory(data: { slug: string; name: string; icon?: string }) {
  console.log("DEBUG: prisma.category keys:", Object.keys(prisma.category));
  try {
    return await prisma.category.create({ 
      data: {
        name: data.name,
        slug: data.slug,
        icon: data.icon || "Layers"
      } 
    });
  } finally {
    revalidatePath("/");
    revalidatePath("/admin");
  }
}

export async function createGuide(data: {
  categoryIds: number[];
  slug: string;
  title: string;
  content: string;
  tags?: string;
}) {
  const { categoryIds, ...rest } = data;
  await prisma.guide.create({ 
    data: {
      ...rest,
      categories: {
        connect: categoryIds.map(id => ({ id }))
      }
    } 
  });
  revalidatePath("/");
  revalidatePath("/admin");
}

export async function updateGuide(id: number, data: {
  categoryIds?: number[];
  slug?: string;
  title?: string;
  content?: string;
  tags?: string;
}) {
  const { categoryIds, ...rest } = data;
  await prisma.guide.update({
    where: { id },
    data: {
      ...rest,
      categories: categoryIds ? {
        set: categoryIds.map(id => ({ id }))
      } : undefined
    },
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
export async function updateCategory(id: number, data: { name: string; slug: string; icon?: string }) {
  try {
    return await prisma.category.update({
      where: { id },
      data: {
        name: data.name,
        slug: data.slug,
        icon: data.icon
      },
    });
  } finally {
    revalidatePath("/");
    revalidatePath("/admin");
  }
}

export async function deleteCategory(id: number) {
  // Note: This might fail if there are guides linked to it, 
  // but Prisma schema should handle it or error out.
  await prisma.category.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin");
}

// Authentication
export async function loginAdmin(password: string) {
  if (password === process.env.ADMIN_PASSWORD) {
    const cookieStore = await cookies();
    cookieStore.set("admin_session", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });
    return { success: true };
  }
  return { success: false, error: "Invalid password" };
}

export async function logoutAdmin() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_session");
  redirect("/");
}

export async function isAdmin() {
  const cookieStore = await cookies();
  return cookieStore.get("admin_session")?.value === "true";
}
