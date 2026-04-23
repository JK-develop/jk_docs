type CategoryLike = {
  id: number | string;
  name: string;
  nameFa?: string | null;
  guides?: any[];
};

const DEFAULT_CATEGORIES: CategoryLike[] = [
  { id: -101, name: "Frontend", nameFa: "فرانت‌اند", guides: [] },
  { id: -102, name: "Backend", nameFa: "بک‌اند", guides: [] },
  { id: -103, name: "DevOps", nameFa: "دوآپس", guides: [] },
  { id: -104, name: "Database", nameFa: "پایگاه داده", guides: [] },
  { id: -105, name: "Security", nameFa: "امنیت", guides: [] },
  { id: -107, name: "Tools", nameFa: "ابزارها", guides: [] },
  { id: -108, name: "Design", nameFa: "طراحی", guides: [] },
];

export function withDefaultCategories<T extends CategoryLike>(categories: T[]): (T | CategoryLike)[] {
  const merged: (T | CategoryLike)[] = [...categories];
  for (const c of DEFAULT_CATEGORIES) {
    if (!merged.some((m) => m.name === c.name)) merged.push(c);
  }
  return merged;
}
