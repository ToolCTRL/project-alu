import { SubscriptionPriceDto } from "~/application/dtos/subscriptions/SubscriptionPriceDto";
import { PricingModel } from "~/application/enums/subscriptions/PricingModel";
import { SubscriptionBillingPeriod } from "~/application/enums/subscriptions/SubscriptionBillingPeriod";
import { getSubscriptionProduct } from "../db/subscriptionProducts.db.server";

async function getPlanFromForm(form: FormData) {
  const productIdValue = form.get("product-id");
  const productId = typeof productIdValue === "string" ? productIdValue : "";
  const billingPeriod = Number(form.get("billing-period")) as SubscriptionBillingPeriod;
  const currencyValue = form.get("currency");
  const currency = typeof currencyValue === "string" ? currencyValue : "";
  const quantity = Number(form.get("quantity"));
  const couponValue = form.get("coupon");
  const coupon = typeof couponValue === "string" && couponValue.length > 0 ? couponValue : undefined;
  const isUpgradeValue = form.get("is-upgrade");
  const isUpgrade = typeof isUpgradeValue === "string" ? isUpgradeValue === "true" : false;
  const isDowngradeValue = form.get("is-downgrade");
  const isDowngrade = typeof isDowngradeValue === "string" ? isDowngradeValue === "true" : false;
  const referralValue = form.get("referral");
  const referral = typeof referralValue === "string" && referralValue.length > 0 ? referralValue : null;

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
