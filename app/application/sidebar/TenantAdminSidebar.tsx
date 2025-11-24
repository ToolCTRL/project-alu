import { SideBarItem } from "./SidebarItem";
import { SvgIcon } from "../enums/shared/SvgIcon";
import { TFunction } from "i18next";

type Props = {
  t: TFunction;
  tenantSlug: string;
};

export const TenantAdminSidebar = ({ t, tenantSlug }: Props): SideBarItem[] => [
  {
    title: t(""),
    path: "",
    items: [
      {
        title: t("app.sidebar.dashboard"),
        path: `/app/${tenantSlug}/admin`,
        icon: SvgIcon.DASHBOARD,
        permission: "tenant.dashboard.view",
      },
      {
        title: t("app.sidebar.metrics"),
        path: `/app/${tenantSlug}/admin/kpis`,
        icon: SvgIcon.METRICS,
        permission: "tenant.dashboard.view",
      },
    ],
  },
  {
    title: t("segments.manage"),
    path: "",
    items: [
      {
        title: t("app.sidebar.team"),
        path: `/app/${tenantSlug}/settings/members`,
        icon: SvgIcon.USERS,
        isCollapsible: true,
        items: [
          {
            title: t("app.sidebar.members"),
            path: `/app/${tenantSlug}/settings/members`,
            items: [],
            permission: "tenant.team.view",
          },
          {
            title: t("app.sidebar.rolesAndPermissions"),
            path: `/app/${tenantSlug}/settings/roles-and-permissions`,
            items: [],
            permission: "tenant.team.manage",
          },
        ],
        permission: "tenant.team.view",
      },
      {
        title: t("app.sidebar.subscription"),
        path: `/app/${tenantSlug}/settings/subscription`,
        icon: SvgIcon.PRICING,
        permission: "tenant.billing.view",
      },
      {
        title: t("workflows.title"),
        path: `/admin/workflow-engine?tenantId=${tenantSlug}`,
        icon: SvgIcon.WORKFLOWS,
        permission: "tenant.automations.view",
      },
      {
        title: t("models.entity.plural"),
        path: `/admin/entities?tenantId=${tenantSlug}`,
        icon: SvgIcon.ENTITIES,
        permission: "tenant.entities.view",
      },
    ],
      },
      {
        title: t("segments.support"),
        path: "",
        items: [
          {
            title: t("support.title", { defaultValue: "Support" }),
            path: `/app/${tenantSlug}/admin/support`,
            icon: SvgIcon.HELP_DESK,
            permission: "tenant.support.view",
          },
          {
            title: t("admin.switchToApp"),
            path: `/app/${tenantSlug}/dashboard`,
            icon: SvgIcon.APP,
            exact: true,
          },
        ],
      },
];
