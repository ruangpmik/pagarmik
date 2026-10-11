import { getStore } from "@/lib/data/store";

export default function sitemap() {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const store = getStore();
  const staticRoutes = ["", "/legal-search", "/regulasi", "/pasal", "/ai", "/analisis-kasus", "/timeline", "/grafik", "/topik", "/artikel", "/bandingkan"];
  return [
    ...staticRoutes.map((r) => ({ url: `${base}${r || "/"}`, lastModified: new Date() })),
    ...store.regulations().map((r) => ({ url: `${base}/regulasi/${r.slug}`, lastModified: new Date() })),
    ...store.topics().map((t) => ({ url: `${base}/topik/${t.slug}`, lastModified: new Date() })),
    ...store.articles().map((a) => ({ url: `${base}/artikel/${a.slug}`, lastModified: new Date() })),
  ];
}
