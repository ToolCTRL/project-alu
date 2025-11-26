import { useTranslation } from "react-i18next";
import Stripe from "stripe";
import { Colors } from "~/application/enums/shared/Colors";
import SimpleBadge from "~/components/ui/badges/SimpleBadge";
import DownloadIcon from "~/components/ui/icons/DownloadIcon";
import TableSimple from "~/components/ui/tables/TableSimple";
import { getFormattedPriceInCurrency } from "~/utils/helpers/PricingHelper";
import DateUtils from "~/utils/shared/DateUtils";

interface Props {
  readonly items: Stripe.Invoice[];
}

const InvoiceDateCell = ({ created }: Readonly<{ created: number }>) => (
  <div className="flex flex-col">
    <div>{DateUtils.dateYMD(new Date(created * 1000))}</div>
    <div className="text-xs">{DateUtils.dateAgo(new Date(created * 1000))}</div>
  </div>
);

const InvoiceAmountCell = ({ currency, amountPaid }: Readonly<{ currency: string; amountPaid: number }>) => (
  <div className="flex flex-col">
    <div>
      {getFormattedPriceInCurrency({
        currency: currency,
        price: Number(amountPaid) / 100,
      })}
    </div>
    <div className="text-muted-foreground text-xs uppercase">{currency}</div>
  </div>
);

const InvoiceStatusCell = ({ status, t }: Readonly<{ status: string; t: any }>) => (
  <div>
    <SimpleBadge title={t("app.subscription.invoices.status." + status)} color={status === "paid" ? Colors.GREEN : Colors.YELLOW} />
  </div>
);

const InvoiceItemsCell = ({ lineItems, t }: Readonly<{ lineItems: Stripe.InvoiceLineItem[]; t: any }>) => (
  <div className="flex flex-col">
    {lineItems.map((lineItem) => {
      return (
        <div key={lineItem.id}>
          {lineItem.price?.nickname && <span>{t(lineItem.price?.nickname)} - </span>}
          {lineItem.description}
        </div>
      );
    })}
  </div>
);

export default function MyInvoices({ items }: Props) {
  const { t } = useTranslation();
  return (
    <div className="space-y-2">
      <div className="text-sm font-medium">{t("app.subscription.invoices.title")}</div>
      {items.length === 0 ? (
        <div className="text-muted-foreground text-sm italic">{t("shared.noRecords")}</div>
      ) : (
        <TableSimple
          items={items}
          headers={[
            {
              name: "date",
              title: t("shared.createdAt"),
              value: (i) => DateUtils.dateYMD(new Date(i.created * 1000)),
              formattedValue: InvoiceDateCell,
            },
            {
              name: "amount",
              title: t("app.subscription.invoices.amount"),
              formattedValue: InvoiceAmountCell,
            },
            {
              name: "status",
              title: t("shared.status"),
              formattedValue: InvoiceStatusCell,
            },
            {
              className: "w-full",
              name: "items",
              title: t("app.subscription.invoices.items"),
              formattedValue: InvoiceItemsCell,
            },
          ]}
          actions={[
            {
              title: (
                <div className="flex justify-center">
                  <DownloadIcon className="h-4 w-4" />
                </div>
              ),
              onClickRoute: (_, item) => item.invoice_pdf ?? "",
              disabled: (item) => !item.invoice_pdf,
              onClickRouteTarget: "_blank",
              firstColumn: true,
            },
          ]}
        />
      )}
    </div>
  );
}
