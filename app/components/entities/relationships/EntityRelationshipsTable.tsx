import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import CheckIcon from "~/components/ui/icons/CheckIcon";
import XIcon from "~/components/ui/icons/XIcon";
import OrderListButtons from "~/components/ui/sort/OrderListButtons";
import TableSimple from "~/components/ui/tables/TableSimple";
import { EntityRelationshipWithDetails } from "~/utils/db/entities/entityRelationships.db.server";
import NumberUtils from "~/utils/shared/NumberUtils";

const OrderCell = ({ idx, items }: { idx: number; items: (EntityRelationshipWithDetails & { _count: { rows: number } })[] }) => (
  <div>
    <OrderListButtons index={idx} items={items.map((f) => ({ ...f, order: f.order ?? 0 }))} editable={true} />
  </div>
);

const TypeCell = ({ item, t }: { item: EntityRelationshipWithDetails; t: any }) => (
  <Link to={item.id} className="font-medium underline">
    {t("shared.relationships." + item.type)}
  </Link>
);

const ParentCell = ({ item, t }: { item: EntityRelationshipWithDetails & { _count: { rows: number } }; t: any }) => (
  <div>
    {t(item.parent.title)} {item.parentEntityView && <span className="text-muted-foreground text-xs italic">({item.parentEntityView.name})</span>}
  </div>
);

const ChildCell = ({ item, t }: { item: EntityRelationshipWithDetails & { _count: { rows: number } }; t: any }) => (
  <div>
    {t(item.child.title)} {item.childEntityView && <span className="text-muted-foreground text-xs italic">({item.childEntityView.name})</span>}
  </div>
);

const CountCell = ({ count }: { count: number }) => <div>{NumberUtils.intFormat(count)}</div>;

const BooleanIconCell = ({ value }: { value: boolean }) => (
  <div>{value ? <CheckIcon className="h-5 w-5 text-teal-500" /> : <XIcon className="text-muted-foreground h-5 w-5" />}</div>
);

const TitleCell = ({ title }: { title: string | null }) => <div>{title}</div>;

export default function EntityRelationshipsTable({
  items,
  editable,
}: {
  items: (EntityRelationshipWithDetails & { _count: { rows: number } })[];
  editable: boolean;
}) {
  const { t } = useTranslation();
  return (
    <TableSimple
      headers={[
        {
          name: "order",
          title: "Order",
          value: (_item, idx) => <OrderCell idx={idx} items={items} />,
        },
        {
          name: "type",
          title: "Type",
          value: (item) => <TypeCell item={item} t={t} />,
          className: "w-full",
        },
        {
          name: "parent",
          title: "Parent",
          value: (item) => <ParentCell item={item} t={t} />,
        },
        {
          name: "child",
          title: "Child",
          value: (item) => <ChildCell item={item} t={t} />,
        },
        {
          name: "count",
          title: "Count",
          value: (item) => <CountCell count={item._count.rows} />,
        },
        {
          name: "required",
          title: "Required",
          value: (item) => <BooleanIconCell value={item.required} />,
        },
        {
          name: "cascade",
          title: "Cascade delete",
          value: (item) => <BooleanIconCell value={item.cascade} />,
        },
        {
          name: "readOnly",
          title: "Read only",
          value: (item) => <BooleanIconCell value={item.readOnly} />,
        },
        {
          name: "hiddenIfEmpty",
          title: "Hidden if empty",
          value: (item) => <BooleanIconCell value={item.hiddenIfEmpty} />,
        },
        {
          name: "title",
          title: "Title",
          value: (item) => <TitleCell title={item.title} />,
        },
      ]}
      items={items}
      actions={[
        {
          title: t("shared.edit"),
          onClickRoute: (_, item) => item.id,
          hidden: () => !editable,
        },
      ]}
    ></TableSimple>
  );
}
