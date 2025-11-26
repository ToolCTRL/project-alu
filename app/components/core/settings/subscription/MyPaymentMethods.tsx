import { useRef } from "react";
import { useTranslation } from "react-i18next";
import Stripe from "stripe";
import PlusIcon from "~/components/ui/icons/PlusIcon";
import ConfirmModal, { RefConfirmModal } from "~/components/ui/modals/ConfirmModal";
import TableSimple from "~/components/ui/tables/TableSimple";

interface Props {
  readonly items: Stripe.PaymentMethod[];
  readonly onAdd: () => void;
  readonly onDelete: (id: string) => void;
}

const PaymentMethodBrand = ({ brand }: Readonly<{ brand?: string }>) => <div className="flex flex-col uppercase">{brand}</div>;

const PaymentMethodCountry = ({ country }: Readonly<{ country?: string }>) => <div className="flex flex-col">{country}</div>;

const PaymentMethodExpiration = ({ expMonth, expYear }: Readonly<{ expMonth?: number; expYear?: number }>) => (
  <div className="flex flex-col">
    {expMonth?.toString().padStart(2, "0")}/{expYear}
  </div>
);

const PaymentMethodLast4 = ({ last4 }: Readonly<{ last4?: string }>) => <div className="flex flex-col">**** **** **** {last4}</div>;

export default function MyPaymentMethods({ items, onAdd, onDelete }: Readonly<Props>) {
  const { t } = useTranslation();
  const confirmModal = useRef<RefConfirmModal>(null);
  function deletePaymentMethod(id: string) {
    confirmModal.current?.setValue(id);
    confirmModal.current?.show(t("app.subscription.paymentMethods.delete"));
  }
  function confirmedCancel(id: string) {
    onDelete(id);
  }
  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between space-x-2">
        <div className="text-sm font-medium">{t("app.subscription.paymentMethods.cards")}</div>
      </div>
      {items.length > 0 ? (
        <TableSimple
          items={items}
          actions={[
            {
              title: t("shared.delete"),
              onClick: (_, i) => deletePaymentMethod(i.id),
              destructive: true,
            },
          ]}
          headers={[
            {
              name: "brand",
              title: t("app.subscription.paymentMethods.brand"),
              formattedValue: PaymentMethodBrand,
            },
            {
              name: "country",
              title: t("app.subscription.paymentMethods.country"),
              formattedValue: PaymentMethodCountry,
            },
            {
              name: "expiration",
              title: t("app.subscription.paymentMethods.expiration"),
              formattedValue: PaymentMethodExpiration,
            },
            {
              name: "last4",
              title: t("app.subscription.paymentMethods.last4"),
              formattedValue: PaymentMethodLast4,
            },
          ]}
        />
      ) : (
        <div className="mt-3">
          <button
            type="button"
            onClick={onAdd}
            className="border-border hover:border-border relative block w-full rounded-lg border-2 border-dashed p-4 text-center focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <PlusIcon className="text-muted-foreground mx-auto h-4" />
            <span className="text-foreground mt-2 block text-sm font-medium">
              {t("shared.add")} {t("app.subscription.paymentMethods.card").toLowerCase()}
            </span>
          </button>
        </div>
      )}
      <ConfirmModal ref={confirmModal} onYes={confirmedCancel} destructive />
    </div>
  );
}
