import { RowsListBlockDto } from "./RowsListBlockUtils";
import RowsListVariantTable from "./RowsListVariantTable";

export default function RowsListBlock({ item }: readonly { readonly item: RowsListBlockDto }) {
  return <>{item.style === "table" && <RowsListVariantTable item={item} />}</>;
}
