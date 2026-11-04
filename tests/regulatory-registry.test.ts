import { describe, expect, it } from "vitest";
import seed from "../prisma/seed.json";

describe("verified regulatory registry corrections", () => {
  const regulations = seed.regulations;

  it("records the current PMK 13/2025 and its express repeal of PMK 55/2013", () => {
    const pmk13 = regulations.find((item) => item.slug === "permenkes-13-2025");
    const pmk55 = regulations.find((item) => item.slug === "permenkes-55-2013");
    const pmk55Summary = seed.pasals.find(
      (item) => item.regulationSlug === "permenkes-55-2013",
    );

    expect(pmk13?.status).toBe("BERLAKU");
    expect(pmk13?.tglBerlaku).toBe("2025-11-03");
    expect(pmk13?.tglPenetapan).toBeUndefined();
    expect(pmk13?.sumberResmi).toBe(
      "https://jdih.kemkes.go.id/documents/peraturan-menteri-kesehatan-nomor-13-tahun-2025",
    );
    expect(pmk55?.status).toBe("DICABUT");
    expect(pmk55Summary?.artiSederhana).toContain("bukan dasar hukum aktif");
    expect(pmk55Summary?.relevansiPmIK).toContain("konteks historis");
    expect(
      seed.relations.some(
        (relation) =>
          relation.from === "permenkes-13-2025" &&
          relation.to === "permenkes-55-2013" &&
          relation.type === "MENCABUT",
      ),
    ).toBe(true);

    // Relasi yang sama harus membawa bukti sumber resmi yang sudah diverifikasi,
    // bukan sekadar catatan katalog yang ditahan dari grafik.
    const repeal = seed.relations.find(
      (relation) =>
        relation.from === "permenkes-13-2025" &&
        relation.to === "permenkes-55-2013",
    ) as { evidence?: { verificationStatus?: string; sources?: { url?: string; citation?: string }[] } };
    expect(repeal?.evidence?.verificationStatus).toBe("VERIFIED");
    expect(repeal?.evidence?.sources?.[0]?.url).toBe(
      "https://jdih.kemkes.go.id/documents/peraturan-menteri-kesehatan-nomor-13-tahun-2025",
    );
    expect(repeal?.evidence?.sources?.[0]?.citation).toContain("Pasal 309");
  });

  it("records Permenkes 24/2022 express repeal of Permenkes 269/2008", () => {
    const pmk24 = regulations.find((item) => item.slug === "permenkes-24-2022");
    const pmk269 = regulations.find((item) => item.slug === "permenkes-269-2008");

    expect(pmk24?.status).toBe("BERLAKU");
    expect(pmk269?.status).toBe("DICABUT");

    const repeal = seed.relations.find(
      (relation) =>
        relation.from === "permenkes-24-2022" &&
        relation.to === "permenkes-269-2008",
    ) as { evidence?: { verificationStatus?: string; sources?: { url?: string; citation?: string }[] } };
    expect(repeal?.evidence?.verificationStatus).toBe("VERIFIED");
    expect(repeal?.evidence?.sources?.[0]?.url).toBe(
      "https://jdih.kemkes.go.id/documents/peraturan-menteri-kesehatan-nomor-24-tahun-2022",
    );
    expect(repeal?.evidence?.sources?.[0]?.citation).toContain("Pasal 46");
  });

  it("keeps official determination and effective dates distinct", () => {
    const pmk36 = regulations.find((item) => item.slug === "permenkes-36-2012");
    const pmk82 = regulations.find((item) => item.slug === "permenkes-82-2013");

    expect(pmk36?.tglPenetapan).toBe("2012-08-10");
    expect(pmk36?.tglBerlaku).toBe("2012-09-12");
    expect(pmk82?.tglPenetapan).toBe("2013-12-10");
    expect(pmk82?.tglBerlaku).toBe("2014-01-20");
  });

  it("records UU 17/2023 express repeal of eleven predecessor laws", () => {
    for (const [to, angka] of [
      ["uu-419-1949", "Pasal 454 angka 1"],
      ["uu-4-1984", "Pasal 454 angka 2"],
      ["uu-29-2004", "Pasal 454 angka 3"],
      ["uu-36-2009", "Pasal 454 angka 4"],
      ["uu-44-2009", "Pasal 454 angka 5"],
      ["uu-20-2013", "Pasal 454 angka 6"],
      ["uu-18-2014", "Pasal 454 angka 7"],
      ["uu-36-2014", "Pasal 454 angka 8"],
      ["uu-38-2014", "Pasal 454 angka 9"],
      ["uu-6-2018", "Pasal 454 angka 10"],
      ["uu-4-2019", "Pasal 454 angka 11"],
    ] as const) {
      const relation = seed.relations.find(
        (item) => item.from === "uu-17-2023" && item.to === to,
      ) as { evidence?: { verificationStatus?: string; sources?: { url?: string; citation?: string }[] } };
      expect(relation?.evidence?.verificationStatus).toBe("VERIFIED");
      expect(relation?.evidence?.sources?.[0]?.url).toBe(
        "https://peraturan.bpk.go.id/Details/258028/uu-no-17-tahun-2023",
      );
      expect(relation?.evidence?.sources?.[0]?.citation).toContain(angka);
    }
  });

  it("states the 21-item PMK 6/2026 repeal list without changing history", () => {
    const pmk6 = regulations.find((item) => item.slug === "permenkes-6-2026");
    const pmk82 = regulations.find((item) => item.slug === "permenkes-82-2013");

    expect(pmk6?.ringkasan).toContain("21 instrumen");
    expect(pmk82?.status).toBe("DICABUT");
    expect(seed.regulations.filter((item) => item.slug === "permenkes-82-2013")).toHaveLength(1);

    // Pasal 84 mencabut 21 instrumen huruf a sampai u; setiap relasi membawa bukti resmi.
    for (const [to, ref] of [
      ["kepmenkes-772-2002", "Pasal 84 huruf a"],
      ["kepmenkes-058-2009", "Pasal 84 huruf b"],
      ["permenkes-971-2009", "Pasal 84 huruf c"],
      ["permenkes-755-2011", "Pasal 84 huruf d"],
      ["permenkes-1171-2011", "Pasal 84 huruf e"],
      ["permenkes-2306-2011", "Pasal 84 huruf f"],
      ["permenkes-49-2013", "Pasal 84 huruf g"],
      ["permenkes-82-2013", "Pasal 84 huruf h"],
      ["permenkes-10-2014", "Pasal 84 huruf i"],
      ["permenkes-17-2014", "Pasal 84 huruf j"],
      ["permenkes-24-2014", "Pasal 84 huruf k"],
      ["permenkes-85-2015", "Pasal 84 huruf l"],
      ["permenkes-88-2015", "Pasal 84 huruf m"],
      ["permenkes-11-2016", "Pasal 84 huruf n"],
      ["permenkes-4-2018", "Pasal 84 huruf o"],
      ["permenkes-42-2018", "Pasal 84 huruf p"],
      ["permenkes-3-2020", "Pasal 84 huruf q"],
      ["permenkes-80-2020", "Pasal 84 huruf r"],
      ["permenkes-31-2022", "Pasal 84 huruf s"],
      ["permenkes-40-2022", "Pasal 84 huruf t"],
      ["permenkes-33-2023", "Pasal 84 huruf u"],
    ] as const) {
      const relation = seed.relations.find(
        (item) => item.from === "permenkes-6-2026" && item.to === to,
      ) as { evidence?: { verificationStatus?: string; sources?: { url?: string; citation?: string }[] } };
      expect(relation?.evidence?.verificationStatus).toBe("VERIFIED");
      expect(relation?.evidence?.sources?.[0]?.url).toBe(
        "https://jdih.kemkes.go.id/documents/peraturan-menteri-kesehatan-nomor-6-tahun-2026",
      );
      expect(relation?.evidence?.sources?.[0]?.citation).toContain(ref);
    }
  });

  it("records PP 28/2024 express repeal of 31 predecessor instruments", () => {
    const repeals = seed.relations.filter(
      (relation) => relation.from === "pp-28-2024" && relation.type === "MENCABUT",
    );
    expect(repeals).toHaveLength(31);

    for (const [to, ref] of [
      ["pp-26-1960", "Pasal 1170 huruf a"],
      ["pp-10-1966", "Pasal 1170 huruf e"],
      ["pp-53-2021", "Pasal 1170 huruf z"],
      ["perpres-35-2008", "Pasal 1170 huruf aa"],
      ["perpres-86-2019", "Pasal 1170 huruf ee"],
    ] as const) {
      const relation = seed.relations.find(
        (item) => item.from === "pp-28-2024" && item.to === to,
      ) as { evidence?: { verificationStatus?: string; sources?: { url?: string; citation?: string }[] } };
      expect(relation?.evidence?.verificationStatus).toBe("VERIFIED");
      expect(relation?.evidence?.sources?.[0]?.url).toBe(
        "https://peraturan.bpk.go.id/Details/294077/pp-no-28-tahun-2024",
      );
      expect(relation?.evidence?.sources?.[0]?.citation).toContain(ref);
    }

    // PP 61/2014 dicabut kecuali Pasal 31; kaveat terekam pada ringkasan simpul.
    const pp61 = regulations.find((item) => item.slug === "pp-61-2014");
    expect(pp61?.status).toBe("DICABUT");
    expect(pp61?.ringkasan).toContain("kecuali Pasal 31");
  });

  it("records PP 71/2019 express repeal of PP 82/2012", () => {
    const pp71 = regulations.find((item) => item.slug === "pp-71-2019");
    const pp82 = regulations.find((item) => item.slug === "pp-82-2012");

    expect(pp71?.status).toBe("BERLAKU");
    expect(pp82?.status).toBe("DICABUT");

    const repeal = seed.relations.find(
      (relation) =>
        relation.from === "pp-71-2019" && relation.to === "pp-82-2012",
    ) as { evidence?: { verificationStatus?: string; sources?: { url?: string; citation?: string }[] } };
    expect(repeal?.evidence?.verificationStatus).toBe("VERIFIED");
    expect(repeal?.evidence?.sources?.[0]?.url).toBe(
      "https://peraturan.bpk.go.id/Details/122030/pp-no-71-tahun-2019",
    );
    expect(repeal?.evidence?.sources?.[0]?.citation).toContain("Pasal 103");
  });

  it("carries verified evidence on derivative (delegasi/perubahan) relations", () => {
    // Pasangan delegasi UU 17/2023 <-> PP 28/2024 (dua arah) membawa bukti sumber resmi.
    const delegateCases = [
      { from: "uu-17-2023", to: "pp-28-2024", citation: "Nomor 28 Tahun 2024" },
      { from: "pp-28-2024", to: "uu-17-2023", citation: "Pasal 24 ayat (2)" },
      { from: "permenkes-6-2026", to: "uu-17-2023", citation: "Nomor 28 Tahun 2024" },
      { from: "uu-19-2016", to: "uu-11-2008", citation: "Nomor 19 Tahun 2016" },
      { from: "perbssn-1-2026", to: "perbssn-5-2021", citation: "Nomor 5 Tahun 2021" },
    ] as const;
    for (const { from, to, citation } of delegateCases) {
      const relation = seed.relations.find(
        (item) => item.from === from && item.to === to,
      ) as { evidence?: { verificationStatus?: string; sources?: { url?: string; citation?: string }[] } };
      expect(relation?.evidence?.verificationStatus).toBe("VERIFIED");
      expect(relation?.evidence?.sources?.[0]?.citation).toContain(citation);
    }
  });

  it("removes the chronologically impossible Perka ANRI 12/2007 → UU 43/2009 edge", () => {
    // Perka ANRI 12/2007 (2007) mendahului UU 43/2009 (2009); relasi "turunan"
    // salah arah dihapus. UU pendahulunya (UU 7/1971) belum dimodelkan di seed.
    const relation = seed.relations.find(
      (item) => item.from === "perka-anri-12-2007" && item.to === "uu-43-2009",
    );
    expect(relation).toBeUndefined();
  });

  it("records the MK ruling as judicial review (MENGUJI) of UU 17/2023", () => {
    const relation = seed.relations.find(
      (item) => item.from === "mk-111-182-puu-2024" && item.to === "uu-17-2023",
    ) as { type?: string; evidence?: { verificationStatus?: string; sources?: { url?: string; citation?: string }[] } };
    expect(relation?.type).toBe("MENGUJI");
    expect(relation?.evidence?.verificationStatus).toBe("VERIFIED");
    expect(relation?.evidence?.sources?.[0]?.citation).toContain("111/PUU-XXII/2024");
  });

  it("records PP 33/2026 as the implementing regulation of UU 27/2022 (PDP)", () => {
    const pp33 = regulations.find((item) => item.slug === "pp-33-2026");
    expect(pp33?.jenis).toBe("PP");
    expect(pp33?.status).toBe("BELUM_BERLAKU");
    expect(pp33?.tglPenetapan).toBe("2026-07-16");
    expect(pp33?.tglBerlaku).toBe("2027-01-16");
    expect(pp33?.judul).toContain("Pelindungan Data Pribadi");

    const melaksanakan = seed.relations.find(
      (item) => item.from === "pp-33-2026" && item.to === "uu-27-2022",
    ) as { type?: string; evidence?: { verificationStatus?: string; sources?: { url?: string; citation?: string }[] } };
    expect(melaksanakan?.type).toBe("MELAKSANAKAN");
    expect(melaksanakan?.evidence?.verificationStatus).toBe("VERIFIED");
    expect(melaksanakan?.evidence?.sources?.[0]?.url).toBe(
      "https://static.banyumaskab.go.id/website/file/peraturan_pemerintah_no._33_tahun_2026_100926115902.pdf",
    );
    expect(melaksanakan?.evidence?.sources?.[0]?.citation).toContain("Pasal 10 ayat (2)");

    const turunan = seed.relations.find(
      (item) => item.from === "uu-27-2022" && item.to === "pp-33-2026",
    ) as { type?: string; evidence?: { verificationStatus?: string } };
    expect(turunan?.type).toBe("TURUNAN");
    expect(turunan?.evidence?.verificationStatus).toBe("VERIFIED");
  });

  it("demarks subjective relations as needing legal review, not as verified facts", () => {
    const subjective = seed.relations.filter(
      (relation) => relation.type === "BERIRISAN" || relation.type === "MEMPERKUAT",
    );
    expect(subjective.length).toBe(17);
    for (const relation of subjective) {
      const evidence = relation.evidence as
        | { verificationStatus?: string; sources?: unknown[] }
        | undefined;
      expect(evidence?.verificationStatus).toBe("LEGAL_REVIEW_REQUIRED");
      expect(evidence?.sources).toEqual([]);
    }
  });

  it("keeps regulation slugs unique", () => {
    const slugs = regulations.map((item) => item.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});
