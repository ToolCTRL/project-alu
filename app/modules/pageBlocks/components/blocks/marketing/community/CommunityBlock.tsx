import { CommunityBlockDto } from "./CommunityBlockUtils";
import CommunityVariantSimple from "./CommunityVariantSimple";

export default function CommunityBlock({ item }: readonly { readonly item: CommunityBlockDto }) {
  return <>{item.style === "simple" && <CommunityVariantSimple item={item} />}</>;
}
