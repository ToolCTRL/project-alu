import { ReactNode, Fragment } from "react";
import { Dialog, DialogBackdrop, DialogPanel, Transition, TransitionChild } from "@headlessui/react";
import clsx from "clsx";

interface Props {
  className?: string;
  children: ReactNode;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "6xl" | "7xl" | "full";
  padding?: "none" | "sm";
  position?: 0 | 1 | 2 | 3 | 4 | 5;
  title?: string;
}

function getPositionClass(position: number): string {
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

function getPaddingClass(padding: string): string {
  switch (padding) {
    case "none": return "px-0 pb-0 pt-0 sm:my-0 sm:p-0";
    case "sm": return "px-4 pb-4 pt-5 sm:my-8 sm:p-6";
    default: return "px-4 pb-4 pt-5 sm:my-8 sm:p-6";
  }
}

function getSizeClass(size: string): string {
  switch (size) {
    case "sm": return "sm:max-w-sm";
    case "md": return "sm:max-w-md";
    case "lg": return "sm:max-w-lg";
    case "xl": return "sm:max-w-xl";
    case "2xl": return "sm:max-w-2xl";
    case "3xl": return "sm:max-w-3xl";
    case "4xl": return "sm:max-w-4xl";
    case "5xl": return "sm:max-w-5xl";
    case "6xl": return "sm:max-w-6xl";
    case "7xl": return "sm:max-w-7xl";
    case "full": return "sm:max-w-full";
    default: return "sm:max-w-3xl";
  }
}
export default function Modal({ className, children, open, setOpen, size = "3xl", padding = "sm", position = 5, title }: Props) {
  const positionClass = getPositionClass(position);
  function onClose() {
    setOpen(false);
  }
  return (
    <Dialog
      open={open}
      onClose={onClose}
      as="div"
      className={clsx("text-foreground fixed inset-0 overflow-y-auto", positionClass)}
    >
      <div className="flex min-h-screen items-end justify-center px-4 pb-20 pt-4 text-center sm:block sm:p-0">
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <DialogBackdrop className="fixed inset-0 bg-gray-500/75 transition-opacity" />
        </TransitionChild>

        {/* This element is to trick the browser into centering the modal contents. */}
        <span className="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">
          &#8203;
        </span>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          enterTo="opacity-100 translate-y-0 sm:scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 translate-y-0 sm:scale-100"
          leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
        >
          <DialogPanel
            className={clsx(
              className,
              "bg-background relative inline-block w-full transform overflow-visible rounded-lg text-left align-bottom shadow-xl transition-all sm:align-middle",
              getPaddingClass(padding),
              getSizeClass(size)
            )}
          >
            {title && (
              <div className="mb-4 border-b pb-4">
                <h3 className="text-lg font-medium">{title}</h3>
              </div>
            )}
            {children}
          </DialogPanel>
        </TransitionChild>
      </div>
    </Dialog>
  );
}
