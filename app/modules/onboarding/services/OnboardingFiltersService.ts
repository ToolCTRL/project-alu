import { OnboardingFilter } from "@prisma/client";

async function matches({ userId, tenantId, filter }: { userId: string; tenantId: string | null; filter: OnboardingFilter }) {
  throw Response.json({ message: "Pro feature 🚀" }, { status: 501 });
}

export default {
  matches,
};
