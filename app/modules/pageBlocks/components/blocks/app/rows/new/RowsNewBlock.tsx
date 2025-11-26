import { RowsNewBlockDto } from "./RowsNewBlockUtils";
import RowsNewVariantForm from "./RowsNewVariantForm";

export default function RowsNewBlock({ item }: readonly { readonly item: RowsNewBlockDto }) {
  return <>{item.style === "form" && <RowsNewVariantForm item={item} />}</>;
}
