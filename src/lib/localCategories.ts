export type LocalCategory = {
  id: string;
  name: string;
  iconKey: CategoryIconKey;
};

export type CategoryIconKey =
  | "database"
  | "server"
  | "code"
  | "globe"
  | "terminal"
  | "cpu";

const STORAGE_KEY = "jk-categories";
const UPDATED_EVENT = "jk-categories-updated";

export function emitCategoriesUpdated() {
  // same-tab listeners
  window.dispatchEvent(new Event(UPDATED_EVENT));
}

export function onCategoriesUpdated(handler: () => void) {
  const onCustom = () => handler();
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) handler();
  };

  window.addEventListener(UPDATED_EVENT, onCustom);
  window.addEventListener("storage", onStorage);

  return () => {
    window.removeEventListener(UPDATED_EVENT, onCustom);
    window.removeEventListener("storage", onStorage);
  };
}

export function loadLocalCategories(): LocalCategory[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed as LocalCategory[];
  } catch {
    return [];
  }
}

export function saveLocalCategory(input: { name: string; iconKey: CategoryIconKey }) {
  const name = input.name.trim();
  if (!name) return;

  const existing = loadLocalCategories();
  if (existing.some((c) => c.name.toLowerCase() === name.toLowerCase())) return;

  const category: LocalCategory = {
    id: `lc-${Date.now().toString(36)}-${Math.random().toString(16).slice(2)}`,
    name,
    iconKey: input.iconKey,
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify([category, ...existing]));
  emitCategoriesUpdated();
  return category;
}

