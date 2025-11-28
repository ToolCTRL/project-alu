import { useTranslation } from "react-i18next";
import { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction, useActionData, useLoaderData, useSubmit } from "react-router";
import { getTranslations } from "~/locale/i18next.server";
import { verifyUserHasPermission } from "~/utils/helpers/.server/PermissionsService";
import TableSimple from "~/components/ui/tables/TableSimple";
import { getPaginationFromCurrentUrl } from "~/utils/helpers/RowPaginationHelper";
import { PaginationDto } from "~/application/dtos/data/PaginationDto";
import DateUtils from "~/utils/shared/DateUtils";
import { IpAddressLog } from "@prisma/client";
import { getAllIpAddressLogs } from "~/modules/ipAddress/db/ipAddressLogs.db.server";
import ShowPayloadModalButton from "~/components/ui/json/ShowPayloadModalButton";
import EditPageLayout from "~/components/ui/layouts/EditPageLayout";
import SimpleBadge from "~/components/ui/badges/SimpleBadge";
import { Colors } from "~/application/enums/shared/Colors";
import { addToBlacklist, findInBlacklist } from "~/utils/db/blacklist.db.server";
import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { db } from "~/utils/db.server";
import DropdownSimple from "~/components/ui/dropdowns/DropdownSimple";
import DownArrow from "~/components/ui/icons/DownArrow";

type LoaderData = {
  title: string;
  items: IpAddressLog[];
  pagination: PaginationDto;
  blacklistedIps: string[];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await verifyUserHasPermission(request, "admin.tenantIpAddress.view");
  const { t } = await getTranslations(request);

  const urlSearchParams = new URL(request.url).searchParams;
  const currentPagination = getPaginationFromCurrentUrl(urlSearchParams);
  const { items, pagination } = await getAllIpAddressLogs(currentPagination);

  const data: LoaderData = {
    title: `${t("models.ipAddress.plural")} | ${process.env.APP_NAME}`,
    items,
    pagination,
    blacklistedIps: await db.blacklist
      .findMany({
        where: { type: "ip" },
        select: { value: true },
      })
      .then((items) => items.flatMap((i) => i.value)),
  };
  return data;
};

export const action = async ({ request }: ActionFunctionArgs) => {
  await verifyUserHasPermission(request, "admin.blacklist.manage");
  const form = await request.formData();
  const action = form.get("action") as string;
  if (action === "blacklist-ip") {
    const ip = form.get("ip")?.toString() ?? "";
    const existing = await findInBlacklist("ip", ip);
    if (existing) {
      return Response.json({ error: "IP address is already blacklisted." }, { status: 400 });
    } else {
      await addToBlacklist({
        type: "ip",
        value: ip,
      });
      return Response.json({ success: "IP address has been blacklisted." });
    }
  } else if (action === "delete-log") {
    const id = form.get("id")?.toString() ?? "";
    await db.ipAddressLog.delete({ where: { id } });
    return Response.json({ success: "Log has been deleted." });
  } else if (action === "delete-logs") {
    const ids = form.getAll("id").map((i) => i.toString());
    const deleted = await db.ipAddressLog.deleteMany({ where: { id: { in: ids } } });
    return Response.json({ success: `${deleted.count} logs have been deleted.` });
  } else {
    return Response.json({ error: "Invalid action." }, { status: 400 });
  }
};

const StatusCell = ({ item }: { item: IpAddressLog }) => (
  <div className="flex flex-col">
    <div>{item.success ? <SimpleBadge title="Success" color={Colors.GREEN} /> : <SimpleBadge title="Error" color={Colors.RED} />}</div>
  </div>
);

const IpCell = ({ item, blacklistedIps }: { item: IpAddressLog; blacklistedIps: string[] }) => (
  <div className="flex flex-col">
    <div className="font-medium">
      {item.ip} {blacklistedIps.includes(item.ip) && <SimpleBadge title="Blacklisted" color={Colors.RED} />}
    </div>
  </div>
);

const ActionCell = ({ item }: { item: IpAddressLog }) => (
  <div className="flex flex-col">
    <div className="font-medium">{item.action}</div>
    <div className="text-muted-foreground text-xs">{item.description}</div>
  </div>
);

const UrlCell = ({ item }: { item: IpAddressLog }) => (
  <div className="flex flex-col">
    <div className="">{item.url}</div>
  </div>
);

const MetadataCell = ({ item }: { item: IpAddressLog }) => (
  <div className="max-w-xs truncate">
    {item.metadata ? <ShowPayloadModalButton description={item.metadata} payload={item.metadata} /> : <div className="text-muted-foreground italic">-</div>}
  </div>
);

const ErrorCell = ({ item }: { item: IpAddressLog }) => (
  <div className="flex flex-col text-red-500">
    <div className="font-medium">{item.error}</div>
  </div>
);

export const meta: MetaFunction<typeof loader> = ({ data }) => [{ title: data?.title }];

export default function IpAddressLogsRoute() {
  const data = useLoaderData<LoaderData>();
  const actionData = useActionData<{ success?: string; error?: string }>();
  const submit = useSubmit();
  const { t } = useTranslation();

  const [items, setItems] = useState<IpAddressLog[]>(data.items);
  const [selected, setSelected] = useState<IpAddressLog[]>([]);

  useEffect(() => {
    setItems(data.items);
  }, [data]);

  useEffect(() => {
    if (actionData?.success) {
      toast.success(actionData.success);
    } else if (actionData?.error) {
      toast.error(actionData.error);
    }
  }, [actionData]);

  const renderCreatedAt = useCallback((item: IpAddressLog) => DateUtils.dateAgo(item.createdAt), []);
  const renderStatus = useCallback((i: IpAddressLog) => <StatusCell item={i} />, []);
  const renderIp = useCallback((i: IpAddressLog) => <IpCell item={i} blacklistedIps={data.blacklistedIps} />, [data.blacklistedIps]);
  const renderAction = useCallback((i: IpAddressLog) => <ActionCell item={i} />, []);
  const renderUrl = useCallback((i: IpAddressLog) => <UrlCell item={i} />, []);
  const renderMetadata = useCallback((i: IpAddressLog) => <MetadataCell item={i} />, []);
  const renderError = useCallback((i: IpAddressLog) => <ErrorCell item={i} />, []);
  const headers = useMemo(
    () => [
      {
        name: "createdAt",
        title: t("shared.createdAt"),
        value: renderCreatedAt,
        className: "text-muted-foreground text-xs",
        breakpoint: "sm",
      },
      {
        name: "status",
        title: t("shared.status"),
        value: renderStatus,
      },
      {
        name: "ip",
        title: t("models.tenantIpAddress.object"),
        value: renderIp,
      },
      {
        name: "action",
        title: "Action",
        value: renderAction,
      },
      {
        name: "url",
        title: "URL",
        value: renderUrl,
      },
      {
        name: "metadata",
        title: "Metadata",
        value: renderMetadata,
      },
      {
        name: "error",
        title: "Error",
        value: renderError,
      },
    ],
    [renderAction, renderCreatedAt, renderError, renderIp, renderMetadata, renderStatus, renderUrl, t]
  );
  return (
    <EditPageLayout
      tabs={[
        {
          name: "IP Addresses",
          routePath: "/admin/accounts/ip-addresses",
        },
        {
          name: "Logs",
          routePath: "/admin/accounts/ip-addresses/logs",
        },
      ]}
      buttons={<></>}
    >
      {selected.length > 0 && (
        <DropdownSimple
          right
          button={
            <div className="hover:bg-secondary border-border bg-background text-foreground/80 flex items-center space-x-2 rounded-md border px-2 py-1 text-sm">
              <div>{selected.length} selected</div>
              <DownArrow className="h-4 w-4" />
            </div>
          }
          items={[
            {
              label: `Delete ${selected.length} logs`,
              onClick: () => {
                const form = new FormData();
                form.set("action", "delete-logs");
                selected.forEach((i) => form.append("id", i.id));
                setSelected([]);
                setItems((prev) => prev.filter((p) => !selected.includes(p)));
                submit(form, {
                  method: "post",
                });
              },
            },
          ]}
        />
      )}
      <TableSimple
        items={items}
        selectedRows={selected}
        onSelected={setSelected}
        actions={[
          {
            title: "Blacklist IP",
            destructive: true,
            onClick: (_, i) => {
              const form = new FormData();
              form.set("action", "blacklist-ip");
              form.set("ip", i.ip);
              submit(form, {
                method: "post",
              });
            },
          },
          {
            title: "Delete",
            destructive: true,
            onClick: (_, i) => {
              setSelected((prev) => prev.filter((p) => p.id !== i.id));
              setItems((prev) => prev.filter((p) => p.id !== i.id));
              const form = new FormData();
              form.set("action", "delete-log");
              form.set("id", i.id);
              submit(form, {
                method: "post",
              });
            },
          },
        ]}
        headers={headers}
        pagination={data.pagination}
      />
    </EditPageLayout>
  );
}
