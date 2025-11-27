import { LoaderFunctionArgs, MetaFunction, Outlet } from "react-router";
import { getTranslations } from "~/locale/i18next.server";

type LoaderData = {
  title: string;
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { t } = await getTranslations(request);
  const data: LoaderData = {
    title: `${t("models.entity.plural")} | ${process.env.APP_NAME}`,
  };
  return data;
};

export const meta: MetaFunction<typeof loader> = ({ data }) => [{ title: data?.title }];

export default function EntitiesLayout() {
  return (
    <div className="relative z-0 flex-1 overflow-hidden pb-10 text-white">
      <div className="relative mx-auto max-w-7xl px-4 py-6">
        <Outlet />
      </div>
    </div>
  );
}
