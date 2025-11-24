import { Link } from "react-router";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Colors } from "~/application/enums/shared/Colors";
import { useRootData } from "~/utils/data/useRootData";
import { AnalyticsOverviewDto } from "~/utils/helpers/AnalyticsHelper";
import NumberUtils from "~/utils/shared/NumberUtils";
import ColorBadge from "../ui/badges/ColorBadge";

export default function AnalyticsOverview({ overview }: { overview: AnalyticsOverviewDto }) {
  const { t } = useTranslation();
  const { authenticated } = useRootData();
  return (
    <div className="text-foreground space-y-2">
      <dl className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {authenticated ? (
          <>
            <Link to="visitors" className="hover:bg-secondary bg-background border-border overflow-hidden rounded-lg border px-4 py-3 shadow-xs">
              <dt className="text-muted-foreground truncate text-xs font-medium uppercase">{t("analytics.uniqueVisitors")}</dt>
              <dd className="text-foreground mt-1 truncate text-2xl font-semibold">{NumberUtils.intFormat(overview.uniqueVisitors)}</dd>
            </Link>
            <Link to="page-views" className="hover:bg-secondary bg-background border-border overflow-hidden rounded-lg border px-4 py-3 shadow-xs">
              <dt className="text-muted-foreground truncate text-xs font-medium uppercase">{t("analytics.pageViews")}</dt>
              <dd className="text-foreground mt-1 truncate text-2xl font-semibold">{NumberUtils.intFormat(overview.pageViews)}</dd>
            </Link>
            <Link to="events" className="hover:bg-secondary bg-background border-border overflow-hidden rounded-lg border px-4 py-3 shadow-xs">
              <dt className="text-muted-foreground truncate text-xs font-medium uppercase">{t("analytics.events")}</dt>
              <dd className="text-foreground mt-1 truncate text-2xl font-semibold">{NumberUtils.intFormat(overview.events)}</dd>
            </Link>
          </>
        ) : (
          <>
            <div className="bg-card border-border overflow-hidden rounded-lg border px-4 py-3 shadow-xs">
              <dt className="text-muted-foreground truncate text-xs font-medium uppercase">{t("analytics.uniqueVisitors")}</dt>
              <dd className="text-foreground mt-1 truncate text-2xl font-semibold">{NumberUtils.intFormat(overview.uniqueVisitors)}</dd>
            </div>
            <div className="bg-card border-border overflow-hidden rounded-lg border px-4 py-3 shadow-xs">
              <dt className="text-muted-foreground truncate text-xs font-medium uppercase">{t("analytics.pageViews")}</dt>
              <dd className="text-foreground mt-1 truncate text-2xl font-semibold">{NumberUtils.intFormat(overview.pageViews)}</dd>
            </div>
            <div className="bg-card border-border overflow-hidden rounded-lg border px-4 py-3 shadow-xs">
              <dt className="text-muted-foreground truncate text-xs font-medium uppercase">{t("analytics.events")}</dt>
              <dd className="text-foreground mt-1 truncate text-2xl font-semibold">{NumberUtils.intFormat(overview.events)}</dd>
            </div>
          </>
        )}
        <div className="bg-background border-border overflow-hidden rounded-lg border px-4 py-3 shadow-2xs">
          <dt className="text-muted-foreground flex items-center space-x-2 truncate text-xs font-medium uppercase">
            <ColorBadge color={overview.liveVisitors === 0 ? Colors.GRAY : Colors.GREEN} />
            <div>{t("analytics.liveVisitors")}</div>
          </dt>
          <dd className="text-foreground mt-1 truncate text-2xl font-semibold">{NumberUtils.intFormat(overview.liveVisitors)} </dd>
        </div>
      </dl>

      <div className="border-border bg-background rounded-md border-2 border-dotted">
        <div className="text-muted-foreground flex justify-center py-24 text-sm font-bold italic">Chart (under construction...)</div>
      </div>

      <div className="grid gap-2 md:grid-cols-3">
        <TopItems tabs={[{ title: "Top HTTP referrers", items: overview.top.httpReferrers, fallbackName: "Direct", bgClassName: "bg-orange-50" }]} />
        <TopItems tabs={[{ title: "Top sources", items: overview.top.sources, fallbackName: "noreferrer", bgClassName: "bg-indigo-50" }]} />
        <TopItems
          tabs={[
            { title: "Top pages", items: overview.top.urls, fallbackName: "?", bgClassName: "bg-emerald-50", tabTitle: "Pages" },
            { title: "Top routes", items: overview.top.routes, fallbackName: "?", bgClassName: "bg-emerald-50", tabTitle: "Routes" },
          ]}
        />
        <TopItems tabs={[{ title: "Operating systems", items: overview.top.os, fallbackName: "?", bgClassName: "bg-secondary" }]} />
        <TopItems tabs={[{ title: "Devices", items: overview.top.devices, fallbackName: "?", bgClassName: "bg-secondary" }]} />
        <TopItems tabs={[{ title: "Countries", items: overview.top.countries, fallbackName: "?", bgClassName: "bg-secondary" }]} />
      </div>
    </div>
  );
}

interface TopItemDto {
  title: string;
  items: { name: string | null; count: number }[];
  viewMoreRoute?: string;
  fallbackName?: string;
  bgClassName?: string;
  tabTitle?: string;
}
function TopItems({ tabs }: { tabs: TopItemDto[] }) {
  const [selectedTab, setSelectedTab] = useState(0);
  const [tab, setTab] = useState(tabs[0]);

  useEffect(() => {
    setTab(tabs[selectedTab]);
  }, [selectedTab, tabs]);

  return (
    <div className="bg-background border-border space-y-1 rounded-md border px-4 py-2 shadow-2xs">
      <div className="flex items-center justify-between space-x-2">
        <h4 className="text-sm font-bold">{tab.title}</h4>
        {tabs.length > 1 && (
          <div className="flex items-center space-x-1">
            {tabs.map((item, idx) => {
              return (
                <button
                  key={item.tabTitle}
                  type="button"
                  onClick={() => setSelectedTab(idx)}
                  className={clsx(
                    "text-xs font-medium",
                    selectedTab === idx ? "text-theme-500 hover:text-theme-600 underline" : "text-muted-foreground hover:text-muted-foreground"
                  )}
                >
                  {item.tabTitle}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <TopItemsData {...tab} />
    </div>
  );
}

function TopItemsData({ title, items, viewMoreRoute, fallbackName, bgClassName }: TopItemDto) {
  const { authenticated } = useRootData();
  function getWidthPercentageCss(current: { count: number }) {
    const counts = items.map((item) => {
      return item.count;
    });
    const max = Math.max(...counts);

    const percentage = (current.count / max) * 100;
    if (percentage >= 95) {
      return "w-[95%]";
    } else if (percentage >= 90) {
      return "w-[90%]";
    } else if (percentage >= 80) {
      return "w-[80%]";
    } else if (percentage >= 70) {
      return "w-[70%]";
    } else if (percentage >= 60) {
      return "w-[60%]";
    } else if (percentage >= 50) {
      return "w-[50%]";
    } else if (percentage >= 40) {
      return "w-[40%]";
    } else if (percentage >= 30) {
      return "w-[30%]";
    } else if (percentage >= 20) {
      return "w-[20%]";
    } else if (percentage >= 10) {
      return "w-[10%]";
    } else if (percentage >= 3) {
      return "w-[3%]";
    }
    return "w-[3%]";
  }
  return (
    <>
      <div className="h-48 space-y-1 overflow-y-auto">
        {items.map((item) => {
          return (
            <div key={`${item.name}-${item.count}`} className="flex justify-between space-x-2">
              <div className="w-full truncate">
                <div className={clsx("overflow-visible px-2 py-0.5 text-sm", getWidthPercentageCss(item), bgClassName ?? "bg-orange-50")}>
                  {fallbackName ? <span>{!item.name ? fallbackName : item.name}</span> : <div>{item.name}</div>}
                </div>
              </div>
              <div className="w-10 px-2 py-0.5 text-right text-sm font-extrabold">{NumberUtils.intFormat(item.count)}</div>
            </div>
          );
        })}
      </div>
      {viewMoreRoute && authenticated && (
        <Link to={viewMoreRoute} className="text-muted-foreground hover:text-foreground/80 flex justify-center p-1 text-xs font-medium underline">
          View more
        </Link>
      )}
    </>
  );
}
