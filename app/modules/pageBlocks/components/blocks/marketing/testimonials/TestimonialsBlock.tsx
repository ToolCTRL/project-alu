import { TestimonialsBlockDto } from "~/modules/pageBlocks/components/blocks/marketing/testimonials/TestimonialsBlockUtils";
import TestimonialsVariantSimple from "./TestimonialsVariantSimple";
import TestimonialsVariantScroll from "./TestimonialsVariantScroll";
import TestimonialsVariantCarousel from "./TestimonialsVariantCarousel";

export default function TestimonialsBlock({ item }: { readonly item: TestimonialsBlockDto }) {
  return (
    <>
      {item.style === "simple" && <TestimonialsVariantSimple item={item} />}
      {item.style === "scroll" && <TestimonialsVariantScroll item={item} />}
      {item.style === "carousel" && <TestimonialsVariantCarousel item={item} />}
    </>
  );
}
