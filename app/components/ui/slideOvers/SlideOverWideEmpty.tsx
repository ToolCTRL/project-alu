import { ReactNode } from "react";
// import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import XIcon from "../icons/XIcon";
import clsx from "clsx";
import { cn } from "~/lib/utils";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "~/components/ui/sheet";

function getSizeClasses(size: string): string {
  switch (size) {
    case "sm": return "max-w-sm sm:max-w-sm";
    case "md": return "max-w-md sm:max-w-md";
    case "lg": return "max-w-lg sm:max-w-lg";
    case "xl": return "max-w-xl sm:max-w-xl";
    case "2xl": return "max-w-2xl sm:max-w-2xl";
    case "3xl": return "max-w-3xl sm:max-w-3xl";
    case "4xl": return "max-w-4xl sm:max-w-4xl";
    case "5xl": return "max-w-5xl sm:max-w-5xl";
    case "6xl": return "max-w-6xl sm:max-w-6xl";
    case "7xl": return "max-w-7xl sm:max-w-7xl";
    case "full": return "max-w-full sm:max-w-full";
    default: return "max-w-2xl sm:max-w-2xl";
  }
}

function getPositionClasses(position: number | undefined): string {
  switch (position) {
    case 0: return "z-0";
    case 1: return "z-10";
    case 2: return "z-20";
    case 3: return "z-30";
    case 4: return "z-40";
    case 5: return "z-50";
    default: return "z-50";
  }
}

export default function SlideOverWideEmpty({
  title,
  description,
  open,
  children,
  onClose,
  className,
  buttons,
  withTitle = true,
  withClose = true,
  overflowYScroll,
  position = 5,
  size = "2xl",
}: {
  title?: string | ReactNode;
  description?: string;
  open: boolean;
  children: ReactNode;
  onClose: () => void;
  className?: string;
  buttons?: ReactNode;
  withTitle?: boolean;
  withClose?: boolean;
  overflowYScroll?: boolean;
  position?: 0 | 1 | 2 | 3 | 4 | 5 | 99;
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "6xl" | "7xl" | "full";
}) {
  return (
    <Sheet
      open={open}
      onOpenChange={(e) => {
        if (!e) {
          onClose();
        }
      }}
    >
      {/* <DialogBackdrop transition className="fixed inset-0 bg-gray-500/75 transition-opacity duration-500 ease-in-out data-closed:opacity-0" /> */}

      <SheetContent
        className={cn(
          className,
          getSizeClasses(size),
          getPositionClasses(position)
        )}
      >
        <div className="bg-background flex h-full flex-col overflow-y-auto pt-6 shadow-xl">
          <div className="px-4 sm:px-6">
            <div className="flex items-start justify-between">
              {withTitle ? (
                <SheetHeader className="flex flex-col">
                  <SheetTitle>{title}</SheetTitle>
                  {description && <SheetDescription>{description}</SheetDescription>}
                </SheetHeader>
              ) : (
                <div>
                  <button
                    type="button"
                    className="text-muted-foreground hover:text-foreground focus:ring-ring rounded-md outline-hidden focus:ring-2 focus:ring-offset-2 focus:outline-hidden"
                    onClick={onClose}
                  >
                    <span className="sr-only">Close panel</span>
                    <svg
                      className="h-6 w-6"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 4.5l7.5 7.5-7.5 7.5m-6-15l7.5 7.5-7.5 7.5" />
                    </svg>
                  </button>
                </div>
              )}

              <div className="ml-3 flex h-7 items-center space-x-4">
                {buttons}
                {withClose && (
                  <SheetClose asChild>
                    <button
                      type="button"
                      className="text-muted-foreground hover:text-foreground focus:ring-ring rounded-md focus:ring-2 focus:ring-offset-2 focus:outline-hidden"
                      onClick={onClose}
                    >
                      <span className="sr-only">Close panel</span>
                      <XIcon className="size-4" aria-hidden="true" />
                    </button>
                  </SheetClose>
                )}
              </div>
            </div>
          </div>

          <div className={clsx("relative mt-6 flex-1 border-t px-4 pt-5 pb-6 sm:px-6", overflowYScroll && "overflow-y-scroll")}>{children}</div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
