import { SubscriptionPriceDto } from "~/application/dtos/subscriptions/SubscriptionPriceDto";
import { PricingModel } from "~/application/enums/subscriptions/PricingModel";
import { SubscriptionBillingPeriod } from "~/application/enums/subscriptions/SubscriptionBillingPeriod";
import { getSubscriptionProduct } from "../db/subscriptionProducts.db.server";

async function getPlanFromForm(form: FormData) {
  const productIdValue = form.get("product-id");
  const productId = productIdValue?.toString() ?? "";
  const billingPeriod = Number(form.get("billing-period")) as SubscriptionBillingPeriod;
  const currencyValue = form.get("currency");
  const currency = currencyValue?.toString() ?? "";
  const quantity = Number(form.get("quantity"));
  const couponValue = form.get("coupon");
  const coupon = couponValue !== null && couponValue !== undefined ? String(couponValue) : undefined;
  const isUpgradeValue = form.get("is-upgrade");
  const isUpgrade = (isUpgradeValue?.toString() ?? "") === "true";
  const isDowngradeValue = form.get("is-downgrade");
  const isDowngrade = (isDowngradeValue?.toString() ?? "") === "true";
  const referralValue = form.get("referral");
  const referral = referralValue !== null && referralValue !== undefined ? String(referralValue) : null;

  // eslint-disable-next-line no-console
  console.log("[Subscription]", {
    productId,
    billingPeriod: SubscriptionBillingPeriod[billingPeriod],
    currency,
    quantity,
    coupon,
    referral,
    isUpgrade,
    isDowngrade,
  });

  const product = await getSubscriptionProduct(productId);
  if (!product) {
    throw new Error("Invalid product");
  }

  let flatPrice: SubscriptionPriceDto | undefined = undefined;
  let freeTrialDays: number | undefined = undefined;
  if (product.model === PricingModel.ONCE) {
    flatPrice = product.prices.find((f) => f.currency === currency && f.billingPeriod === SubscriptionBillingPeriod.ONCE);
  } else {
    flatPrice = product.prices.find((f) => f.currency === currency && f.billingPeriod === billingPeriod);
  }
  const usageBasedPrices = product?.usageBasedPrices?.filter((f) => f.currency === currency);

  if (!flatPrice && usageBasedPrices?.length === 0) {
    throw new Error("Invalid price");
  }
  let mode: "payment" | "setup" | "subscription" = "subscription";
  const line_items: { price: string; quantity?: number }[] = [];
  if (product.model === PricingModel.ONCE) {
    mode = "payment";
  }

  if (flatPrice) {
    line_items.push({ price: flatPrice.stripeId, quantity });
    if (flatPrice.trialDays > 0) {
      freeTrialDays = flatPrice.trialDays;
    }
  }
  usageBasedPrices?.forEach((usageBasedPrice) => {
    line_items.push({ price: usageBasedPrice.stripeId });
  });

  return {
    mode,
    line_items,
    product,
    flatPrice,
    usageBasedPrices,
    freeTrialDays,
    coupon,
    isUpgrade,
    isDowngrade,
    referral,
  };
}

export default {
  getPlanFromForm,
};
