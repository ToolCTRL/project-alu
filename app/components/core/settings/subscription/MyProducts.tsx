import { useTranslation } from "react-i18next";
import WarningBanner from "~/components/ui/banners/WarningBanner";
import { Link } from "react-router";
import TenantProduct from "./TenantProduct";
import { TenantSubscriptionProductWithDetails } from "~/utils/db/subscriptions/tenantSubscriptionProducts.db.server";

interface Props {
  currentTenant: { slug: string };
  items: TenantSubscriptionProductWithDetails[];
  onCancel?: (item: TenantSubscriptionProductWithDetails) => void;
}

export default function MyProducts({ currentTenant, items, onCancel }: Readonly<Props>): JSX.Element {
  const { t } = useTranslation();

  return (
    <div>
      {items.length === 0 ? (
        <WarningBanner title={t("settings.subscription.noSubscription")} text={""}>
          <Link to={`/subscribe/${currentTenant.slug}`} className="underline">
            {t("settings.subscription.viewAllProducts")}.
          </Link>
        </WarningBanner>
      ) : (
        <div className="grid gap-2">
          {items.map((item) => {
            return <TenantProduct key={item.id} item={item} onCancel={onCancel} />;
          })}
        </div>
      )}
    </div>
  );
}
