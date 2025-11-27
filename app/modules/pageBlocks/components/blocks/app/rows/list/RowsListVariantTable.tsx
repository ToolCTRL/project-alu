import RowsViewRoute from "~/modules/rows/components/RowsViewRoute";
import { RowsListBlockDto } from "./RowsListBlockUtils";

export default function RowsListVariantTable({ item }: readonly { readonly item: RowsListBlockDto }) {
  return (
    <>
      {item.data && (
        <RowsViewRoute
          key={item.data.entity.id}
          rowsData={item.data}
          items={item.data.items}
          saveCustomViews={false}
          routes={undefined}
          permissions={{
            create: false,
          }}
          currentSession={null}
        />
      )}
    </>
  );
}
