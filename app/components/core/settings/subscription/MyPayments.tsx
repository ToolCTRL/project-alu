import { useTranslation } from "react-i18next";
import Stripe from "stripe";
import { Colors } from "~/application/enums/shared/Colors";
import SimpleBadge from "~/components/ui/badges/SimpleBadge";
import TableSimple from "~/components/ui/tables/TableSimple";
import DateUtils from "~/utils/shared/DateUtils";
import NumberUtils from "~/utils/shared/NumberUtils";

interface Props {
  readonly items: Stripe.PaymentIntent[];
}

const PaymentPaidAtCell = ({ created }: Readonly<{ created: number }>) => (
  <div>
    <div className="flex flex-col">
      <div>{DateUtils.dateYMD(new Date(created * 1000))}</div>
      <div className="text-xs">{DateUtils.dateAgo(new Date(created * 1000))}</div>
    </div>
  </div>
);

const PaymentAmountCell = ({ amount, currency }: Readonly<{ amount: number; currency: string }>) => (
  <div className="flex flex-col">
    <div>${NumberUtils.decimalFormat(amount / 100)}</div>
    <div className="text-muted-foreground text-xs uppercase">{currency}</div>
  </div>
);

const PaymentStatusCell = ({ status, t }: Readonly<{ status: string; t: any }>) => (
  <div>
    <SimpleBadge title={t("app.subscription.payments.status." + status)} color={status === "succeeded" ? Colors.GREEN : Colors.GRAY} />
  </div>
);

const PaymentCreatedAtCell = ({ created }: { created: number }) => (
  <div className="flex flex-col">
    <div>{DateUtils.dateYMD(new Date(created * 1000))}</div>
    <div className="text-xs">{DateUtils.dateAgo(new Date(created * 1000))}</div>
  </div>
);

export default function MyPayments({ items }: Readonly<Props>) {
  const { t } = useTranslation();
  return (
    <div className="space-y-2">
      <div className="text-sm font-medium">{t("app.subscription.payments.title")}</div>
      {items.length === 0 ? (
        <div className="text-muted-foreground text-sm italic">{t("shared.noRecords")}</div>
      ) : (
        <TableSimple
          items={items}
          headers={[
            {
              name: "paidAt",
              title: t("app.subscription.invoices.paidAt"),
              formattedValue: PaymentPaidAtCell,
            },
            {
              name: "amount",
              title: t("app.subscription.invoices.amount"),
              formattedValue: PaymentAmountCell,
            },
            {
              name: "status",
              title: t("shared.status"),
              formattedValue: PaymentStatusCell,
            },
            {
              className: "w-full",
              name: "date",
              title: t("shared.createdAt"),
              value: (i) => DateUtils.dateYMD(new Date(i.created * 1000)),
              formattedValue: PaymentCreatedAtCell,
            },
          ]}
          actions={[]}
        />
      )}
    </div>
  );
}
