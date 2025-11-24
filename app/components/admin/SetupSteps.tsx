import { useTranslation } from "react-i18next";
import { SetupItem } from "~/application/dtos/setup/SetupItem";
import ButtonSecondary from "../ui/buttons/ButtonSecondary";
import clsx from "clsx";

interface Props {
  items: SetupItem[];
}

function CompletedIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="border-border h-6 w-6 rounded-full border text-gray-200" viewBox="0 0 20 20" fill="currentColor">
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function IncompletedIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 rounded-full border border-teal-500 text-teal-500" viewBox="0 0 20 20" fill="currentColor">
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function SetupStep({ item, index, total }: { item: SetupItem; index: number; total: number }) {
  const { t } = useTranslation();

  return (
    <li key={index} className="border-border bg-background space-y-3 rounded-lg border p-4">
      <div className="flex items-center space-x-2">
        <div className="shrink-0">{!item.completed ? <CompletedIcon /> : <IncompletedIcon />}</div>
        <div className="flex w-full justify-between">
          <div className="font-medium">{item.title}</div>
          <div className=" text-muted-foreground text-sm">
            {index + 1}/{total}
          </div>
        </div>
      </div>
      <p className=" text-sm">{item.description}</p>
      <div>
        <ButtonSecondary to={item.path} className="mt-3">
          {!item.completed ? t("app.sidebar.setup") : `${t("shared.goTo")} ${item.title.toLowerCase()}`} &rarr;
        </ButtonSecondary>
      </div>
    </li>
  );
}

const GRID_COLUMNS: Record<number, string> = {
  1: "lg:grid-cols-3",
  2: "lg:grid-cols-2",
  3: "lg:grid-cols-3",
  4: "lg:grid-cols-2",
  5: "lg:grid-cols-3",
  6: "lg:grid-cols-3",
  7: "lg:grid-cols-4",
  8: "lg:grid-cols-4",
  9: "lg:grid-cols-3",
  10: "lg:grid-cols-5",
  11: "lg:grid-cols-4",
  12: "lg:grid-cols-4",
};

export default function SetupSteps({ items }: Props) {
  const { t } = useTranslation();
  const gridClass = GRID_COLUMNS[items.length] || "lg:grid-cols-3";

  return (
    <div>
      <h3 className="text-foreground font-medium leading-4">{t("onboarding.gettingStarted.title")}</h3>
      <ul className={clsx("mt-3 grid grid-cols-1 gap-4", gridClass)}>
        {items.map((item, index) => (
          <SetupStep key={index} item={item} index={index} total={items.length} />
        ))}
      </ul>
    </div>
  );
}
