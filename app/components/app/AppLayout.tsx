import { ReactNode } from "react";
import SidebarLayout from "../layouts/SidebarLayout";
import CommandPalette from "../ui/commandPalettes/CommandPalette";
import NewSidebarLayout from "../layouts/NewSidebarLayout";
import { useSearchParams } from "react-router";
import ShadcnSidebarLayout from "../layouts/sidebars/shadcn/ShadcnSidebarLayout";
import { SideBarItem } from "~/application/sidebar/SidebarItem";
import { RouteBackground } from "../ui/backgrounds/RouteBackground";

interface Props {
  layout: "app" | "admin" | "docs";
  children: ReactNode;
  type?: "v1" | "v2" | "v3";
  menuItems?: SideBarItem[];
}

export default function AppLayout({ layout, children, type = "v3", menuItems }: Props) {
  const [searchParams] = useSearchParams();
  const sidebarParam = searchParams.get("sidebar");

  if (sidebarParam === "v1") {
    type = "v1";
  } else if (sidebarParam === "v2") {
    type = "v2";
  } else if (sidebarParam === "v3") {
    type = "v3";
  }
  return (
    <div className="relative">
      <RouteBackground />
      <CommandPalette key={layout} layout={layout}>
        {type === "v1" && <SidebarLayout layout={layout}>{children}</SidebarLayout>}
        {type === "v2" && <NewSidebarLayout layout={layout}>{children}</NewSidebarLayout>}
        {type === "v3" && <ShadcnSidebarLayout layout={layout} menuItems={menuItems}>{children}</ShadcnSidebarLayout>}
      </CommandPalette>
    </div>
  );
}
