import { SubscriptionBillingPeriod } from "~/application/enums/subscriptions/SubscriptionBillingPeriod";

export interface CreateUsageBasedPriceTiersDto {
  currency: string;
  billingPeriod: SubscriptionBillingPeriod;
  usage_type: "licensed" | "metered";
  aggregate_usage: "last_during_period" | "last_ever" | "max" | "sum" | string;
  tiers_mode: "graduated" | "volume" | string;
  billing_scheme: "per_unit" | "tiered" | string;
  tiers: {
    from: number;
    up_to: "inf" | number;
    unit_amount: number | undefined;
    flat_amount: number | undefined;
  }[];
}
