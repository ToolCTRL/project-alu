import { LoaderFunctionArgs, redirect, useActionData, useLoaderData, useParams } from "react-router";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import ButtonSecondary from "~/components/ui/buttons/ButtonSecondary";
import ShowPayloadModalButton from "~/components/ui/json/ShowPayloadModalButton";
import EditPageLayout from "~/components/ui/layouts/EditPageLayout";
import TableSimple from "~/components/ui/tables/TableSimple";
import { SurveySubmissionWithDetails, getSurveySubmissions } from "~/modules/surveys/db/surveySubmissions.db.server";
import { getSurveyById } from "~/modules/surveys/db/surveys.db.server";
import { SurveyDto } from "~/modules/surveys/dtos/SurveyDtos";
import SurveyUtils from "~/modules/surveys/utils/SurveyUtils";
import { requireAuth } from "~/utils/loaders.middleware";
import { getTenantIdOrNull } from "~/utils/services/.server/urlService";

type LoaderData = {
  item: SurveyDto;
  submissions: SurveySubmissionWithDetails[];
};

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  await requireAuth({ request, params });
  const tenantId = await getTenantIdOrNull({ request, params });
  const item = await getSurveyById({ tenantId, id: params.id! });
  if (!item) {
    return redirect("/admin/help-desk/surveys");
  }
  const submissions = await getSurveySubmissions(item.id);
  const data: LoaderData = {
    item: SurveyUtils.surveyToDto(item),
    submissions,
  };
  return data;
};

const SurveyItemTitle = ({ item, submissions, surveyItemTitle }: { item: any; submissions: any[]; surveyItemTitle: string }) => {
  if (item.isOther) {
    const results = submissions.flatMap((f) => f.results).filter((result) => result.surveItemTitle === surveyItemTitle);
    return (
      <ShowPayloadModalButton
        description={item.title}
        payload={JSON.stringify(
          results.map((f) => f.other),
          null,
          2
        )}
      />
    );
  }
  return <div>{item.title}</div>;
};

const SurveyItemVotes = ({ item, submissions, surveyItemTitle }: { item: any; submissions: any[]; surveyItemTitle: string }) => {
  const itemResults = submissions.flatMap((f) => f.results).filter((result) => result.surveItemTitle === surveyItemTitle);
  const optionResults = itemResults.filter((result) => {
    if (typeof result.value === "string") {
      return result.value === item.title;
    } else if (Array.isArray(result.value)) {
      return result.value.includes(item.title);
    } else {
      return false;
    }
  });
  return <div>{optionResults.length} votes</div>;
};

export default function SurveyOverviewRoute() {
  const { t } = useTranslation();
  const data = useLoaderData<LoaderData>();
  const actionData = useActionData<{ success?: string; error?: string }>();
  const params = useParams();

  useEffect(() => {
    if (actionData?.success) {
      toast.success(actionData?.success);
    } else if (actionData?.error) {
      toast.error(actionData?.error);
    }
  }, [actionData]);

  return (
    <EditPageLayout
      withHome={false}
      title={data.item.title}
      buttons={
        <ButtonSecondary to={`/admin/help-desk/surveys/${params.id}/edit`}>{t("shared.edit")}</ButtonSecondary>
      }
      tabs={[
        { name: "Overview", routePath: `/admin/help-desk/surveys/${params.id}` },
        { name: "Submissions", routePath: `/admin/help-desk/surveys/${params.id}/submissions` },
      ]}
    >
      <div className="space-y-2">
        {data.item.items.map((surveyItem) => {
          return (
            <div key={surveyItem.id || surveyItem.title} className="space-y-1">
              <p className="text-base font-semibold">{surveyItem.title}</p>
              <TableSimple
                items={surveyItem.options}
                headers={[
                  {
                    name: "title",
                    title: "Title",
                    className: "w-full",
                    value: (item) => <SurveyItemTitle item={item} submissions={data.submissions} surveyItemTitle={surveyItem.title} />,
                  },
                  {
                    name: "votes",
                    title: "Votes",
                    value: (item) => <SurveyItemVotes item={item} submissions={data.submissions} surveyItemTitle={surveyItem.title} />,
                  },
                ]}
              />
            </div>
          );
        })}
      </div>
    </EditPageLayout>
  );
}
