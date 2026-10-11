import { NextResponse } from "next/server";
import { getStore } from "@/lib/data/store";

export async function GET() {
  const store = getStore();
  return NextResponse.json({
    regulations: store.regulations().map((r) => ({
      ...r,
      pasalCount: store.pasalsOf(r.slug).length,
      relations: store.relationsOf(r.slug),
    })),
  });
}
