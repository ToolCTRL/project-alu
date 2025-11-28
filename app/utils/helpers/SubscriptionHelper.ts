import { SubscriptionPriceDto } from "~/application/dtos/subscriptions/SubscriptionPriceDto";
import { PricingModel } from "~/application/enums/subscriptions/PricingModel";
import { SubscriptionBillingPeriod } from "~/application/enums/subscriptions/SubscriptionBillingPeriod";
import { SubscriptionProductDto } from "~/application/dtos/subscriptions/SubscriptionProductDto";
import { getSubscriptionProduct } from "../db/subscriptionProducts.db.server";

type PlanForm = {
  productId: string;
  billingPeriod: SubscriptionBillingPeriod;
  currency: string;
  quantity: number;
  coupon?: string;
  isUpgrade: boolean;
  isDowngrade: boolean;
  referral: string | null;
};

function parsePlanForm(form: FormData): PlanForm {
  const productIdValue = form.get("product-id");
  const billingPeriodValue = form.get("billing-period");
  const currencyValue = form.get("currency");
  const couponValue = form.get("coupon");
  const isUpgradeValue = form.get("is-upgrade");
  const isDowngradeValue = form.get("is-downgrade");
  const referralValue = form.get("referral");

  return {
    productId: typeof productIdValue === "string" ? productIdValue : "",
    billingPeriod: Number(billingPeriodValue) as SubscriptionBillingPeriod,
    currency: typeof currencyValue === "string" ? currencyValue : "",
    quantity: Number(form.get("quantity")),
    coupon: typeof couponValue === "string" && couponValue.length > 0 ? couponValue : undefined,
    isUpgrade: typeof isUpgradeValue === "string" ? isUpgradeValue === "true" : false,
    isDowngrade: typeof isDowngradeValue === "string" ? isDowngradeValue === "true" : false,
    referral: typeof referralValue === "string" && referralValue.length > 0 ? referralValue : null,
  };
}

function findFlatPrice(product: SubscriptionProductDto, currency: string, billingPeriod: SubscriptionBillingPeriod) {
  if (product.model === PricingModel.ONCE) {
    return product.prices.find((f) => f.currency === currency && f.billingPeriod === SubscriptionBillingPeriod.ONCE);
  }
  return product.prices.find((f) => f.currency === currency && f.billingPeriod === billingPeriod);
}

function getUsageBasedPrices(product: SubscriptionProductDto, currency: string) {
  return product.usageBasedPrices?.filter((f) => f.currency === currency) ?? [];
}

function buildLineItems(flatPrice: SubscriptionPriceDto | undefined, usageBasedPrices: SubscriptionPriceDto[], quantity: number) {
  const line_items: { price: string; quantity?: number }[] = [];
  if (flatPrice) {
    line_items.push({ price: flatPrice.stripeId, quantity });
  }
  usageBasedPrices.forEach((usageBasedPrice) => {
    line_items.push({ price: usageBasedPrice.stripeId });
  });
  return line_items;
}

async function getPlanFromForm(form: FormData) {
  const parsedForm = parsePlanForm(form);

  // eslint-disable-next-line no-console
  console.log("[Subscription]", {
    productId: parsedForm.productId,
    billingPeriod: SubscriptionBillingPeriod[parsedForm.billingPeriod],
    currency: parsedForm.currency,
    quantity: parsedForm.quantity,
    coupon: parsedForm.coupon,
    referral: parsedForm.referral,
    isUpgrade: parsedForm.isUpgrade,
    isDowngrade: parsedForm.isDowngrade,
  });

  const product = await getSubscriptionProduct(parsedForm.productId);
  if (!product) {
    throw new Error("Invalid product");
  }

  const flatPrice = findFlatPrice(product, parsedForm.currency, parsedForm.billingPeriod);
  const usageBasedPrices = getUsageBasedPrices(product, parsedForm.currency);

  if (!flatPrice && usageBasedPrices.length === 0) {
    throw new Error("Invalid price");
  }
  const mode: "payment" | "setup" | "subscription" = product.model === PricingModel.ONCE ? "payment" : "subscription";
  const line_items = buildLineItems(flatPrice, usageBasedPrices, parsedForm.quantity);
  const freeTrialDays = flatPrice && flatPrice.trialDays > 0 ? flatPrice.trialDays : undefined;

  return {
    mode,
    line_items,
    product,
    flatPrice,
    usageBasedPrices,
    freeTrialDays,
    coupon: parsedForm.coupon,
    isUpgrade: parsedForm.isUpgrade,
    isDowngrade: parsedForm.isDowngrade,
    referral: parsedForm.referral,
  };
}

export default {
  getPlanFromForm,
};
