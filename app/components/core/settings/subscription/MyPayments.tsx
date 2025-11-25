import { useTranslation } from "react-i18next";
import Stripe from "stripe";
import { Colors } from "~/application/enums/shared/Colors";
import SimpleBadge from "~/components/ui/badges/SimpleBadge";
import DownloadIcon from "~/components/ui/icons/DownloadIcon";
import TableSimple from "~/components/ui/tables/TableSimple";
import DateUtils from "~/utils/shared/DateUtils";
import NumberUtils from "~/utils/shared/NumberUtils";

interface Props {
  items: Stripe.PaymentIntent[];
}

const PaymentPaidAtCell = ({ created }: { created: number }) => (
  <div>
    <div className="flex flex-col">
      <div>{DateUtils.dateYMD(new Date(created * 1000))}</div>
      <div className="text-xs">{DateUtils.dateAgo(new Date(created * 1000))}</div>
    </div>
  </div>
);

const PaymentAmountCell = ({ amount, currency }: { amount: number; currency: string }) => (
  <div className="flex flex-col">
    <div>${NumberUtils.decimalFormat(amount / 100)}</div>
    <div className="text-muted-foreground text-xs uppercase">{currency}</div>
  </div>
);

const PaymentStatusCell = ({ status, t }: { status: string; t: any }) => (
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

export default function MyPayments({ items }: Props) {
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
              value: (i) => <PaymentPaidAtCell created={i.created} />,
            },
            {
              name: "amount",
              title: t("app.subscription.invoices.amount"),
              value: (i) => <PaymentAmountCell amount={i.amount} currency={i.currency} />,
            },
            {
              name: "status",
              title: t("shared.status"),
              value: (i) => <PaymentStatusCell status={i.status} t={t} />,
            },
            {
              className: "w-full",
              name: "date",
              title: t("shared.createdAt"),
              value: (i) => DateUtils.dateYMD(new Date(i.created * 1000)),
              formattedValue: (item) => <PaymentCreatedAtCell created={item.created} />,
            },
          ]}
          actions={[]}
        />
      )}
    </div>
  );
}
