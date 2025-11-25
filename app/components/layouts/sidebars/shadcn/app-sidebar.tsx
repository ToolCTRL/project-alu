"use client";

import * as React from "react";
import LogoDark from "~/assets/img/logo-dark.png";
import LogoLight from "~/assets/img/logo-light.png";
import { NavMain } from "./nav-main";
import { NavQuickLinks } from "./nav-quick-links";
import { NavSecondary } from "./nav-secondary";
import { NavUser } from "./nav-user";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "~/components/ui/sidebar";
import { useAppOrAdminData } from "~/utils/data/useAppOrAdminData";
import { AppSidebar } from "~/application/sidebar/AppSidebar";
import { useTranslation } from "react-i18next";
import { useRootData } from "~/utils/data/useRootData";
import { SideBarItem } from "~/application/sidebar/SidebarItem";
import { AdminSidebar } from "~/application/sidebar/AdminSidebar";
import { Link, useLocation, useParams } from "react-router";
import { DocsSidebar } from "~/application/sidebar/DocsSidebar";
import UrlUtils from "~/utils/app/UrlUtils";
import { useAppData } from "~/utils/data/useAppData";
import { SidebarGroupDto } from "~/application/sidebar/SidebarGroupDto";
import { TeamSwitcher } from "./team-switcher";
import { DARK_SIDEBAR_IN_LIGHT_MODE } from "~/application/Constants";
import { cn } from "~/lib/utils";

export function ShadcnAppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  layout: "app" | "admin" | "docs";
  items?: SideBarItem[];
}) {
  const { t } = useTranslation();
  const location = useLocation();
  const rootData = useRootData();
  const appOrAdminData = useAppOrAdminData();
  const appData = useAppData();
  const params = useParams();
  const appConfiguration = rootData.appConfiguration;

  const getMenuItems = () => {
    let menu: SideBarItem[] = [];
    if (props.items) {
      menu = props.items;
    } else if (props.layout === "admin") {
      menu = AdminSidebar({ t, appConfiguration: rootData.appConfiguration });
    } else if (props.layout === "app") {
      menu = AppSidebar({
        t,
        tenantId: params.tenant ?? "",
        entities: appOrAdminData?.entities ?? [],
        entityGroups: appOrAdminData?.entityGroups ?? [],
        appConfiguration: rootData.appConfiguration,
      });
    } else if (props.layout === "docs") {
      menu = DocsSidebar();
    }

    function clearItemsIfNotCollapsible(items: SideBarItem[]) {
      items.forEach((item) => {
        if (item.isCollapsible !== undefined && !item.isCollapsible) {
          item.items = [];
        }
        if (item.items) {
          clearItemsIfNotCollapsible(item.items);
        }
      });
    }
    clearItemsIfNotCollapsible(menu);

    menu.forEach((item) => {
      if (item.isCollapsible !== undefined && !item.isCollapsible) {
        item.items = [];
      }
      item.items?.forEach((subitem) => {
        if (subitem.isCollapsible !== undefined && !subitem.isCollapsible) {
          subitem.items = [];
        }
      });
    });
    menu.forEach((group) => {
      group.items?.forEach((element) => {
        if (element.open || isCurrent(element) || currentIsChild(element)) {
          // do nothing
        }
      });
    });

    return menu || [];
  };

  function getPath(item: SideBarItem) {
    return UrlUtils.replaceVariables(params, item.path) ?? "";
  }

  function isCurrent(menuItem: SideBarItem) {
    if (menuItem.path) {
      if (menuItem.exact) {
        return location.pathname === getPath(menuItem);
      }
      return location.pathname?.includes(getPath(menuItem));
    }
  }

  function currentIsChild(menuItem: SideBarItem) {
    let hasOpenChild = false;
    menuItem.items?.forEach((item) => {
      if (isCurrent(item)) {
        hasOpenChild = true;
      }
    });
    return hasOpenChild;
  }
  function allowCurrentUserType(item: SideBarItem) {
    if (!item.adminOnly) {
      return true;
    }
    return appData?.user?.admin !== null;
  }
  function allowCurrentTenantUserType(item: SideBarItem) {
    return !item.tenantUserTypes || item.tenantUserTypes.includes(appData?.currentRole);
  }
  function checkUserRolePermissions(item: SideBarItem) {
    return !item.permission || appOrAdminData?.permissions?.includes(item.permission) || appOrAdminData?.permissions?.includes(item.permission);
  }
  function checkFeatureFlags(item: SideBarItem) {
    return !item.featureFlag || rootData.featureFlags?.includes(item.featureFlag);
  }
  function filterItem(f: SideBarItem) {
    return f.hidden !== true && allowCurrentUserType(f) && allowCurrentTenantUserType(f) && checkUserRolePermissions(f) && checkFeatureFlags(f);
  }

  function processMenuItemWithSubItems(f: SideBarItem) {
    return {
      ...f,
      items: f.items?.filter((item) => filterItem(item)),
    };
  }

  const getMenu = (): SidebarGroupDto[] => {
    const _menu: SidebarGroupDto[] = [];
    getMenuItems()
      .filter((f) => filterItem(f))
      .forEach((f) => {
        let type: "main" | "secondary" | "quick-link" = "main";
        if (f.isSecondary) {
          type = "secondary";
        } else if (f.isQuickLink) {
          type = "quick-link";
        }
        _menu.push({
          title: f.title.toString(),
          items: f.items?.filter((item) => filterItem(item)).map((item) => processMenuItemWithSubItems(item)) ?? [],
          type,
        });
      });
    return _menu.filter((f) => f.items.length > 0);
  };

  const navMain = getMenu().filter((f) => f.type === "main");
  const navSecondary = getMenu().find((f) => f.type === "secondary") || { items: [] };
  const navQuickLinks = getMenu().find((f) => f.type === "quick-link");

  return (
    <Sidebar
      variant={DARK_SIDEBAR_IN_LIGHT_MODE ? "sidebar" : "inset"}
      collapsible="offcanvas"
      {...props}
      className={cn(
        DARK_SIDEBAR_IN_LIGHT_MODE && "dark",
        "mt-6 ml-6 rounded-3xl border border-white/5 bg-transparent shadow-[0_24px_60px_rgba(5,9,20,0.6)] backdrop-blur-lg supports-[backdrop-filter]:backdrop-blur-md"
      )} // force dark mode
    >
      <SidebarHeader className="px-4 py-4 gap-0">
        <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                size="lg"
                asChild
                className="h-auto min-h-[88px] px-0 py-0 overflow-visible"
                // className="dark:hover:bg-transparent dark:active:bg-transparent"
              >
                <Link to={props.layout === "admin" ? "/admin/dashboard" : "/"} className="flex w-full justify-center">
                  <div className="flex h-[96px] w-full shrink-0 items-center justify-center px-0 py-0 overflow-visible">
                    <img
                      className={"mx-auto hidden h-auto max-h-[72px] max-w-[13rem] w-auto p-1 dark:flex object-contain"}
                      src={appConfiguration.branding.logoDarkMode || appConfiguration.branding.logo || LogoDark}
                    alt="Logo"
                  />
                  <img
                    className={"mx-auto h-auto max-h-[72px] max-w-[13rem] w-auto p-1 dark:hidden object-contain"}
                    src={appConfiguration.branding.logoDarkMode || appConfiguration.branding.logo || LogoLight}
                    alt="Logo"
                  />
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        {props.layout === "app" && appData?.currentTenant && <TeamSwitcher key={params.tenant} size="md" tenants={appData?.myTenants ?? []} />}
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
        {navQuickLinks && <NavQuickLinks item={navQuickLinks} />}
        <NavSecondary item={navSecondary} />
      </SidebarContent>
      {appOrAdminData.user && (
        <SidebarFooter>
          <NavUser layout={props.layout} user={appOrAdminData.user} />
        </SidebarFooter>
      )}
    </Sidebar>
  );
}
