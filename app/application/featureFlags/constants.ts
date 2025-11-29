export const UI_REFRESH_FLAGS = {
  global: "ui-refresh",
  navigation: "ui-refresh-navigation",
  dashboard: "ui-refresh-dashboard",
  accounts: "ui-refresh-accounts",
  market: "ui-refresh-market",
  build: "ui-refresh-build",
  settings: "ui-refresh-settings",
  helpDesk: "ui-refresh-help-desk",
} as const;

export type UiRefreshFlag = (typeof UI_REFRESH_FLAGS)[keyof typeof UI_REFRESH_FLAGS];

export const UI_REFRESH_FLAG_GROUPS: Record<string, UiRefreshFlag[]> = {
  navigation: [UI_REFRESH_FLAGS.global, UI_REFRESH_FLAGS.navigation],
  dashboard: [UI_REFRESH_FLAGS.global, UI_REFRESH_FLAGS.dashboard],
  accounts: [UI_REFRESH_FLAGS.global, UI_REFRESH_FLAGS.accounts],
  market: [UI_REFRESH_FLAGS.global, UI_REFRESH_FLAGS.market],
  build: [UI_REFRESH_FLAGS.global, UI_REFRESH_FLAGS.build],
  settings: [UI_REFRESH_FLAGS.global, UI_REFRESH_FLAGS.settings],
  helpDesk: [UI_REFRESH_FLAGS.global, UI_REFRESH_FLAGS.helpDesk],
};

export const FEATURE_FLAG_ENV_KEYS = ["APP_FEATURE_FLAGS", "FEATURE_FLAGS"];

export function parseFeatureFlagString(value?: string | null): string[] {
  if (!value) {
    return [];
  }
  return value
    .split(",")
    .map((flag) => flag.trim())
    .filter((flag) => flag.length > 0);
}

export function getFeatureFlagsFromEnv(): string[] {
  const fromEnvKeys = FEATURE_FLAG_ENV_KEYS.flatMap((key) => parseFeatureFlagString(process.env[key]));

  // Default flags - always enabled
  const defaultFlags = [
    UI_REFRESH_FLAGS.global,
    UI_REFRESH_FLAGS.navigation,
    UI_REFRESH_FLAGS.dashboard,
  ];

  return Array.from(new Set([...defaultFlags, ...fromEnvKeys]));
}
