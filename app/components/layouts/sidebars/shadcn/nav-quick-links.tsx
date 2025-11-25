"use client";

import { Folder, MoreHorizontal, Share, Trash2 } from "lucide-react";
import { SidebarGroupDto } from "~/application/sidebar/SidebarGroupDto";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "~/components/ui/dropdown-menu";
import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuAction, SidebarMenuButton, SidebarMenuItem, useSidebar } from "~/components/ui/sidebar";
import SidebarIcon from "../../icons/SidebarIcon";
import { useTranslation } from "react-i18next";

export function NavQuickLinks({
  item,
}: Readonly<{
  item: SidebarGroupDto;
}>) {
  const { t } = useTranslation();
  const { isMobile } = useSidebar();

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
      <SidebarMenu>
        {item.items.map((mapItem) => (
          <SidebarMenuItem key={mapItem.path}>
            <SidebarMenuButton asChild>
              <a href={mapItem.path}>
                {/* <mapItem.icon /> */}
                {(mapItem.icon !== undefined || mapItem.entityIcon !== undefined) && <SidebarIcon className="h-5 w-5 " item={mapItem} />}
                <span>{mapItem.title}</span>
              </a>
            </SidebarMenuButton>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuAction showOnHover>
                  <MoreHorizontal />
                  <span className="sr-only">{t("shared.more")}</span>
                </SidebarMenuAction>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48" side={isMobile ? "bottom" : "right"} align={isMobile ? "end" : "start"}>
                <DropdownMenuItem>
                  <Folder className="text-muted-foreground" />
                  <span>View Project</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Share className="text-muted-foreground" />
                  <span>Share Project</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Trash2 className="text-muted-foreground" />
                  <span>Delete Project</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        ))}
        <SidebarMenuItem>
          <SidebarMenuButton>
            <MoreHorizontal />
            <span>More</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  );
}
