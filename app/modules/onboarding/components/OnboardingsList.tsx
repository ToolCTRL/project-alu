import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import TableSimple from "~/components/ui/tables/TableSimple";
import DateUtils from "~/utils/shared/DateUtils";
import { OnboardingWithDetails } from "../db/onboarding.db.server";
import OnboardingBadge from "./OnboardingBadge";

interface OnboardingTitleCellProps {
  readonly item: OnboardingWithDetails;
  readonly sessionPluralLabel: string;
  readonly activeLabel: string;
  readonly startedLabel: string;
  readonly dismissedLabel: string;
  readonly completedLabel: string;
}

function OnboardingTitleCell({ item, sessionPluralLabel, activeLabel, startedLabel, dismissedLabel, completedLabel }: OnboardingTitleCellProps) {
  return (
    <Link to={`/admin/onboarding/onboardings/${item.id}`} className="group flex flex-col">
      <div className="flex items-center space-x-2">
        <div className="text-base font-bold group-hover:underline">{item.title}</div>
        <div>
          <OnboardingBadge item={item} />
        </div>
        {item.createdAt ? (
          <>
            <div>•</div>
            <div className="text-muted-foreground text-sm">
              <span>{DateUtils.dateAgo(item.createdAt)}</span>
            </div>
          </>
        ) : null}
      </div>
      <div className="flex items-center space-x-2">
        <div className="text-muted-foreground text-sm">
          {item.sessions.length} {sessionPluralLabel}
        </div>
        <div>•</div>
        <div className="text-muted-foreground text-sm">
          {item.sessions.filter((f) => f.status === "active").length} {activeLabel}
        </div>
        <div>•</div>
        <div className="text-muted-foreground text-sm">
          {item.sessions.filter((f) => f.status === "started").length} {startedLabel}
        </div>
        <div>•</div>
        <div className="text-muted-foreground text-sm">
          {item.sessions.filter((f) => f.status === "dismissed").length} {dismissedLabel}
        </div>
        <div>•</div>
        <div className="text-muted-foreground text-sm">
          {item.sessions.filter((f) => f.status === "completed").length} {completedLabel}
        </div>
      </div>
    </Link>
  );
}

export default function OnboardingsList({ items, groupByStatus }: { readonly items: OnboardingWithDetails[]; readonly groupByStatus: { status: string; count: number }[] }) {
  const { t } = useTranslation();
  return (
    <TableSimple
      items={items}
      actions={[{ title: t("shared.overview"), onClickRoute: (_, i) => `${i.id}` }]}
      headers={[
        {
          name: "title",
          title: t("onboarding.object.title"),
          className: "w-full",
          value: (i: OnboardingWithDetails) => (
            <OnboardingTitleCell
              item={i}
              sessionPluralLabel={t("onboarding.session.plural").toLowerCase()}
              activeLabel={t("onboarding.object.sessions.active").toLowerCase()}
              startedLabel={t("onboarding.object.sessions.started").toLowerCase()}
              dismissedLabel={t("onboarding.object.sessions.dismissed").toLowerCase()}
              completedLabel={t("onboarding.object.sessions.completed").toLowerCase()}
            />
          ),
        },
      ]}
      noRecords={
        <div className="p-12 text-center">
          <h3 className="text-foreground mt-1 text-sm font-medium">{t("onboarding.object.empty.title")}</h3>
          <p className="text-muted-foreground mt-1 text-sm">{t("onboarding.object.empty.description")}</p>
        </div>
      }
    />
  );
}
