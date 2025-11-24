import { TFunction } from "i18next";
import { OnboardingWithDetails } from "../db/onboarding.db.server";

async function setSteps(_: { item: OnboardingWithDetails; form: FormData; t: TFunction }) {
  throw Response.json({ message: "Pro feature 🚀" }, { status: 501 });
}
export default {
  setSteps,
};
