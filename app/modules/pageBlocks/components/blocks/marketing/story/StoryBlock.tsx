"use client";

import { StoryBlockDto } from "./StoryBlockUtils";
import StoryVariantScrollStuck from "./StoryVariantScrollStuck";

export default function StoryBlock({ item }: { item: StoryBlockDto }) {
  return (
    <>
      {item.style === "scroll-stuck" && <StoryVariantScrollStuck item={item} />}
    </>
  );
}
