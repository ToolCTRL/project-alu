import { useEffect } from "react";
import { ActionFunction, LoaderFunctionArgs, MetaFunction, redirect, useLoaderData, useActionData } from "react-router";
import { getTranslations } from "~/locale/i18next.server";
import { SubscriptionProductDto } from "~/application/dtos/subscriptions/SubscriptionProductDto";
import { createPlan } from "~/utils/services/.server/pricingService";
import { createAdminLog } from "~/utils/db/logs.db.server";
import PricingPlanForm from "~/components/core/pricing/PricingPlanForm";
import { getAllSubscriptionProducts } from "~/utils/db/subscriptionProducts.db.server";
import { SubscriptionBillingPeriod } from "~/application/enums/subscriptions/SubscriptionBillingPeriod";
import { SubscriptionFeatureDto } from "~/application/dtos/subscriptions/SubscriptionFeatureDto";
import { verifyUserHasPermission } from "~/utils/helpers/.server/PermissionsService";
import { SubscriptionUsageBasedPriceDto } from "~/application/dtos/subscriptions/SubscriptionUsageBasedPriceDto";
import BackButtonWithTitle from "~/components/ui/buttons/BackButtonWithTitle";
import EditPageLayout from "~/components/ui/layouts/EditPageLayout";
import { toast } from "sonner";

export const meta: MetaFunction<typeof loader> = ({ data }) => [{ title: data?.title }];

type LoaderData = {
  title: string;
  plans: SubscriptionProductDto[];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await verifyUserHasPermission(request, "admin.pricing.create");
  const { t } = await getTranslations(request);

  const data: LoaderData = {
    title: `${t("admin.pricing.new")} | ${process.env.APP_NAME}`,
    plans: await getAllSubscriptionProducts(),
  };
  return data;
};

type ActionData = {
  error?: string;
  success?: string;
};
const badRequest = (data: ActionData) => Response.json(data, { status: 400 });
export const action: ActionFunction = async ({ request }) => {
  await verifyUserHasPermission(request, "admin.pricing.create");
  const { t } = await getTranslations(request);
  const form = await request.formData();

  const action = form.get("action")?.toString();

  if (action !== "create") {
    return badRequest({ error: t("shared.invalidForm") });
  }
  const order = Number(form.get("order"));
  const title = form.get("title")?.toString();
  const description = form.get("description")?.toString() ?? "";
  const model = Number(form.get("model"));
  const badge = form.get("badge")?.toString() ?? "";
  const groupTitle = form.get("group-title")?.toString() ?? "";
  const groupDescription = form.get("group-description")?.toString() ?? "";
  const isPublic = Boolean(form.get("is-public"));
  const isBillingRequired = Boolean(form.get("is-billing-required"));
  const hasQuantity = Boolean(form.get("has-quantity"));
  const canBuyAgain = Boolean(form.get("can-buy-again"));

  const featuresArr = form.getAll("features[]");
  const features: SubscriptionFeatureDto[] = featuresArr.map((f: FormDataEntryValue) => {
    const featureString = typeof f === 'string' ? f : f.toString();
    return JSON.parse(featureString);
  });

  const prices: { billingPeriod: SubscriptionBillingPeriod; price: number; currency: string; trialDays?: number }[] = form
    .getAll("prices[]")
    .map((f: FormDataEntryValue) => {
      const priceString = typeof f === 'string' ? f : f.toString();
      return JSON.parse(priceString);
    });

  const oneTimePricesWithZero = prices.filter((p) => p.billingPeriod === SubscriptionBillingPeriod.ONCE && p.price === 0);
  if (oneTimePricesWithZero.length > 0) {
    return badRequest({ error: "One-time prices can't be zero" });
  }

  const usageBasedPrices: SubscriptionUsageBasedPriceDto[] = form.getAll("usage-based-prices[]").map((f: FormDataEntryValue) => {
    const usageString = typeof f === 'string' ? f : f.toString();
    return JSON.parse(usageString);
  });

  if (!title) {
    return badRequest({ error: "Plan title required" });
  }

  const plan: SubscriptionProductDto = {
    stripeId: "",
    order,
    title,
    model,
    description,
    badge,
    groupTitle,
    groupDescription,
    active: true,
    public: isPublic,
    prices: [],
    features: [],
    usageBasedPrices,
    billingAddressCollection: isBillingRequired ? "required" : "auto",
    hasQuantity,
    canBuyAgain,
  };

  try {
    await createPlan(plan, prices, features, usageBasedPrices, t);
    await createAdminLog(request, "Created pricing plan", plan.title);

    return redirect("/admin/settings/pricing");
  } catch (e: any) {
    return badRequest({ error: e?.toString() });
  }
};

export default function NewPricingPlanRoute() {
  const data = useLoaderData<LoaderData>();
  const actionData = useActionData<ActionData>();

  useEffect(() => {
    if (actionData?.error) {
      toast.error(actionData.error);
    }
  }, [actionData]);

  return (
    <EditPageLayout title={<BackButtonWithTitle href="/admin/settings/pricing">New Plan</BackButtonWithTitle>}>
      <PricingPlanForm plans={data.plans} />
    </EditPageLayout>
  );
}
