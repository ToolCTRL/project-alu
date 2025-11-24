import { SideBarItem } from "./SidebarItem";
import { SvgIcon } from "../enums/shared/SvgIcon";
import { TFunction } from "i18next";
import ExperimentIconFilled from "~/components/ui/icons/tests/ExperimentIconFilled";
import { AppConfiguration } from "~/utils/db/appConfiguration.db.server";

type Props = {
  t: TFunction;
  appConfiguration: AppConfiguration | null;
};

export const AdminSidebar = ({ t, appConfiguration }: Props): SideBarItem[] => [
  {
    title: "Konten & Benutzer",
    path: "",
    items: [
      {
        title: "Konten",
        path: "/admin/accounts",
        icon: SvgIcon.TENANTS,
        items: [],
        permission: "admin.accounts.view",
      },
      {
        title: "Benutzer",
        path: "/admin/accounts/users",
        icon: SvgIcon.USERS,
        items: [],
        permission: "admin.users.view",
      },
      {
        title: "Rollen & Berechtigungen",
        path: "/admin/accounts/roles-and-permissions",
        icon: SvgIcon.ROLES,
        items: [],
        permission: "admin.roles.view",
      },
    ],
  },
  {
    title: "CRM",
    path: "",
    items: [
      {
        title: "Übersicht",
        path: `/admin/crm`,
        icon: SvgIcon.DASHBOARD,
      },
      {
        title: "Datenbank",
        path: `/admin/crm/contacts`,
        icon: SvgIcon.CLIENTS,
      },
      {
        title: "Deal-Pipeline",
        path: `/admin/crm/opportunities?v=pipeline`,
        icon: SvgIcon.CLIENTS,
      },
      {
        title: "Ticket-Pipeline",
        path: `/admin/crm/tickets?v=tickets`,
        icon: SvgIcon.CLIENTS,
      },
    ],
  },
  {
    title: "Bild",
    path: "",
    items: [
      {
        title: "Entitäten",
        path: `/admin/entities`,
        icon: SvgIcon.ENTITIES,
        permission: "admin.entities.view",
      },
      {
        title: t("workflows.title"),
        path: `/admin/workflow-engine`,
        icon: SvgIcon.WORKFLOWS,
      },
      {
        title: "API",
        path: "/admin/api",
        icon: SvgIcon.KEYS,
        permission: "admin.apiKeys.view",
      },
      {
        title: t("models.event.plural"),
        path: "/admin/events",
        permission: "admin.events.view",
        icon: SvgIcon.EVENTS,
      },
      {
        title: "Playground",
        path: "/admin/playground",
        icon: <ExperimentIconFilled className="size-4" />,
        permission: "admin.events.view",
      },
      {
        title: t("models.portal.plural"),
        path: `/admin/portals`,
        icon: SvgIcon.PORTALS,
        hidden: !appConfiguration?.portals.enabled,
      },
    ],
  },
  {
    title: "",
    path: "",
    items: [
      {
        title: "Einstellungen",
        icon: SvgIcon.SETTINGS,
        path: `/admin/settings`,
      },
    ],
  },
];
