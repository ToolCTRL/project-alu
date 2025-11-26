import { FaqBlockDto } from "~/modules/pageBlocks/components/blocks/marketing/faq/FaqBlockUtils";
import FaqVariantSimple from "./FaqVariantSimple";

export default function FaqBlock({ item }: { readonly item: FaqBlockDto }) {
  return <>{item.style === "simple" && <FaqVariantSimple item={item} />}</>;
}
