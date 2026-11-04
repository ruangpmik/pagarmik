import type { Regulation, Relation } from "@/lib/data/types";

export interface FocusedRelationshipGraph {
  focus: Regulation | null;
  related: Regulation[];
  pendingCount: number;
  needsReviewCount: number;
  edges: Array<{
    relation: Relation;
    from: Regulation;
    to: Regulation;
    related: Regulation;
  }>;
}

export function isPublishableRelation(relation: Relation): boolean {
  const evidence = relation.evidence;
  return !!evidence
    && evidence.verificationStatus === "VERIFIED"
    && !!evidence.verifiedAt
    && !Number.isNaN(Date.parse(evidence.verifiedAt))
    && !!evidence.verifiedBy?.trim()
    && Array.isArray(evidence.sources)
    && evidence.sources.length > 0
    && evidence.sources.every((source) => {
      try {
        const url = new URL(source.url);
        const officialGovernmentHost = url.hostname.toLowerCase().endsWith(".go.id");
        const articleCitation = /(?:pasal|bab|ayat|angka|huruf|putusan|lampiran|nomor)\s*[\w.-]+/i.test(source.citation);
        return url.protocol === "https:" && officialGovernmentHost && articleCitation;
      } catch {
        return false;
      }
    });
}

const REVERSE_RELATION_LABEL: Partial<Record<Relation["type"], string>> = {
  MENCABUT: "DICABUT OLEH",
  MENGUBAH: "DIUBAH OLEH",
  MELAKSANAKAN: "DILAKSANAKAN OLEH",
  MERUJUK: "DIRUJUK OLEH",
  TURUNAN: "TURUNAN DARI",
  MEMPERKUAT: "DIPERKUAT OLEH",
  MENGUJI: "DIUJI OLEH",
};

export function relationLabelForFocus(relation: Relation, focusSlug: string): string {
  if (relation.type === "BERIRISAN") return "BERIRISAN DENGAN";
  return relation.from === focusSlug ? relation.type : REVERSE_RELATION_LABEL[relation.type] ?? relation.type;
}

/** Build a graph only from relationships stored for the selected regulation. */
export function buildFocusedRelationshipGraph(
  slug: string,
  regulations: Regulation[],
  relations: Relation[],
): FocusedRelationshipGraph {
  const bySlug = new Map(regulations.map((regulation) => [regulation.slug, regulation]));
  const focus = bySlug.get(slug) ?? null;
  if (!focus) return { focus: null, related: [], pendingCount: 0, needsReviewCount: 0, edges: [] };

  const candidates = relations.filter((relation) => relation.from === slug || relation.to === slug);
  const edges = candidates
    .filter(isPublishableRelation)
    .flatMap((relation) => {
      const from = bySlug.get(relation.from);
      const to = bySlug.get(relation.to);
      if (!from || !to) return [];
      return [{
        relation,
        from,
        to,
        related: relation.from === slug ? to : from,
      }];
    });

  const related = [...new Map(edges.map(({ related: regulation }) => [regulation.slug, regulation])).values()];
  const needsReviewCount = candidates.filter(
    (relation) => relation.evidence?.verificationStatus === "LEGAL_REVIEW_REQUIRED",
  ).length;
  return {
    focus,
    related,
    pendingCount: candidates.length - edges.length - needsReviewCount,
    needsReviewCount,
    edges,
  };
}
