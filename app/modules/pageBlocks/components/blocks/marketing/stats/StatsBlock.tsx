"use client";

import { StatsBlockDto } from "./StatsBlockUtils";
import StatsVariantGrid from "./StatsVariantGrid";

export default function StatsBlock({ item }: { readonly item: StatsBlockDto }) {
  return (
    <>
      {item.style === "grid" && <StatsVariantGrid item={item} />}
    </>
  );
}
