import OrderListButtons from "~/components/ui/sort/OrderListButtons";
import TableSimple from "~/components/ui/tables/TableSimple";

type ArticleItem = {
  id: string;
  order: number;
  title: string;
};

interface OrderCellProps {
  readonly idx: number;
  readonly items: ArticleItem[];
}

function OrderCell({ idx, items }: OrderCellProps) {
  return <OrderListButtons index={idx} items={items} editable={true} />;
}

export default function KbSortArticles({
  items,
}: Readonly<{
  items: ArticleItem[];
}>) {
  return (
    <div className="space-y-1">
      <label className="text-muted-foreground block text-xs font-medium">{"Articles"}</label>
      <TableSimple
        items={items}
        headers={[
          {
            name: "order",
            title: "",
            value: (_i, idx) => <OrderCell idx={idx} items={items} />,
          },
          {
            name: "title",
            title: "Title",
            value: (item) => item.title,
          },
        ]}
      />
    </div>
  );
}
