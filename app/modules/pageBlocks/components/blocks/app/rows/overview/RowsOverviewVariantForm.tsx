import RowOverviewRoute from "~/modules/rows/components/RowOverviewRoute";
import { RowsOverviewBlockDto } from "./RowsOverviewBlockUtils";

export default function RowsOverviewVariantForm({ item }: readonly { readonly item: RowsOverviewBlockDto }) {
  return (
    <>
      {item.data && (
        <RowOverviewRoute
          rowData={item.data.rowData}
          item={item.data.rowData.item}
          relationshipRows={item.data.relationshipRows}
          options={{
            hideTitle: true,
          }}
        />
      )}
    </>
  );
}
