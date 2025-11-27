import { CookieCategory } from "~/application/cookies/CookieCategory";
import { AppConfiguration } from "../db/appConfiguration.db.server";
import CookieHelper from "../helpers/CookieHelper";
import { UserSession } from "../session.server";

declare global {
  var gtag: ((option: string, gaTrackingId: string, options: Record<string, unknown>) => void) | undefined;
}

type AnalyticsProps = {
  url: string;
  rootData: { userSession: UserSession; appConfiguration: AppConfiguration };
  route?: string;
};

function addPageView({ url, rootData, route }: AnalyticsProps) {
  const gaTrackingId = rootData.appConfiguration?.analytics.googleAnalyticsTrackingId;
  if (CookieHelper.hasConsent(rootData.userSession, CookieCategory.ADVERTISEMENT) && gaTrackingId) {
    if (globalThis.gtag) {
      globalThis.gtag("config", gaTrackingId, {
        page_path: url,
      });
    } else {
      // eslint-disable-next-line no-console
      console.warn("window.gtag is not defined. This could mean your google analytics script has not loaded on the page yet.");
    }
  }
}

type EventProps = AnalyticsProps & {
  url?: string;
  action: string;
  category: string;
  label: string;
  value: string;
};
function addEvent({ url, route, action, category, label, value, rootData }: EventProps) {
  const gaTrackingId = rootData.appConfiguration?.analytics.googleAnalyticsTrackingId;
  if (CookieHelper.hasConsent(rootData.userSession, CookieCategory.ADVERTISEMENT) && gaTrackingId) {
    if (globalThis.gtag) {
      globalThis.gtag("event", action, {
        event_category: category,
        event_label: label,
        value: value,
      });
    } else {
      // eslint-disable-next-line no-console
      console.warn("window.gtag is not defined. This could mean your google analytics script has not loaded on the page yet.");
    }
  }
}

export type AnalyticsOverviewDto = {
  uniqueVisitors: number;
  pageViews: number;
  events: number;
  liveVisitors: number;
  top: {
    sources: { name: string | null; count: number }[];
    httpReferrers: { name: string | null; count: number }[];
    urls: { name: string | null; count: number }[];
    routes: { name: string | null; count: number }[];
    os: { name: string | null; count: number }[];
    devices: { name: string | null; count: number }[];
    countries: { name: string | null; count: number }[];
  };
};

export default {
  addPageView,
  addEvent,
};
