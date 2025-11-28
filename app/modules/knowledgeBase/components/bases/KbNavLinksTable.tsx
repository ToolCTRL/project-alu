import { useCallback, useMemo } from "react";
import OrderIndexButtons from "~/components/ui/sort/OrderIndexButtons";
import TableSimple from "~/components/ui/tables/TableSimple";
import { KbNavLinkDto } from "~/modules/knowledgeBase/dtos/KbNavLinkDto";

type SetItemsFn = React.Dispatch<
  React.SetStateAction<
    {
      name: string;
      href: string;
      order: number;
    }[]
  >
>;

interface OrderCellProps {
  readonly idx: number;
  readonly items: KbNavLinkDto[];
  readonly onChange: (newItems: { idx: number; order: number }[]) => void;
}

function OrderCell({ idx, items, onChange }: OrderCellProps) {
  return (
    <OrderIndexButtons
      idx={idx}
      items={items.map((f, idx) => {
        return {
          idx: idx,
          order: f.order,
        };
      })}
      onChange={onChange}
    />
  );
}

export default function KbNavLinksTable({
  items,
  setItems,
}: Readonly<{
  items: KbNavLinkDto[];
  setItems: SetItemsFn;
}>) {
  const onOrderChange = useCallback(
    (newItems: { idx: number; order: number }[]) => {
      setItems((prev) => prev.map((item, i) => ({ ...item, order: newItems[i]?.order ?? item.order })));
    },
    [setItems]
  );
  const updateName = useCallback(
    (value: string, idx: number) => {
      setItems((prev) => prev.map((item, i) => (i === idx ? { ...item, name: value } : item)));
    },
    [setItems]
  );
  const updateHref = useCallback(
    (value: string, idx: number) => {
      setItems((prev) => prev.map((item, i) => (i === idx ? { ...item, href: value } : item)));
    },
    [setItems]
  );
  const renderOrder = useCallback(
    (_item: KbNavLinkDto, idx: number) => <OrderCell idx={idx} items={items} onChange={onOrderChange} />,
    [items, onOrderChange]
  );
  const headers = useMemo(
    () => [
      {
        name: "order",
        title: "",
        value: renderOrder,
      },
      {
        name: "title",
        title: "Title",
        value: (item: KbNavLinkDto) => item.name,
        editable: () => true,
        setValue: (value: string, idx: number) => updateName(value, idx),
      },
      {
        name: "href",
        title: "Link",
        value: (item: KbNavLinkDto) => item.href,
        editable: () => true,
        setValue: (value: string, idx: number) => updateHref(value, idx),
      },
    ],
    [renderOrder, updateName, updateHref]
  );
  return (
    <div>
      <div className="mb-1 flex items-center justify-between space-x-2 text-xs">
        <label className="text-muted-foreground font-medium">{"Nav links"}</label>
        <button type="button" onClick={() => setItems([])} className="text-muted-foreground hover:text-foreground/80">
          {"Clear"}
        </button>
      </div>

      <div className="">
        <TableSimple
          items={items.toSorted((a, b) => a.order - b.order)}
          headers={headers}
        />
        <button
          type="button"
          onClick={() => {
            setItems([...items, { name: "Link " + (items.length + 1), href: "/", order: items.length + 1 }]);
          }}
          className="border-border text-muted-foreground focus:text-foreground bg-background hover:bg-secondary/90 mt-2 flex items-center space-x-1 rounded-md border px-2 py-1 text-xs focus:ring-3 focus:ring-gray-300 focus:ring-offset-1"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span className="font-medium uppercase">{"Add"}</span>
        </button>
      </div>
    </div>
  );
}
