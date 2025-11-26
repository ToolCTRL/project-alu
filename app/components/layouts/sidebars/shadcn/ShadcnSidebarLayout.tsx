import { SidebarInset, SidebarProvider, SidebarTrigger } from "../../../ui/sidebar";
import { ShadcnAppSidebar } from "./app-sidebar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "~/components/ui/breadcrumb";
import { SideBarItem } from "~/application/sidebar/SidebarItem";
import { useLocation, useParams } from "react-router";
import { useTitleData } from "~/utils/data/useTitleData";
import { useRef, useState } from "react";
import { NavActions } from "./nav-actions";
import { useKBar } from "kbar";
import { useFeatureFlag } from "~/hooks/useFeatureFlag";
import { UI_REFRESH_FLAG_GROUPS } from "~/application/featureFlags/constants";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import { RouteBackground } from "~/components/ui/backgrounds/RouteBackground";

export default function ShadcnSidebarLayout({
  children,
  layout,
  menuItems,
}: {
  children: React.ReactNode;
  layout: "app" | "admin" | "docs";
  menuItems?: SideBarItem[];
}) {
  const params = useParams();
  const title = useTitleData() ?? "";

  const location = useLocation();

  const { query } = useKBar();
  // fallback to enabled so the new UI/backgrounds are visible by default
  const refreshNavigation = useFeatureFlag(UI_REFRESH_FLAG_GROUPS.navigation) ?? true;
  const navModern = true;

  const [, setOnboardingModalOpen] = useState(false);

  function onOpenCommandPalette() {
    query.toggle();
  }
  return (
    <SidebarProvider className={clsx(navModern && "nav-modern")}>
      <ShadcnAppSidebar layout={layout} items={menuItems} />
      <SidebarInset className={clsx("relative overflow-hidden min-h-screen px-3 pb-6 sm:px-5 lg:px-7", refreshNavigation && "text-white")}>
        <RouteBackground />
        <header className={clsx(!refreshNavigation && "hidden")} aria-hidden={!refreshNavigation}>
          <div className="flex items-center gap-2 truncate px-4">
            <SidebarTrigger className="-ml-1" />
            <Breadcrumb className="truncate">
              <BreadcrumbList className="truncate">
                <BreadcrumbItem className="block truncate">
                  <BreadcrumbPage className="truncate">{title}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="ml-auto px-3">
            <NavActions layout={layout} onOpenCommandPalette={onOpenCommandPalette} setOnboardingModalOpen={setOnboardingModalOpen} />
          </div>
        </header>
        <main className="flex-1 focus:outline-hidden">
          <div key={params.tenant} className="relative z-10 pb-20 sm:pb-0">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
                className="mx-auto w-full max-w-7xl px-0 sm:px-0 lg:px-0"
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
