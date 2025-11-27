import clsx from "clsx";
import { useTranslation } from "react-i18next";
import CheckIcon from "~/components/ui/icons/CheckIcon";
import ExclamationTriangleIcon from "~/components/ui/icons/ExclamationTriangleIcon";
import XIcon from "~/components/ui/icons/XIcon";
import TableSimple from "~/components/ui/tables/TableSimple";
import { NotificationChannelDto, NotificationChannels } from "../services/NotificationChannels";
import { IGetTemplatesData } from "../services/.server/NotificationService";

function isValid(item: NotificationChannelDto, templates: IGetTemplatesData | null): boolean {
  const existing = templates?.data.find((f) => f.name === item.name);
  return Boolean(existing?.steps?.length);
}

interface NameCellProps {
  readonly name: string;
  readonly valid: boolean;
}

const NameCell = ({ name, valid }: NameCellProps) => {
  if (valid) {
    return <div>{name}</div>;
  }

  return (
    <div className="flex items-center space-x-1 text-red-600">
      <ExclamationTriangleIcon className="h-5 w-5 text-red-600" />
      <div>{name}</div>
    </div>
  );
};

interface DescriptionCellProps {
  readonly description: string;
  readonly valid: boolean;
}

const DescriptionCell = ({ description, valid }: DescriptionCellProps) => {
  return (
    <div className="text-muted-foreground max-w-xs overflow-x-auto">
      <div className={clsx(valid ? "" : "text-red-600")}>{description}</div>
    </div>
  );
};

interface RolesCellProps {
  readonly roles: string[] | undefined;
}

const RolesCell = ({ roles }: RolesCellProps) => {
  return <div className="text-muted-foreground">{roles?.map((f) => f).join(", ")}</div>;
};

interface SendButtonCellProps {
  readonly isActive: boolean;
  readonly onSendPreview: () => void;
  readonly sendLabel: string;
}

const SendButtonCell = ({ isActive, onSendPreview, sendLabel }: SendButtonCellProps) => {
  return (
    <div>
      <button
        type="button"
        className={clsx("font-medium", isActive ? "border-theme-300 border-b border-dashed hover:border-dotted" : "cursor-not-allowed opacity-90")}
        onClick={onSendPreview}
      >
        {sendLabel}
      </button>
    </div>
  );
};

interface ActiveStatusCellProps {
  readonly active: boolean;
}

const ActiveStatusCell = ({ active }: ActiveStatusCellProps) => {
  return <div>{active ? <CheckIcon className="text-theme-500 h-4 w-4" /> : <XIcon className="text-muted-foreground h-4 w-4" />}</div>;
};

interface HasStepsCellProps {
  readonly hasSteps: boolean;
}

const HasStepsCell = ({ hasSteps }: HasStepsCellProps) => {
  return <div>{hasSteps ? <CheckIcon className="text-theme-500 h-4 w-4" /> : <XIcon className="h-4 w-4 text-red-600" />}</div>;
};

interface IdLinkCellProps {
  readonly id: string | undefined;
  readonly createLabel: string;
}

const IdLinkCell = ({ id, createLabel }: IdLinkCellProps) => {
  if (id) {
    return (
      <a
        href={`https://web.novu.co/templates/edit/${id}`}
        target="_blank"
        rel="noreferrer"
        className="hover:border-dotter hover:border-theme-300 border-border border-b border-dashed"
      >
        {id}
      </a>
    );
  }

  return (
    <a
      href={"https://web.novu.co/templates/create"}
      target="_blank"
      rel="noreferrer"
      className="hover:border-dotter hover:border-theme-300 border-border border-b border-dashed"
    >
      {createLabel}
    </a>
  );
};

export default function NotificationTemplatesTable({
  items,
  onDelete,
  onSendPreview,
}: {
  readonly items: IGetTemplatesData | null;
  readonly onDelete: (id: string) => void;
  readonly onSendPreview: (item: NotificationChannelDto) => void;
}) {
  const { t } = useTranslation();
  function getCreated(i: NotificationChannelDto) {
    return items?.data.find((f) => f.name === i.name);
  }
  return (
    <TableSimple
      items={NotificationChannels}
      pagination={{
        page: (items?.page ?? 0) + 1,
        pageSize: items?.pageSize ?? 0,
        totalItems: items?.totalCount ?? 0,
        totalPages: Math.ceil((items?.totalCount ?? 0) / (items?.pageSize ?? 0)),
      }}
      headers={[
        {
          name: "name",
          title: "Name",
          value: (i) => <NameCell name={i.name} valid={isValid(i, items)} />,
        },
        {
          name: "description",
          title: "Description",
          className: "w-full",
          value: (i) => <DescriptionCell description={i.description} valid={isValid(i, items)} />,
        },
        {
          name: "roles",
          title: "Sends to roles",
          value: (i) => <RolesCell roles={i.roles} />,
        },
        {
          name: "send",
          title: t("shared.preview"),
          value: (i) => <SendButtonCell isActive={getCreated(i)?.active ?? false} onSendPreview={() => onSendPreview(i)} sendLabel={t("shared.send")} />,
        },
        {
          name: "active",
          title: "Active",
          value: (i) => <ActiveStatusCell active={getCreated(i)?.active ?? false} />,
        },
        {
          name: "hasSteps",
          title: "Has steps",
          value: (i) => <HasStepsCell hasSteps={(getCreated(i)?.steps ?? []).length > 0} />,
        },
        {
          name: "_id",
          title: "_id",
          value: (i) => <IdLinkCell id={getCreated(i)?._id} createLabel={t("shared.create")} />,
        },
      ]}
    ></TableSimple>
  );
}
