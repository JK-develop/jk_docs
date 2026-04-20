export type LocalGuide = {
  id: string;
  slug: string;
  title: string;
  description: string;
  content: string;
  category?: { id?: number | string; name: string };
  categories?: { id?: number | string; name: string }[];
  tags: string[];
  createdAt: string; // ISO
};

const STORAGE_KEY = "jk-guides";
const UPDATED_EVENT = "jk-guides-updated";

const DEFAULT_GUIDES: LocalGuide[] = [
  {
    id: "mock-1",
    slug: "nginx-reverse-proxy-docker",
    title: "Nginx Reverse Proxy with Docker",
    description: "Set up Nginx as a reverse proxy in front of a Dockerized app, with clean routing and headers.",
    content: "## Summary\nUse Nginx to route traffic to your app container.\n",
    categories: [{ name: "DevOps" }],
    tags: ["docker", "nginx", "reverse-proxy"],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
  {
    id: "mock-2",
    slug: "node-streams-backpressure",
    title: "Node.js Streams & Backpressure",
    description: "A practical mental model for streams, flow control, and how to avoid memory blowups in Node.",
    content: "## Key idea\nBackpressure is the signal to slow down producers.\n",
    categories: [{ name: "Backend" }],
    tags: ["node", "streams", "performance"],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
  },
  {
    id: "mock-3",
    slug: "react-useeffect-gotchas",
    title: "React useEffect Gotchas",
    description: "Common pitfalls with dependencies, stale closures, and how to keep effects predictable.",
    content: "## Rule\nTreat dependencies as inputs.\n",
    categories: [{ name: "Frontend" }],
    tags: ["react", "hooks", "useeffect"],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
  },
];

export function emitGuidesUpdated() {
  // same-tab listeners
  window.dispatchEvent(new Event(UPDATED_EVENT));
}

export function onGuidesUpdated(handler: () => void) {
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

export function loadLocalGuides(): LocalGuide[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_GUIDES));
      return DEFAULT_GUIDES;
    }
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_GUIDES));
      return DEFAULT_GUIDES;
    }
    return parsed as LocalGuide[];
  } catch {
    return DEFAULT_GUIDES;
  }
}

export function saveLocalGuide(guide: LocalGuide) {
  const guides = loadLocalGuides();
  guides.unshift(guide);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(guides));
  emitGuidesUpdated();
}

