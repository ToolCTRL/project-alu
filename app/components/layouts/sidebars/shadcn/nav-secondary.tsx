import * as React from "react";

import { SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "~/components/ui/sidebar";
import { SidebarGroupDto } from "~/application/sidebar/SidebarGroupDto";
import SidebarIcon from "../../icons/SidebarIcon";
import { Link } from "react-router";
import { useAppOrAdminData } from "~/utils/data/useAppOrAdminData";
import { Button } from "~/components/ui/button";

export function NavSecondary({
  item,
  ...props
}: Readonly<{
  item: SidebarGroupDto;
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>>) {
  const appOrAdminData = useAppOrAdminData();
  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {appOrAdminData?.onboardingSession && (
            <Button variant="outline" size="sm">
              <div>{appOrAdminData?.onboardingSession.onboarding.title}</div>
            </Button>
          )}
          {item.items.map((mapItem) => (
            <SidebarMenuItem key={mapItem.title}>
              <SidebarMenuButton asChild>
                <Link to={mapItem.path}>
                  {/* <mapItem.icon /> */}
                  {(mapItem.icon !== undefined || mapItem.entityIcon !== undefined) && <SidebarIcon className="h-5 w-5 " item={mapItem} />}
                  <span>{mapItem.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
