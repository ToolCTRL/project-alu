import { Link } from "react-router";
import { Fragment } from "react";
import { useTranslation } from "react-i18next";
import NumberUtils from "~/utils/shared/NumberUtils";

export default function CreditsRemaining({ remaining, redirectTo }: Readonly<{ remaining?: number | "unlimited"; redirectTo: string }>) {
  const { t } = useTranslation();

  const getRemainingContent = () => {
    if (remaining === "unlimited") {
      return <span>{t("models.credit.unlimited")}</span>;
    }
    if (remaining !== undefined && remaining <= 0) {
      return <span>{t("models.credit.empty")}</span>;
    }
    return <span>{t("models.credit.remaining", { 0: NumberUtils.intFormat(remaining as number) })}</span>;
  };

  return (
    <Fragment>
      {!!remaining && (
        <Link
          to={redirectTo}
          className="cursor-pointer select-none rounded-full border border-green-200 bg-green-50 px-2 py-1 text-xs text-green-600 hover:bg-green-100"
        >
          {getRemainingContent()}
        </Link>
      )}
    </Fragment>
  );
}
