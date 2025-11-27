import { LoaderFunctionArgs, MetaFunction } from "react-router";
import ServerError from "~/components/ui/errors/ServerError";
import { OnboardingSummaryApi } from "~/modules/onboarding/routes/api/OnboardingSummaryApi.server";
import OnboardingOverviewRoute from "~/modules/onboarding/routes/components/OnboardingSummaryRoute";

export const meta: MetaFunction<typeof loader> = ({ data }) => data?.meta || [];
export const loader = (args: LoaderFunctionArgs) => OnboardingSummaryApi.loader(args);

function OnboardingIndex() {
  return <OnboardingOverviewRoute />;
}

export default OnboardingIndex;

export function ErrorBoundary() {
  return <ServerError />;
}
