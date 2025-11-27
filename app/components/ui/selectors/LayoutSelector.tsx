import { Menu } from "@headlessui/react";
import { ApplicationLayout } from "~/application/enums/shared/ApplicationLayout";
import clsx from "clsx";
import Dropdown from "../dropdowns/Dropdown";
import { useTranslation } from "react-i18next";

interface Props {
  className?: string;
  btnClassName?: string;
}

export default function LayoutSelector({ className, btnClassName }: Readonly<Props>) {
  const { t } = useTranslation();

  const layouts = [
    {
      name: t("shared.layouts.sidebar"),
      value: ApplicationLayout.SIDEBAR,
    },
    {
      name: t("shared.layouts.stacked"),
      value: ApplicationLayout.STACKED,
    },
  ];

  function select(_value: ApplicationLayout) {
    // Future implementation: store.dispatch(setLayout(value));
  }

  return (
    <Dropdown
      className={className}
      btnClassName={clsx(
        "cursor-pointer select-none leading-6 font-medium focus:outline-hidden transition ease-in-out duration-150 px-3 py-1 rounded-sm text-muted-foreground hover:text-foreground/80 dark:hover:text-gray-300 focus:text-foreground dark:focus:text-white",
        btnClassName
      )}
      button={<span>{t("settings.preferences.layouts")}</span>}
      options={
        <div>
          {layouts.map((layout) => {
            return (
              <Menu.Item key={layout.value}>
                {({ active }) => (
                  <button
                    type="button"
                    onClick={() => select(layout.value)}
                    className={clsx("w-full text-left", active ? "text-foreground bg-secondary/90" : "text-foreground/80", "block px-4 py-2 text-sm")}
                    role="menuitem"
                  >
                    <div className="pl-1">{layout.name}</div>
                  </button>
                )}
              </Menu.Item>
            );
          })}
        </div>
      }
    />
  );
}
