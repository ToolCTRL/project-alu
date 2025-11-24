import { SideBarItem } from "./SidebarItem";
import { SvgIcon } from "../enums/shared/SvgIcon";
import { EntitySimple } from "~/utils/db/entities/entities.db.server";
import { TFunction } from "i18next";
import { EntityGroupWithDetails } from "~/utils/db/entities/entityGroups.db.server";
import { AppConfiguration } from "~/utils/db/appConfiguration.db.server";

type Props = {
  t: TFunction;
  tenantId: string;
  entities: EntitySimple[];
  entityGroups: EntityGroupWithDetails[];
  appConfiguration: AppConfiguration | null;
};

export const AppSidebar = ({ t, tenantId, entities, entityGroups, appConfiguration }: Props): SideBarItem[] => {
  const currentTenantUrl = `/app/${tenantId}`;

  const sectionItems: SideBarItem[] = [];
  const entitiesItems: SideBarItem[] = [];

  entityGroups.forEach((group) => {
    const item: SideBarItem = {
      title: t(group.title),
      // icon: group.icon,
      path: `${currentTenantUrl}/g/` + group.slug,
      entityIcon: group.icon,
      // isActive: true,
    };
    if (group.collapsible) {
      item.items = group.entities.map(({ entity }) => {
        return {
          title: t(entity.titlePlural),
          // icon: entity.icon,
          path: `${currentTenantUrl}/g/${group.slug}/${entity.slug}`,
          // entityIcon: entity.icon,
        };
      });
    }
    if (group.section) {
      const section = sectionItems.find((f) => f.title === group.section);
      if (section) {
        section.items = [...(section.items ?? []), item];
      } else {
        sectionItems.push({
          title: group.section,
          path: ``,
          items: [item],
        });
      }
    } else {
      entitiesItems.push(item);
    }
  });

  const hiddenCrmSlugs = ["opportunities", "companies", "contacts", "tickets"];
  entities
    .filter((f) => f.showInSidebar && !hiddenCrmSlugs.includes(f.slug))
    .forEach((entity) => {
      entitiesItems.push({
        title: t(entity.titlePlural),
        entityIcon: entity.icon,
        path: `${currentTenantUrl}/` + entity.slug,
      });
    });

  const crmEntitiesSidebarItems: SideBarItem[] = [];
  if (appConfiguration?.app.features.tenantEmailMarketing) {
    crmEntitiesSidebarItems.push({
      title: t("emailMarketing.title"),
      path: `${currentTenantUrl}/email-marketing`,
      icon: SvgIcon.EMAILS,
    });
  }

  const appItem: SideBarItem = {
    title: "",
    path: "",
    items: [
      {
        title: t("app.sidebar.dashboard"),
        path: `${currentTenantUrl}/dashboard`,
        icon: SvgIcon.DASHBOARD,
      },
      ...entitiesItems,
      ...crmEntitiesSidebarItems,
    ],
  };
  if (appConfiguration?.app.features.tenantBlogs) {
    appItem?.items?.push({
      title: t("blog.title"),
      path: `${currentTenantUrl}/blog`,
      icon: SvgIcon.BLOG,
    });
  }
  if (appConfiguration?.app.features.tenantWorkflows) {
    appItem?.items?.push({
      title: t("workflows.title"),
      path: `${currentTenantUrl}/workflow-engine`,
      icon: SvgIcon.WORKFLOWS,
    });
  }

  if (appConfiguration?.portals?.enabled && appConfiguration?.portals?.forTenants) {
    appItem?.items?.push({
      title: t("models.portal.plural"),
      path: `${currentTenantUrl}/portals`,
      icon: SvgIcon.PORTALS,
    });
  }

  return [
    appItem,
    ...sectionItems,
    {
      title: "",
      path: "",
      isSecondary: true,
      items: [
        {
          title: t("app.sidebar.settings"),
          icon: SvgIcon.SETTINGS,
          // tenantUserTypes: [TenantUserType.OWNER, TenantUserType.ADMIN],
          path: `${currentTenantUrl}/settings`,
          redirectTo: `${currentTenantUrl}/settings/profile`,
        },
        // {
        //   title: t("app.sidebar.logs"),
        //   icon: SvgIcon.LOGS,
        //   tenantUserTypes: [TenantUserType.OWNER, TenantUserType.ADMIN],
        //   path: `${currentTenantUrl}/logs`,
        // },
        {
          title: t("admin.switchToAdmin"),
          path: "/admin/dashboard",
          icon: SvgIcon.ADMIN,
          adminOnly: true,
        },
      ],
    },
    {
      title: "Pricing",
      path: "/pricing",
      isQuickLink: true,
    },
  ];
};
