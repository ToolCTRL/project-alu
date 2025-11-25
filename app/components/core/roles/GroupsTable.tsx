import { useState } from "react";
import { useTranslation } from "react-i18next";
import InputSearch from "~/components/ui/input/InputSearch";
import TableSimple from "~/components/ui/tables/TableSimple";
import { GroupWithDetails } from "~/utils/db/permissions/groups.db.server";
import GroupBadge from "./GroupBadge";
import { Link } from "react-router";
import ButtonSecondary from "~/components/ui/buttons/ButtonSecondary";
import PlusIcon from "~/components/ui/icons/PlusIcon";

interface Props {
  items: GroupWithDetails[];
  onNewRoute: string;
}

function GroupNameCell({ item }: { readonly item: GroupWithDetails }) {
  return <GroupBadge item={item} />;
}

function GroupActionsCell({ item }: { readonly item: GroupWithDetails }) {
  return (
    <Link to={`groups/${item.id}`} className="hover:underline">
      Edit
    </Link>
  );
}

export default function GroupsTable({ items, onNewRoute }: Readonly<Props>) {
  const { t } = useTranslation();

  const [searchInput, setSearchInput] = useState("");

  const filteredItems = () => {
    if (!items) {
      return [];
    }
    return items.filter(
      (f) =>
        f.name?.toString().toUpperCase().includes(searchInput.toUpperCase()) ||
        f.description?.toString().toUpperCase().includes(searchInput.toUpperCase()) ||
        f.users.find(
          (f) =>
            f.user.email.toUpperCase().includes(searchInput.toUpperCase()) ||
            f.user.firstName.toUpperCase().includes(searchInput.toUpperCase()) ||
            f.user.lastName.toUpperCase().includes(searchInput.toUpperCase())
        )
    );
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between space-x-2">
        <div className="grow">
          <InputSearch value={searchInput} setValue={setSearchInput} />
        </div>
        <ButtonSecondary to={onNewRoute}>
          <div className="flex items-center space-x-1">
            <PlusIcon className="h-3 w-3" />
            <div>{t("shared.add")}</div>
          </div>
        </ButtonSecondary>
      </div>
      <TableSimple
        items={filteredItems()}
        headers={[
          {
            name: "name",
            title: t("models.group.name"),
            value: (i) => i.name,
            formattedValue: (i) => <GroupNameCell item={i} />,
          },
          {
            name: "description",
            title: t("models.group.description"),
            value: (i) => i.description,
          },
          {
            name: "users",
            title: t("models.user.plural"),
            value: (i) => i.users.map((f) => `${f.user.firstName} ${f.user.lastName}`).join(", "),
            className: "w-full",
          },
          {
            name: "actions",
            title: "",
            value: (i) => <GroupActionsCell item={i} />,
          },
        ]}
      />
    </div>
  );
}
