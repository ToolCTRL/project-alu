import { Link, useLocation } from "react-router";
import clsx from "clsx";
import { useRef } from "react";
import UrlUtils from "~/utils/app/UrlUtils";
import Tabs from "../tabs/Tabs";
import EntityIcon from "~/components/layouts/icons/EntityIcon";
import { cn } from "~/lib/utils";

export type IconDto = {
  name: string;
  href: string;
  prefetch?: "intent" | "render" | "none";
  icon?: React.ReactNode;
  iconSelected?: React.ReactNode;
  bottom?: boolean;
  exact?: boolean;
  textIcon?: string;
  textIconSelected?: string;
  hidden?: boolean;
};
export default function SidebarIconsLayout({
  children,
  items,
  label,
  scrollRestoration,
}: Readonly<{
  children: React.ReactNode;
  items: IconDto[];
  label?: {
    align: "bottom" | "right";
  };
  scrollRestoration?: boolean;
}>) {
  const location = useLocation();
  const mainElement = useRef<HTMLDivElement>(null);
  // useElementScrollRestoration({ apply: scrollRestoration ?? false }, mainElement);

  function findExactRoute(element: IconDto) {
    if (element.exact) {
      return UrlUtils.stripTrailingSlash(location.pathname) === UrlUtils.stripTrailingSlash(element.href);
    } else {
      return (location.pathname + location.search).includes(element.href);
    }
  }
  const currentTab = items.find((element) => findExactRoute(element));

  const topItems = items.filter((f) => !f.bottom && !f.hidden);
  const bottomItems = items.filter((f) => f.bottom && !f.hidden);
  const hasBottomItems = bottomItems.some((f) => f);

  return (
    <div className="sm:flex sm:flex-row">
      <div
        className={cn(
          "border-border hidden flex-none flex-col items-center justify-between overflow-y-auto border-r shadow-2xs sm:flex",
          label?.align === "bottom" && "lg:text-center",
          "min-h-[calc(100vh-70px)]"
        )}
      >
        <div className="flex w-full flex-col items-center">
          {topItems.map((item) => (
            <IconLink key={item.name} {...item} current={currentTab?.name === item.name} label={label} />
          ))}
        </div>
        {hasBottomItems && (
          <div className="flex w-full flex-col space-y-2 pb-5">
            {bottomItems.map((item) => (
              <IconLink key={item.name} {...item} current={currentTab?.name === item.name} label={label} />
            ))}
          </div>
        )}
      </div>

      <div className="border-border bg-background w-full border-b py-2 shadow-2xs sm:hidden">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-2 px-4 sm:px-6 lg:px-8 xl:max-w-7xl 2xl:max-w-(--breakpoint-2xl)">
          <Tabs
            tabs={items
              .filter((f) => !f.hidden)
              .map((i) => {
                return { name: i.name, routePath: i.href };
              })}
            className="grow"
          />
        </div>
      </div>

      <div ref={mainElement} className="w-full overflow-x-hidden">
        {children}
      </div>
    </div>
  );
}

function IconLink({
  name,
  href,
  prefetch,
  icon,
  current,
  iconSelected,
  label,
  textIcon,
  textIconSelected,
}: Readonly<{
  name: string;
  href: string;
  prefetch?: "intent" | "render" | "none";
  icon?: React.ReactNode;
  iconSelected?: React.ReactNode;
  current: boolean;
  label?: {
    align: "bottom" | "right";
  };
  textIcon?: string;
  textIconSelected?: string;
}>) {
  const displayIcon = textIcon !== undefined && textIconSelected !== undefined ? (
    <div>
      <EntityIcon className="text-muted-foreground h-5 w-5" icon={current ? textIconSelected : textIcon} />
    </div>
  ) : (
    <div>{current ? iconSelected : icon}</div>
  );

  return (
    <div className={clsx("w-full px-1 py-1")}>
      <Link
        prefetch={prefetch}
        to={href}
        className={clsx(
          "hover:border-border hover:bg-secondary hover:text-foreground flex w-11 items-center justify-center rounded-md border px-2 py-2 text-xs",
          current ? "border-border bg-secondary" : "text-muted-foreground border-transparent",
          label ? "lg:w-auto lg:justify-start" : "w-11",
          label?.align === "bottom" && "flex-col space-y-1",
          label?.align === "right" && "flex-row gap-2"
        )}
      >
        {displayIcon}
        {label && <div className={clsx([icon, iconSelected, textIcon, textIconSelected].some((f) => f !== undefined) && "hidden lg:block")}>{name}</div>}
      </Link>
    </div>
  );
}
