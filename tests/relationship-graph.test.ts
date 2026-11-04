import { describe, expect, it } from "vitest";
import seed from "../prisma/seed.json";
import { buildFocusedRelationshipGraph, relationLabelForFocus } from "@/lib/data/relationship-graph";
import type { Regulation, Relation } from "@/lib/data/types";

const regulations = seed.regulations as unknown as Regulation[];
const relations = seed.relations as unknown as Relation[];

describe("focused regulatory relationship graph", () => {
  it("withholds catalog relationships until they have verified source evidence", () => {
    const graph = buildFocusedRelationshipGraph(
      "permenkominfo-20-2016",
      regulations,
      relations,
    );

    expect(graph.focus?.slug).toBe("permenkominfo-20-2016");
    expect(graph.edges).toEqual([]);
    expect(graph.related).toEqual([]);
    expect(graph.pendingCount).toBe(0);
    expect(graph.needsReviewCount).toBe(1);
  });

  it("shows only the selected regulation's sourced, verified relationships", () => {
    const candidate = relations.find((relation) => relation.from === "permenkominfo-20-2016");
    expect(candidate).toBeDefined();
    const verifiedCandidate: Relation = {
      ...candidate!,
      evidence: {
        verificationStatus: "VERIFIED",
        verifiedAt: "2026-11-03",
        verifiedBy: "TEST_FIXTURE",
        sources: [{ url: "https://jdih.example.go.id/legal-source", citation: "Pasal 75 (test fixture)" }],
      },
    };
    const graph = buildFocusedRelationshipGraph(
      "permenkominfo-20-2016",
      regulations,
      [verifiedCandidate, ...relations.filter((relation) => relation !== candidate)],
    );

    expect(graph.edges).toHaveLength(1);
    expect(graph.edges[0].relation.from).toBe("permenkominfo-20-2016");
    expect(graph.edges[0].relation.to).toBe("uu-27-2022");
    expect(graph.related.map((regulation) => regulation.slug)).toEqual(["uu-27-2022"]);
    expect(graph.pendingCount).toBe(0);
    expect(graph.edges.every(({ from, to }) => from.slug === graph.focus?.slug || to.slug === graph.focus?.slug)).toBe(true);
  });

  it("uses focus-relative labels for reverse and undirected relationships", () => {
    const repeal = relations.find((relation) => relation.type === "MENCABUT")!;
    expect(relationLabelForFocus(repeal, repeal.from)).toBe("MENCABUT");
    expect(relationLabelForFocus(repeal, repeal.to)).toBe("DICABUT OLEH");
    expect(relationLabelForFocus(relations.find((relation) => relation.type === "BERIRISAN")!, "uu-27-2022")).toBe("BERIRISAN DENGAN");
  });

  it("returns an explicit empty model when no relations are recorded", () => {
    const graph = buildFocusedRelationshipGraph(
      "uu-8-1999",
      regulations,
      relations.filter((relation) => relation.from !== "uu-8-1999" && relation.to !== "uu-8-1999"),
    );

    expect(graph.focus?.slug).toBe("uu-8-1999");
    expect(graph.edges).toEqual([]);
    expect(graph.related).toEqual([]);
    expect(graph.pendingCount).toBe(0);
  });

  it("does not invent nodes for an unknown regulation", () => {
    expect(buildFocusedRelationshipGraph("missing-regulation", regulations, relations)).toEqual({
      focus: null,
      related: [],
      pendingCount: 0,
      needsReviewCount: 0,
      edges: [],
    });
  });
});
