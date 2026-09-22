// Tema / şablon / yerleşim kataloğu — /api/sync/catalog'tan okunur.
//
// NEDEN KOPYALANMIYOR: 10 tema + 13 şablon + 10 yerleşim engine/*.ts içinde
// yaşıyor. Listeyi buraya kopyalasak stüdyoya eklenen her tema MCP'de eksik
// kalırdı. Katalog süreç ömrü boyunca bir kez çekilir (statik veri).

import { api } from "./studio.js";

export type ThemeInfo = {
  id: string;
  name: string;
  accent: string;
  defaultLayout: string;
  deviceMode: "2d" | "3d";
  headlineFont: string;
  backgroundKind: string;
  altCount: number;
};

export type SlideStyle = {
  themeId: string;
  layout: string;
  background?: Record<string, unknown>;
  device?: Record<string, unknown>;
};

export type TemplateInfo = {
  id: string;
  name: string;
  hint: string;
  color: string;
  kategori: string;
  themeId: string;
  defaultCount: number;
  styles: SlideStyle[];
};

export type LayoutInfo = {
  id: string;
  text: { x: number; y: number; w: number; align: string };
  device: { cx: number; cy: number; scale: number; rotation?: number };
  device2?: { cx: number; cy: number; scale: number; rotation?: number };
  textZ?: string;
};

export type SizeInfo = { id: string; w: number; h: number; label: string };

export type Catalog = {
  themes: ThemeInfo[];
  templates: TemplateInfo[];
  layouts: LayoutInfo[];
  sizes: SizeInfo[];
};

let cached: Catalog | null = null;
let cachedAt = 0;
/** Kısa TTL: stüdyoya tema eklenirse MCP'yi yeniden başlatmaya gerek kalmasın. */
const TTL_MS = 60_000;

export async function catalog(): Promise<Catalog> {
  if (cached && Date.now() - cachedAt < TTL_MS) return cached;
  cached = await api<Catalog>("/api/sync/catalog");
  cachedAt = Date.now();
  return cached;
}

export async function themeIds(): Promise<string[]> {
  return (await catalog()).themes.map((t) => t.id);
}

export async function layoutIds(): Promise<string[]> {
  return (await catalog()).layouts.map((l) => l.id);
}

export async function sizeIds(): Promise<string[]> {
  return (await catalog()).sizes.map((s) => s.id);
}
