import clsx from "clsx";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { DefaultEntityTypes } from "~/application/dtos/shared/DefaultEntityTypes";
import ButtonTertiary from "~/components/ui/buttons/ButtonTertiary";
import EmptyState from "~/components/ui/emptyState/EmptyState";
import InputSearch from "~/components/ui/input/InputSearch";
import { ApiKeyWithDetails } from "~/utils/db/apiKeys.db.server";
import { EntitySimple } from "~/utils/db/entities/entities.db.server";
import DateUtils from "~/utils/shared/DateUtils";
import NumberUtils from "~/utils/shared/NumberUtils";

function getEntityPermissions(item: ApiKeyWithDetails, entity: EntitySimple, permission: string): boolean {
  const apiKeyEntity = item.entities.find((f) => f.entityId === entity.id);
  if (!apiKeyEntity) {
    return false;
  }
  if (permission === "C") {
    return apiKeyEntity.create;
  }
  if (permission === "R") {
    return apiKeyEntity.read;
  }
  if (permission === "U") {
    return apiKeyEntity.update;
  }
  if (permission === "D") {
    return apiKeyEntity.delete;
  }
  return false;
}

function hasExpired(item: ApiKeyWithDetails): boolean {
  const now = new Date();
  return Boolean(item.expires && item.expires < now);
}

interface Props {
  entities: EntitySimple[];
  items: ApiKeyWithDetails[];
  withTenant?: boolean;
  canCreate?: boolean;
}
type Header = {
  name?: string;
  title: string;
};
export default function ApiKeysTable({ entities, items, withTenant, canCreate }: Readonly<Props>) {
  const { t } = useTranslation();

  const [copiedKey, setCopiedKey] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [headers, setHeaders] = useState<Header[]>([]);

  // Helper function to handle copying API keys
  const handleCopyKey = (key: string) => {
    setCopiedKey(key);
    setTimeout(() => {
      setCopiedKey("");
    }, 2000);
    navigator.clipboard.writeText(key);
  };

  useEffect(() => {
    const headersList: Header[] = [];
    if (withTenant) {
      headersList.push({ name: "tenant", title: t("models.tenant.object") });
    }
    headersList.push(
      { name: "key", title: t("models.apiKey.key") },
      { name: "alias", title: t("models.apiKey.alias") },
      { name: "usage", title: t("models.apiKey.usage") }
    );

    entities
      .filter((f) => (f.type === DefaultEntityTypes.AppOnly || f.type === DefaultEntityTypes.All) && f.hasApi)
      .forEach((entity) => {
        headersList.push({ name: "entityId", title: t(entity.titlePlural) });
      });

    headersList.push(
      { name: "expires", title: t("models.apiKey.expires") },
      { name: "createdAt", title: t("shared.createdAt") },
      { name: "createdByUser", title: t("shared.createdBy") }
    );
    setHeaders(headersList);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [withTenant]);

  const filteredItems = () => {
    if (!items) {
      return [];
    }
    const filtered = items.filter((f) => f.tenant?.name?.toString()?.toUpperCase().includes(searchInput.toUpperCase()));

    return filtered.sort((x, y) => {
      if (x.createdAt && y.createdAt) {
        return x.createdAt > y.createdAt ? -1 : 1;
      }
      return -1;
    });
  };


  function renderContent() {
    if (filteredItems().length === 0) {
      return (
        <div>
          <EmptyState
            className="bg-background"
            captions={{
              thereAreNo: t("shared.noRecords"),
            }}
          />
        </div>
      );
    }

    return (
      <div>
        <div>
          <div className="flex flex-col">
            <div className="overflow-x-auto">
              <div className="inline-block min-w-full py-2 align-middle">
                <div className="border-border overflow-hidden border shadow-xs sm:rounded-lg">
                  <table className="divide-border min-w-full divide-y">
                          <thead className="bg-secondary">
                            <tr>
                              {headers.map((header) => {
                                return (
                                  <th
                                    key={header.name || header.title}
                                    scope="col"
                                    className="text-muted-foreground select-none truncate px-3 py-2 text-left text-xs font-medium tracking-wider"
                                  >
                                    <div className="text-muted-foreground flex items-center space-x-1">
                                      <div>{header.title}</div>
                                    </div>
                                  </th>
                                );
                              })}
                            </tr>
                          </thead>
                          <tbody className="divide-border bg-background divide-y">
                            {filteredItems().map((item) => {
                              return (
                                <tr key={item.id}>
                                  {withTenant && (
                                    <td className="text-muted-foreground whitespace-nowrap px-3 py-2 text-sm">{item.tenant?.name ?? "- Admin -"}</td>
                                  )}
                                  <td className="text-muted-foreground whitespace-nowrap px-3 py-2 text-sm">
                                    {item.active ? (
                                      <ButtonTertiary onClick={() => handleCopyKey(item.key)}>
                                        {copiedKey === item.key ? t("shared.copied") : t("shared.copy")}
                                      </ButtonTertiary>
                                    ) : (
                                      <span className="text-red-600">{t("shared.inactive")} </span>
                                    )}
                                  </td>
                                  <td className="text-muted-foreground whitespace-nowrap px-3 py-2 text-sm">{item.alias}</td>
                                  <td className="text-muted-foreground whitespace-nowrap px-3 py-2 text-sm">
                                    {NumberUtils.intFormat(item._count.apiKeyLogs)}{" "}
                                    {item._count.apiKeyLogs === 1 ? t("models.apiCall.object") : t("models.apiCall.plural")}
                                  </td>
                                  {entities
                                    .filter((f) => (f.type === DefaultEntityTypes.AppOnly || f.type === DefaultEntityTypes.All) && f.hasApi)
                                    .map((entity) => {
                                      return (
                                        <td key={entity.id} className="text-muted-foreground whitespace-nowrap px-3 py-2 text-sm">
                                          <div className="flex items-center">
                                            <span className={clsx(getEntityPermissions(item, entity, "C") ? " text-foreground font-bold" : "text-red-400")}>
                                              C
                                            </span>
                                            <span className={clsx(getEntityPermissions(item, entity, "R") ? " text-foreground font-bold" : "text-red-400")}>
                                              R
                                            </span>
                                            <span className={clsx(getEntityPermissions(item, entity, "U") ? " text-foreground font-bold" : "text-red-400")}>
                                              U
                                            </span>
                                            <span className={clsx(getEntityPermissions(item, entity, "D") ? " text-foreground font-bold" : "text-red-400")}>
                                              D
                                            </span>
                                          </div>
                                        </td>
                                      );
                                    })}
                                  <td className="text-muted-foreground whitespace-nowrap px-3 py-2 text-sm">
                                    <time dateTime={DateUtils.dateYMDHMS(item.expires)} title={DateUtils.dateYMDHMS(item.expires)}>
                                      {item.expires === null ? <span>-</span> : <span>{DateUtils.dateAgo(item.expires)}</span>}
                                    </time>
                                  </td>
                                  <td className="text-muted-foreground whitespace-nowrap px-3 py-2 text-sm">
                                    <time dateTime={DateUtils.dateYMDHMS(item.createdAt)} title={DateUtils.dateYMDHMS(item.createdAt)}>
                                      {DateUtils.dateYMDHMS(item.createdAt)}
                                    </time>
                                  </td>
                                  <td className="text-muted-foreground whitespace-nowrap px-3 py-2 text-sm">
                                    <span className="text-muted-foreground text-xs">{item.createdByUser.email}</span>
                                  </td>
                                  <td className="text-muted-foreground whitespace-nowrap px-3 py-2 text-sm">
                                    <div className="flex items-center space-x-2">
                                      <ButtonTertiary to={item.id}>{t("shared.edit")}</ButtonTertiary>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <InputSearch value={searchInput} setValue={setSearchInput} onNewRoute={canCreate ? "new" : ""} />
      {renderContent()}
    </div>
  );
}
