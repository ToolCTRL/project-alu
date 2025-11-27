import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import DateUtils from "~/utils/shared/DateUtils";
import TableSimple from "~/components/ui/tables/TableSimple";
import { TenantWithUsage } from "~/utils/db/tenants.db.server";
import { RowHeaderDisplayDto } from "~/application/dtos/data/RowHeaderDisplayDto";
import { PaginationDto } from "~/application/dtos/data/PaginationDto";
import NumberUtils from "~/utils/shared/NumberUtils";
import SubscriptionUtils from "~/utils/app/SubscriptionUtils";
import { RowHeaderActionDto } from "~/application/dtos/data/RowHeaderActionDto";
import SimpleBadge from "~/components/ui/badges/SimpleBadge";
import { Colors } from "~/application/enums/shared/Colors";
import Stripe from "stripe";
import { Link } from "react-router";

interface Props {
  readonly items: TenantWithUsage[];
  readonly pagination: PaginationDto;
  readonly actions?: RowHeaderActionDto<TenantWithUsage>[];
  readonly tenantInvoices?: Stripe.Invoice[];
  readonly isStripeTest?: boolean;
}
function TenantInvoice({ item }: Readonly<{ item: Stripe.Invoice }>) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col">
      <div title={DateUtils.dateYMD(new Date(item.created * 1000))} className="flex items-center space-x-1">
        <div className="flex items-baseline space-x-1">
          <div>${NumberUtils.decimalFormat(item.total / 100)}</div>
          <div className="text-muted-foreground text-xs uppercase">{item.currency}</div>
        </div>
        <SimpleBadge title={t("app.subscription.invoices.status." + item.status)} color={item.status === "paid" ? Colors.GREEN : Colors.YELLOW} />
      </div>
      <div className="text-muted-foreground text-xs">{item.created ? DateUtils.dateAgo(new Date(item.created * 1000)) : ""}</div>
    </div>
  );
}

function formatProductPrice(price: any, t: any): string {
  return `$${NumberUtils.decimalFormat(Number(price.subscriptionPrice?.price ?? 0))} - ${SubscriptionUtils.getBillingPeriodDescription(
    t,
    price.subscriptionPrice?.billingPeriod ?? 0
  )}`;
}

function renderProductEndDate(product: any, t: any) {
  if (!product.endsAt) {
    return null;
  }

  const isActive = new Date() < new Date(product.endsAt);
  const labelKey = isActive ? "settings.subscription.ends" : "settings.subscription.endedAt";

  return (
    <div className="text-red-500">
      {t(labelKey)} {DateUtils.dateMonthDayYear(product.endsAt)}
    </div>
  );
}

function renderSubscriptionProduct(product: any, t: any) {
  return (
    <div key={product.id}>
      <div>
        {t(product.subscriptionProduct.title)}{" "}
        {product.prices
          .map((f: any) => formatProductPrice(f, t))
          .join(", ")}
      </div>
      {renderProductEndDate(product, t)}
    </div>
  );
}

function renderTenantCell(i: TenantWithUsage, t: any) {
  return (
    <div className="max-w-sm truncate">
      <div className="text-foreground flex items-center space-x-1 truncate font-medium">
        <Link to={`/admin/accounts/${i.id}`} className="hover:underline">
          {i.name}
        </Link>
        {i.deactivatedReason && <SimpleBadge title={t("shared.deactivated") + ": " + i.deactivatedReason} color={Colors.RED} />}
      </div>

      <Link
        to={"/app/" + i.slug}
        className="text-muted-foreground focus:bg-secondary/90 hover:border-border rounded-md border-b border-dashed text-xs hover:border-dashed"
      >
        <span>/{i.slug}</span>
      </Link>
    </div>
  );
}

export default function TenantsTable({ items, pagination, actions = [], tenantInvoices, isStripeTest }: Readonly<Props>) {
  const { t } = useTranslation();

  const getTenantInvoices = useCallback(
    (tenant: TenantWithUsage) => {
      if (!tenantInvoices) {
        return [];
      }
      const invoices = tenantInvoices.filter((f) => f.customer?.toString() === tenant.subscription?.stripeCustomerId);
      return invoices.toSorted((a, b) => (a.created > b.created ? 1 : -1));
    },
    [tenantInvoices]
  );

  const lastTenantInvoice = useCallback(
    (tenant: TenantWithUsage): Stripe.Invoice | undefined => {
      const invoices = getTenantInvoices(tenant);
      return invoices.at(-1);
    },
    [getTenantInvoices]
  );

  const getTotalPaid = useCallback(
    (tenant: TenantWithUsage): number => {
      const invoices = getTenantInvoices(tenant);
      return invoices.reduce((a, b) => a + Number(b.amount_paid / 100), 0);
    },
    [getTenantInvoices]
  );

  const renderSubscriptionValue = useCallback((item: TenantWithUsage) => {
    return (
      <span>
        {item.subscription?.products ? (
          <div>
            {item.subscription.products.map((product) => renderSubscriptionProduct(product, t))}
          </div>
        ) : (
          <span className="text-muted-foreground text-sm italic">{t("settings.subscription.noSubscription")}</span>
        )}
      </span>
    );
  }, [t]);

  const renderLastInvoiceValue = useCallback((i: TenantWithUsage) => {
    const invoice = lastTenantInvoice(i);
    return (
      <a
        className="flex flex-col space-y-1 hover:underline"
        target="_blank"
        rel="noreferrer"
        href={`https://dashboard.stripe.com${isStripeTest ? "/test" : ""}/customers/${i.subscription?.stripeCustomerId ?? ""}`}
      >
        <div className="flex flex-col space-y-1">
          {invoice ? TenantInvoice({ item: invoice }) : <span>-</span>}
        </div>
      </a>
    );
  }, [lastTenantInvoice, isStripeTest]);

  const renderTotalPaidValue = useCallback((i: TenantWithUsage) => {
    const totalPaid = getTotalPaid(i);
    const paidCount = getTenantInvoices(i).filter((f) => f.paid).length;
    return (
      <a
        className="flex flex-col space-y-1 hover:underline"
        target="_blank"
        rel="noreferrer"
        href={`https://dashboard.stripe.com${isStripeTest ? "/test" : ""}/customers/${i.subscription?.stripeCustomerId ?? ""}`}
      >
        {totalPaid === 0 ? (
          <span>-</span>
        ) : (
          <div>
            ${NumberUtils.decimalFormat(totalPaid)} ({paidCount})
          </div>
        )}
      </a>
    );
  }, [getTotalPaid, getTenantInvoices, isStripeTest]);

  const renderTypesValue = useCallback((i: TenantWithUsage) => {
    if (i.types.length === 0) {
      return <span className="text-muted-foreground">{t("shared.default")}</span>;
    }
    return i.types.map((f) => f.title).join(", ");
  }, [t]);

  const renderRowsValue = useCallback((item: TenantWithUsage) => {
    return <Link to={"/admin/entities/rows?tenantId=" + item.id}>{item._count.rows}</Link>;
  }, []);

  const renderEventsValue = useCallback((i: TenantWithUsage) => {
    return <Link to={`/admin/events?tenantId=${i.id}`}>{i._count.events}</Link>;
  }, []);

  const renderCreatedAtValue = useCallback((item: TenantWithUsage) => {
    return (
      <div className="flex flex-col">
        <div>{DateUtils.dateYMD(item.createdAt)}</div>
        <div className="text-xs">{DateUtils.dateAgo(item.createdAt)}</div>
      </div>
    );
  }, []);

  const [headers, setHeaders] = useState<RowHeaderDisplayDto<TenantWithUsage>[]>([]);

  useEffect(() => {
    const baseHeaders: RowHeaderDisplayDto<TenantWithUsage>[] = [
      {
        name: "tenant",
        title: t("models.tenant.object"),
        value: (i) => renderTenantCell(i, t),
      },
      {
        name: "subscription",
        title: t("admin.tenants.subscription.title"),
        value: () => "",
        formattedValue: renderSubscriptionValue,
      },
    ];

    const invoiceHeaders: RowHeaderDisplayDto<TenantWithUsage>[] =
      tenantInvoices && tenantInvoices.length > 0
        ? [
            {
              name: "lastInvoice",
              title: "Last invoice",
              value: renderLastInvoiceValue,
            },
            {
              name: "totalInvoicesPaid",
              title: "Total paid",
              value: renderTotalPaidValue,
            },
          ]
        : [];

    const otherHeaders: RowHeaderDisplayDto<TenantWithUsage>[] = [
      {
        name: "types",
        title: t("shared.types"),
        value: renderTypesValue,
      },
      {
        name: "users",
        title: t("models.user.plural"),
        className: "max-w-xs truncate",
        value: (i) => i.users.map((f) => f.user.email).join(", "),
        href: (i) => `/admin/accounts/users?tenantId=${i.id}`,
      },
      {
        name: "rows",
        title: t("models.row.plural"),
        value: renderRowsValue,
      },
      {
        name: "events",
        title: "Events",
        value: (i) => i._count.events,
        formattedValue: renderEventsValue,
      },
      {
        name: "createdAt",
        title: t("shared.createdAt"),
        value: (i) => i.createdAt,
        formattedValue: renderCreatedAtValue,
      },
    ];

    setHeaders([...baseHeaders, ...invoiceHeaders, ...otherHeaders]);
  }, [getTenantInvoices, getTotalPaid, isStripeTest, lastTenantInvoice, t, tenantInvoices, renderSubscriptionValue, renderLastInvoiceValue, renderTotalPaidValue, renderTypesValue, renderRowsValue, renderEventsValue, renderCreatedAtValue]);

  return (
    <div className="space-y-2">
      <TableSimple
        items={items}
        headers={headers}
        actions={[
          {
            title: t("admin.tenants.overview"),
            onClickRoute: (_, item) => `/admin/accounts/${item.id}`,
          },
          ...actions,
        ]}
        pagination={pagination}
      />
    </div>
  );
}
