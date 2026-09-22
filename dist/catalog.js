// Tema / şablon / yerleşim kataloğu — /api/sync/catalog'tan okunur.
//
// NEDEN KOPYALANMIYOR: 10 tema + 13 şablon + 10 yerleşim engine/*.ts içinde
// yaşıyor. Listeyi buraya kopyalasak stüdyoya eklenen her tema MCP'de eksik
// kalırdı. Katalog süreç ömrü boyunca bir kez çekilir (statik veri).
import { api } from "./studio.js";
let cached = null;
let cachedAt = 0;
/** Kısa TTL: stüdyoya tema eklenirse MCP'yi yeniden başlatmaya gerek kalmasın. */
const TTL_MS = 60_000;
export async function catalog() {
    if (cached && Date.now() - cachedAt < TTL_MS)
        return cached;
    cached = await api("/api/sync/catalog");
    cachedAt = Date.now();
    return cached;
}
export async function themeIds() {
    return (await catalog()).themes.map((t) => t.id);
}
export async function layoutIds() {
    return (await catalog()).layouts.map((l) => l.id);
}
export async function sizeIds() {
    return (await catalog()).sizes.map((s) => s.id);
}
//# sourceMappingURL=catalog.js.map