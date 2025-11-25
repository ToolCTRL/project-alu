import { useTranslation } from "react-i18next";

export default function RowCreatedByCell({
  user,
  apiKey,
}: Readonly<{
  user?: { firstName: string; lastName: string; email: string } | null;
  apiKey?: { alias: string } | null;
}>) {
  const { t } = useTranslation();

  if (user) {
    return (
      <div>
        <div className="flex flex-col text-xs">
          <div className="font-medium">
            {user?.firstName} {user?.lastName}
          </div>
          <div>{user?.email}</div>
        </div>
      </div>
    );
  }

  if (apiKey) {
    return (
      <div>
        <div>
          {t("models.apiKey.object")}: {apiKey.alias}
        </div>
      </div>
    );
  }

  return <div></div>;
}
