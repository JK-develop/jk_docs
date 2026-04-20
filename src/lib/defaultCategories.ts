type CategoryLike = {
  id: number | string;
  name: string;
  guides?: any[];
};

const DEFAULT_CATEGORIES: CategoryLike[] = [
  { id: -101, name: "Frontend", guides: [] },
  { id: -102, name: "Backend", guides: [] },
  { id: -103, name: "DevOps", guides: [] },
  { id: -104, name: "Database", guides: [] },
  { id: -105, name: "Security", guides: [] },
  { id: -107, name: "Tools", guides: [] },
  { id: -108, name: "Design", guides: [] },
];

export function withDefaultCategories<T extends CategoryLike>(categories: T[]): (T | CategoryLike)[] {
  const merged: (T | CategoryLike)[] = [...categories];
  for (const c of DEFAULT_CATEGORIES) {
    if (!merged.some((m) => m.name === c.name)) merged.push(c);
  }
  return merged;
}

