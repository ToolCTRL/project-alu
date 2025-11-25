import { SetupItem } from "~/application/dtos/setup/SetupItem";
import { getAllSubscriptionProducts } from "../db/subscriptionProducts.db.server";

export async function getSetupSteps(): Promise<SetupItem[]> {
  return [await getPricingStep()];
}

async function getPricingStep(): Promise<SetupItem> {
  const items = await getAllSubscriptionProducts();
  return {
    title: "Pricing",
    description: "Create a good pricing strategy and generate the plans and prices on Stripe.",
    completed: items.length > 0,
    path: "/admin/settings/pricing",
  };
}
