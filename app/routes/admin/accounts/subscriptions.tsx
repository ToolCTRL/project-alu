import { LoaderFunctionArgs, MetaFunction, useLoaderData, Link, useNavigate, useOutlet } from "react-router";
import { useTranslation } from "react-i18next";
import { FilterablePropertyDto } from "~/application/dtos/data/FilterablePropertyDto";
import { PaginationDto } from "~/application/dtos/data/PaginationDto";
import { MetaTagsDto } from "~/application/dtos/seo/MetaTagsDto";
import TenantBadge from "~/components/core/tenants/TenantBadge";
import DateCell from "~/components/ui/dates/DateCell";
import InputFilters from "~/components/ui/input/InputFilters";
import EditPageLayout from "~/components/ui/layouts/EditPageLayout";
import SlideOverWideEmpty from "~/components/ui/slideOvers/SlideOverWideEmpty";
import TableSimple from "~/components/ui/tables/TableSimple";
import { getTranslations } from "~/locale/i18next.server";
import SubscriptionUtils from "~/utils/app/SubscriptionUtils";
import { getAllSubscriptionProducts } from "~/utils/db/subscriptionProducts.db.server";
import { TenantSubscriptionProductWithTenant, getAllTenantSubscriptionProducts } from "~/utils/db/subscriptions/tenantSubscriptionProducts.db.server";
import { adminGetAllTenantsIdsAndNames } from "~/utils/db/tenants.db.server";
import { verifyUserHasPermission } from "~/utils/helpers/.server/PermissionsService";
import { getFiltersFromCurrentUrl, getPaginationFromCurrentUrl } from "~/utils/helpers/RowPaginationHelper";
import DateUtils from "~/utils/shared/DateUtils";
import NumberUtils from "~/utils/shared/NumberUtils";

export const meta: MetaFunction<typeof loader> = ({ data }) => data?.metatags || [];

type LoaderData = {
  metatags: MetaTagsDto;
  items: TenantSubscriptionProductWithTenant[];
  pagination: PaginationDto;
  filterableProperties: FilterablePropertyDto[];
  isStripeTest: boolean;
};
export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  await verifyUserHasPermission(request, "admin.accounts.view");
  let { t } = await getTranslations(request);

  const filterableProperties: FilterablePropertyDto[] = [
    {
      name: "status",
      title: t("shared.status"),
      manual: true,
      options: [
        { value: "active", name: "Active" },
        { value: "ended", name: "Ended" },
        { value: "active-cancelled", name: "Active Cancelled" },
        { value: "active-not-cancelled", name: "Active Not Cancelled" },
      ],
    },
    {
      name: "subscriptionProductId",
      title: t("models.subscriptionProduct.object"),
      manual: true,
      options: (await getAllSubscriptionProducts()).map((f) => {
        return {
          value: f.id ?? "",
          name: t(f.title),
        };
      }),
    },
    {
      name: "tenantId",
      title: t("models.tenant.object"),
      manual: true,
      options: (await adminGetAllTenantsIdsAndNames()).map((tenant) => {
        return {
          value: tenant.id,
          name: tenant.name,
        };
      }),
    },
  ];
  const filters = getFiltersFromCurrentUrl(request, filterableProperties);
  const urlSearchParams = new URL(request.url).searchParams;
  const currentPagination = getPaginationFromCurrentUrl(urlSearchParams);
  const { items, pagination } = await getAllTenantSubscriptionProducts(filters, currentPagination);

  const data: LoaderData = {
    metatags: [{ title: `${t("models.subscription.plural")} | ${process.env.APP_NAME}` }],
    items,
    pagination,
    filterableProperties,
    isStripeTest: process.env.STRIPE_SK?.toString().startsWith("sk_test_") ?? true,
  };
  return data;
};

const TenantCell = ({ item }: { item: TenantSubscriptionProductWithTenant }) => <TenantBadge item={item.tenantSubscription.tenant} />;

const SubscriptionProductCell = ({ product }: { product: TenantSubscriptionProductWithTenant }) => {
  const { t } = useTranslation();
  return (
    <span>
      <div key={product.id}>
        <div>
          {t(product.subscriptionProduct.title)}{" "}
          {product.prices
            .map(
              (f) =>
                `$${NumberUtils.decimalFormat(Number(f.subscriptionPrice?.price ?? 0))} - ${SubscriptionUtils.getBillingPeriodDescription(
                  t,
                  f.subscriptionPrice?.billingPeriod ?? 0
                )}`
            )
            .join(", ")}
        </div>
      </div>
    </span>
  );
};

const PeriodCell = ({ item }: { item: TenantSubscriptionProductWithTenant }) => (
  <div>
    {item.currentPeriodStart && item.currentPeriodEnd ? (
      <div className="flex items-center space-x-1">
        <DateCell date={item.currentPeriodStart} displays={["mdy"]} />
        <div>-</div>
        <DateCell date={item.currentPeriodEnd} displays={["mdy"]} />
      </div>
    ) : (
      <div>-</div>
    )}
  </div>
);

const CancelledAtCell = ({ item }: { item: TenantSubscriptionProductWithTenant }) => {
  return <div>{item.cancelledAt ? <DateCell date={item.cancelledAt} displays={["mdy"]} /> : "-"}</div>;
};

const EndsAtCell = ({ item }: { item: TenantSubscriptionProductWithTenant }) => {
  const { t } = useTranslation();
  return (
    <div>
      {item.endsAt ? (
        <div>
          {new Date() < new Date(item.endsAt) ? (
            <div className="text-red-500">
              {t("settings.subscription.ends")} {DateUtils.dateMonthDayYear(item.endsAt)}
            </div>
          ) : (
            <div className="text-red-500">
              {t("settings.subscription.endedAt")} {DateUtils.dateMonthDayYear(item.endsAt)}
            </div>
          )}
        </div>
      ) : (
        "-"
      )}
    </div>
  );
};

const ActionsCell = ({ item }: { item: TenantSubscriptionProductWithTenant }) => {
  const { t } = useTranslation();
  return (
    <Link to={`${item.id}`} className="hover:underline">
      {t("shared.edit")}
    </Link>
  );
};

const renderTenantCell = (i: TenantSubscriptionProductWithTenant) => <TenantCell item={i} />;
const renderSubscriptionProductCell = (product: TenantSubscriptionProductWithTenant) => <SubscriptionProductCell product={product} />;
const renderPeriodCell = (i: TenantSubscriptionProductWithTenant) => <PeriodCell item={i} />;
const renderCancelledAtCell = (i: TenantSubscriptionProductWithTenant) => <CancelledAtCell item={i} />;
const renderEndsAtCell = (i: TenantSubscriptionProductWithTenant) => <EndsAtCell item={i} />;
const renderActionsCell = (i: TenantSubscriptionProductWithTenant) => <ActionsCell item={i} />;

export default function SubscriptionsPage() {
  const { t } = useTranslation();
  const data = useLoaderData<LoaderData>();
  const outlet = useOutlet();
  const navigate = useNavigate();

  return (
    <EditPageLayout
      title={t("models.subscription.plural")}
      buttons={<InputFilters filters={data.filterableProperties} withSearch={false} />}
    >
      <TableSimple
        items={data.items}
        pagination={data.pagination}
        headers={[
          {
            name: "tenant",
            title: t("models.tenant.object"),
            value: renderTenantCell,
          },
          {
            name: "subscriptionProduct",
            title: t("models.subscriptionProduct.object"),
            value: (i) => "",
            className: "w-full",
            formattedValue: renderSubscriptionProductCell,
          },
          {
            name: "period",
            title: t("models.subscription.period"),
            value: renderPeriodCell,
          },
          {
            name: "cancelledAt",
            title: t("models.subscription.cancelledAt"),
            value: renderCancelledAtCell,
          },
          {
            name: "endsAt",
            title: t("models.subscription.endsAt"),
            value: renderEndsAtCell,
          },
          {
            name: "actions",
            title: "",
            value: renderActionsCell,
          },
        ]}
      />

      <SlideOverWideEmpty
        open={!!outlet}
        onClose={() => {
          navigate(".", { replace: true });
        }}
        className="sm:max-w-sm"
        overflowYScroll={true}
      >
        <div className="-mx-1 -mt-3">
          <div className="space-y-4">{outlet}</div>
        </div>
      </SlideOverWideEmpty>
    </EditPageLayout>
  );
}
