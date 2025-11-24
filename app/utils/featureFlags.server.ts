import { getFeatureFlagsFromEnv, parseFeatureFlagString } from "~/application/featureFlags/constants";

type ResolveFeatureFlagsOptions = {
  request: Request;
  allowDebugParam?: boolean;
};

export function resolveFeatureFlags({ request, allowDebugParam = process.env.NODE_ENV === "development" }: ResolveFeatureFlagsOptions) {
  const envFlags = getFeatureFlagsFromEnv();
  const url = new URL(request.url);
  const debugFlags = allowDebugParam ? url.searchParams.getAll("debugFlag") : [];
  const disabledFlags = url.searchParams.getAll("disableFlag");
  const cookieFlags = parseFeatureFlagString(url.searchParams.get("featureFlags"));

  const availableFlags = new Set<string>([...envFlags, ...cookieFlags, ...debugFlags]);

  disabledFlags.forEach((flag) => {
    if (availableFlags.has(flag)) {
      availableFlags.delete(flag);
    }
  });

  return Array.from(availableFlags);
}

export function hasFeatureFlag(flag: string, flags: string[] = []) {
  return flags.includes(flag);
}
