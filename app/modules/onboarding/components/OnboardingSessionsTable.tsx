import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { TFunction } from "i18next";
import { RowHeaderDisplayDto } from "~/application/dtos/data/RowHeaderDisplayDto";
import TenantCell from "~/components/core/tenants/TenantCell";
import UserBadge from "~/components/core/users/UserBadge";
import ButtonTertiary from "~/components/ui/buttons/ButtonTertiary";
import DateCell from "~/components/ui/dates/DateCell";
import XIcon from "~/components/ui/icons/XIcon";
import ShowPayloadModalButton from "~/components/ui/json/ShowPayloadModalButton";
import Modal from "~/components/ui/modals/Modal";
import TableSimple from "~/components/ui/tables/TableSimple";
import { useAppOrAdminData } from "~/utils/data/useAppOrAdminData";
import { getUserHasPermission } from "~/utils/helpers/PermissionsHelper";
import DateUtils from "~/utils/shared/DateUtils";
import { OnboardingSessionWithDetails } from "../db/onboardingSessions.db.server";
import { OnboardingFilterMetadataDto } from "../dtos/OnboardingFilterMetadataDto";
import OnboardingSessionUtils, { OnboardingSessionActivityDto } from "../utils/OnboardingSessionUtils";
import OnboardingBadge from "./OnboardingBadge";
import OnboardingSessionBadge from "./OnboardingSessionBadge";

interface UserCellProps {
  readonly user: OnboardingSessionWithDetails["user"];
  readonly tenant: OnboardingSessionWithDetails["tenant"];
}

const UserCell = ({ user, tenant }: UserCellProps) => {
  return (
    <div>
      <UserBadge item={user} />
      <TenantCell item={tenant} />
    </div>
  );
};

interface ActivityCellProps {
  readonly item: OnboardingSessionWithDetails;
  readonly metadata: OnboardingFilterMetadataDto;
  readonly t: TFunction;
  readonly onSelect: (item: OnboardingSessionWithDetails) => void;
}

const ActivityCell = ({ item, metadata, t, onSelect }: ActivityCellProps) => {
  return (
    <div>
      <button type="button" onClick={() => onSelect(item)} className="hover:border-theme-400 border-border border-b border-dotted hover:border-dashed">
        {OnboardingSessionUtils.getActivity({ t, item, metadata }).length} activities
      </button>
    </div>
  );
};

interface StepsCellProps {
  readonly item: OnboardingSessionWithDetails;
  readonly completedLabel: string;
  readonly onSelect: (item: OnboardingSessionWithDetails) => void;
}

const StepsCell = ({ item, completedLabel, onSelect }: StepsCellProps) => {
  return (
    <div>
      <button type="button" onClick={() => onSelect(item)} className="hover:border-theme-400 border-border border-b border-dotted hover:border-dashed">
        {item.sessionSteps.filter((f) => f.completedAt).length}/{item.sessionSteps.length} {completedLabel}
      </button>
    </div>
  );
};

interface DateOrIconCellProps {
  readonly date: Date | null;
}

const DateOrIconCell = ({ date }: DateOrIconCellProps) => {
  return <div className="flex justify-center">{date ? <DateCell date={date} /> : <XIcon className="h-4 w-4 text-red-500" />}</div>;
};

interface OnboardingHeaderCellProps {
  readonly item: OnboardingSessionWithDetails;
}

const OnboardingHeaderCell = ({ item }: OnboardingHeaderCellProps) => {
  return (
    <div className="flex items-center space-x-2">
      <div className="text-base font-bold">{item.onboarding.title}</div>
      <div>
        <OnboardingBadge item={item.onboarding} />
      </div>
    </div>
  );
};

interface DeleteActionCellProps {
  readonly item: OnboardingSessionWithDetails;
  readonly onDelete: ((item: OnboardingSessionWithDetails) => void) | undefined;
  readonly canDelete: boolean;
  readonly deleteLabel: string;
}

const DeleteActionCell = ({ item, onDelete, canDelete, deleteLabel }: DeleteActionCellProps) => {
  return (
    <div className="flex items-center space-x-2">
      {onDelete && (
        <ButtonTertiary disabled={!canDelete} destructive type="button" onClick={() => onDelete(item)}>
          {deleteLabel}
        </ButtonTertiary>
      )}
    </div>
  );
};

export default function OnboardingSessionsTable({
  items,
  onDelete,
  metadata,
  withOnboarding = true,
}: {
  readonly items: OnboardingSessionWithDetails[];
  readonly onDelete?: (item: OnboardingSessionWithDetails) => void;
  readonly metadata: OnboardingFilterMetadataDto;
  readonly withOnboarding?: boolean;
}) {
  const { t } = useTranslation();
  const [selected, setSelected] = useState<OnboardingSessionWithDetails>();
  const [headers, setHeaders] = useState<RowHeaderDisplayDto<OnboardingSessionWithDetails>[]>([]);
  const appOrAdminData = useAppOrAdminData();

  useEffect(() => {
    const headers: RowHeaderDisplayDto<OnboardingSessionWithDetails>[] = [
      {
        name: "status",
        title: t("onboarding.session.status"),
        value: (i: OnboardingSessionWithDetails) => <OnboardingSessionBadge item={i} />,
      },
      {
        name: "user",
        title: t("models.user.object"),
        value: (i: OnboardingSessionWithDetails) => <UserCell user={i.user} tenant={i.tenant} />,
      },
      {
        name: "activity",
        title: t("onboarding.session.activity"),
        value: (i: OnboardingSessionWithDetails) => <ActivityCell item={i} metadata={metadata} t={t} onSelect={setSelected} />,
      },
      {
        name: "steps",
        title: t("onboarding.session.steps"),
        value: (i: OnboardingSessionWithDetails) => <StepsCell item={i} completedLabel={t("shared.completed").toLowerCase()} onSelect={setSelected} />,
      },
      {
        name: "actions",
        title: t("onboarding.session.actions"),
        value: (i: OnboardingSessionWithDetails) => <ShowPayloadModalButton title="Actions" description={`${i.actions.length} actions`} payload={JSON.stringify(i.actions)} />,
      },
      {
        name: "createdAt",
        title: t("shared.createdAt"),
        value: (i: OnboardingSessionWithDetails) => <DateOrIconCell date={i.createdAt} />,
      },
      {
        name: "startedAt",
        title: t("onboarding.session.startedAt"),
        value: (i: OnboardingSessionWithDetails) => <DateOrIconCell date={i.startedAt} />,
      },
      {
        name: "dismissedAt",
        title: t("onboarding.session.dismissedAt"),
        value: (i: OnboardingSessionWithDetails) => <DateOrIconCell date={i.dismissedAt} />,
      },
      {
        name: "completedAt",
        title: t("onboarding.session.completedAt"),
        value: (i: OnboardingSessionWithDetails) => <DateOrIconCell date={i.completedAt} />,
      },
    ];
    if (withOnboarding) {
      headers.unshift({
        name: "onboarding",
        title: t("onboarding.title"),
        value: (i: OnboardingSessionWithDetails) => <OnboardingHeaderCell item={i} />,
      });
    }
    headers.push({
      name: "actions",
      title: t("shared.actions"),
      value: (i: OnboardingSessionWithDetails) => <DeleteActionCell item={i} onDelete={onDelete} canDelete={getUserHasPermission(appOrAdminData, "admin.onboarding.delete")} deleteLabel={t("shared.delete")} />,
    });
    setHeaders(headers);
  }, [appOrAdminData, metadata, onDelete, t, withOnboarding]);
  return (
    <>
      <SessionModal item={selected} open={selected !== undefined} onClose={() => setSelected(undefined)} metadata={metadata} />
      <TableSimple
        items={items}
        actions={
          [
            // { title: t("shared.overview"), onClickRoute: (_, i) => `${i.id}` }
          ]
        }
        headers={headers}
        noRecords={
          <div className="p-12 text-center">
            <h3 className="text-foreground mt-1 text-sm font-medium">{t("onboarding.session.empty.title")}</h3>
            <p className="text-muted-foreground mt-1 text-sm">{t("onboarding.session.empty.description")}</p>
          </div>
        }
      />
    </>
  );
}

function SessionModal({
  item,
  open,
  onClose,
  metadata,
}: {
  readonly item?: OnboardingSessionWithDetails;
  readonly open: boolean;
  readonly onClose: () => void;
  readonly metadata: OnboardingFilterMetadataDto;
}) {
  const { t } = useTranslation();
  const [items, setItems] = useState<OnboardingSessionActivityDto[]>([]);
  useEffect(() => {
    if (!item) {
      return;
    }
    setItems(OnboardingSessionUtils.getActivity({ t, item, metadata }));
  }, [item, metadata, t]);
  return (
    <Modal open={open} setOpen={onClose} size="2xl">
      <div className="bg-background inline-block w-full overflow-hidden text-left align-bottom sm:align-middle">
        <div className="flex justify-between space-x-2">
          <h3 className="text-foreground text-lg font-medium leading-6">Session</h3>
          <div className="text-muted-foreground text-sm italic">{item?.id}</div>
        </div>
        <div className="mt-4 space-y-2">
          {" "}
          <TableSimple
            items={items}
            headers={[
              {
                name: "createdAt",
                title: "Date",
                value: (i) => <div className="text-muted-foreground">{DateUtils.dateYMDHMS(i.createdAt)}</div>,
              },
              {
                name: "type",
                title: "Type",
                value: (i) => i.type,
              },
              {
                name: "description",
                title: "Description",
                value: (i) => i.description,
                className: "w-full",
              },
            ]}
          />
        </div>
      </div>
    </Modal>
  );
}
