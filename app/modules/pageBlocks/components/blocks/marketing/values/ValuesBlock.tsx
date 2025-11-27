"use client";

import { ValuesBlockDto } from "./ValuesBlockUtils";
import ValuesVariantGrid from "./ValuesVariantGrid";

export default function ValuesBlock({ item }: { readonly item: ValuesBlockDto }) {
  return (
    <>
      {item.style === "grid" && <ValuesVariantGrid item={item} />}
    </>
  );
}
