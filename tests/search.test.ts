import { describe, it, expect } from "vitest";
import { hybridSearch } from "@/lib/search/hybrid";
import type { LegalChunk } from "@/lib/data/types";

const CHUNKS: LegalChunk[] = [
  {
    id: "permenkes-24-2022:pasal-kerahasiaan:0", regulationSlug: "permenkes-24-2022",
    regulasiJudul: "Peraturan Menteri Kesehatan Nomor 24 Tahun 2022 tentang Rekam Medis",
    pasalNomor: "kerahasiaan", teks: "Isi rekam medis bersifat rahasia. Pembukaan hanya atas persetujuan pasien atau permintaan resmi penegak hukum.",
    topik: ["rekam-medis", "privasi"], trustLevel: "L1_PRIMER", authority: 0.8, tahun: 2022,
  },
  {
    id: "uu-27-2022:pasal-data-spesifik:0", regulationSlug: "uu-27-2022",
    regulasiJudul: "Undang-Undang Nomor 27 Tahun 2022 tentang Pelindungan Data Pribadi",
    pasalNomor: "data-spesifik", teks: "Data kesehatan adalah data pribadi spesifik dengan perlindungan diperkuat dan kewajiban notifikasi insiden.",
    topik: ["perlindungan-data", "privasi"], trustLevel: "L1_PRIMER", authority: 1, tahun: 2022,
  },
  {
    id: "permenkes-269-2008:pasal-kerahasiaan:0", regulationSlug: "permenkes-269-2008",
    regulasiJudul: "Peraturan Menteri Kesehatan Nomor 269 Tahun 2008 tentang Rekam Medis",
    pasalNomor: "kerahasiaan", teks: "Aturan lama kerahasiaan rekam medis era kertas.",
    topik: ["rekam-medis"], trustLevel: "L1_PRIMER", authority: 0.8, tahun: 2008,
  },
];

const META = new Map([
  ["permenkes-24-2022", { jenis: "Permenkes", status: "BERLAKU", tahun: 2022 }],
  ["uu-27-2022", { jenis: "UU", status: "BERLAKU", tahun: 2022 }],
  ["permenkes-269-2008", { jenis: "Permenkes", status: "DICABUT", tahun: 2008 }],
]);

describe("hybridSearch (retrieval test)", () => {
  it("menemukan pasal kerahasiaan untuk query relevan", () => {
    const hits = hybridSearch("dasar hukum kerahasiaan rekam medis", CHUNKS, { regulationMeta: META });
    expect(hits.length).toBeGreaterThan(0);
    expect(hits[0].chunk.regulationSlug).toBe("permenkes-24-2022");
  });

  it("mendukung filter status (mis. hanya BERLAKU)", () => {
    const hits = hybridSearch("kerahasiaan rekam medis", CHUNKS, {
      regulationMeta: META, filters: { status: "BERLAKU" },
    });
    expect(hits.every((h) => META.get(h.chunk.regulationSlug)?.status === "BERLAKU")).toBe(true);
  });

  it("UU berperingkat lebih tinggi dari aturan lama untuk query umum", () => {
    const hits = hybridSearch("perlindungan data kesehatan", CHUNKS, { regulationMeta: META });
    expect(hits[0].chunk.regulationSlug).toBe("uu-27-2022");
  });

  it("query kosong/tak bermakna tidak menghasilkan hits", () => {
    expect(hybridSearch("zzz qqq xxx", CHUNKS, { regulationMeta: META })).toHaveLength(0);
  });
});
