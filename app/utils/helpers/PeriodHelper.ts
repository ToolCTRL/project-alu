import DateUtils from "../shared/DateUtils";

export const PeriodFilters = [
  { value: "all-time", name: "app.shared.periods.ALL_TIME" },
  { value: "last-year", name: "app.shared.periods.LAST_YEAR" },
  { value: "last-3-months", name: "app.shared.periods.LAST_3_MONTHS" },
  { value: "last-30-days", name: "app.shared.periods.LAST_30_DAYS" },
  { value: "last-7-days", name: "app.shared.periods.LAST_7_DAYS" },
  { value: "last-24-hours", name: "app.shared.periods.LAST_24_HOURS" },
] as const;
export type PeriodFilter = (typeof PeriodFilters)[number]["value"];
export const defaultPeriodFilter = "last-30-days";

const PERIOD_DAYS_MAP: Record<string, number | undefined> = {
  "all-time": undefined,
  "last-year": 365,
  "last-3-months": 90,
  "last-30-days": 30,
  "last-7-days": 7,
  "last-24-hours": 1,
};

function getGreaterThanOrEqualsFromRequest({ request }: { request: Request }) {
  const searchParams = new URL(request.url).searchParams;
  const countFilter = searchParams.get("period") ?? defaultPeriodFilter;
  const days = PERIOD_DAYS_MAP[countFilter];

  return days !== undefined ? DateUtils.daysFromDate(new Date(), days * -1) : undefined;
}

export default {
  getGreaterThanOrEqualsFromRequest,
};
