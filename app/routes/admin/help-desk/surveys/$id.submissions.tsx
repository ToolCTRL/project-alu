import type React from "react";
import { LoaderFunctionArgs, redirect, useActionData, useLoaderData, useParams, useSubmit } from "react-router";
import { useEffect, useMemo } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { RowHeaderDisplayDto } from "~/application/dtos/data/RowHeaderDisplayDto";
import ButtonSecondary from "~/components/ui/buttons/ButtonSecondary";
import ShowPayloadModalButton from "~/components/ui/json/ShowPayloadModalButton";
import EditPageLayout from "~/components/ui/layouts/EditPageLayout";
import TableSimple from "~/components/ui/tables/TableSimple";
import { getTranslations } from "~/locale/i18next.server";
import { SurveySubmissionWithDetails, deleteSurveySubmission, getSurveySubmissions } from "~/modules/surveys/db/surveySubmissions.db.server";
import { getSurveyById } from "~/modules/surveys/db/surveys.db.server";
import { SurveyDto } from "~/modules/surveys/dtos/SurveyDtos";
import SurveyUtils from "~/modules/surveys/utils/SurveyUtils";
import { verifyUserHasPermission } from "~/utils/helpers/.server/PermissionsService";
import { requireAuth } from "~/utils/loaders.middleware";
import { getTenantIdOrNull } from "~/utils/services/.server/urlService";
import DateUtils from "~/utils/shared/DateUtils";

type LoaderData = {
  item: SurveyDto;
  submissions: SurveySubmissionWithDetails[];
};

const renderSubmissionResult = (submission: SurveySubmissionWithDetails, itemTitle: string) => {
  const result = submission.results.find((r) => r.surveItemTitle === itemTitle);
  if (!result) {
    return <div>-</div>;
  }
  if (result.other) {
    return (
      <div>
        {result.value?.toString()}: {result.other}
      </div>
    );
  }
  if (typeof result.value === "string") {
    return <div>{result.value}</div>;
  }
  if (Array.isArray(result.value)) {
    return <div>{result.value.join(", ")}</div>;
  }
  return <div>{JSON.stringify(result.value)}</div>;
};

const SubmissionResultsCell = ({ item, idx }: { item: SurveySubmissionWithDetails; idx: number }) => (
  <div>
    <ShowPayloadModalButton description={<div className=" text-muted-foreground text-xs font-medium">#{idx + 1}</div>} payload={JSON.stringify(item.results, null, 2)} />
  </div>
);

const SubmissionDateCell = ({ item }: { item: SurveySubmissionWithDetails }) => (
  <time title={DateUtils.dateYMDHMS(item.createdAt)} className="text-muted-foreground text-xs">
    {DateUtils.dateAgo(item.createdAt)}
  </time>
);

function buildSubmissionHeaders(
  surveyItems: SurveyDto["items"],
  renderResult: (submission: SurveySubmissionWithDetails, surveyItemTitle: string) => React.ReactNode
): RowHeaderDisplayDto<SurveySubmissionWithDetails>[] {
  const headers: RowHeaderDisplayDto<SurveySubmissionWithDetails>[] = [
    {
      name: "results",
      title: "",
      value: (item, idx) => <SubmissionResultsCell item={item} idx={idx ?? 0} />,
    },
    {
      name: "date",
      title: "Date",
      value: (i) => <SubmissionDateCell item={i} />,
    },
  ];

  surveyItems.forEach((surveyItem) => {
    headers.push({
      name: surveyItem.title,
      title: surveyItem.title,
      value: (submission) => renderResult(submission, surveyItem.title),
    });
  });

  headers.push(
    {
      name: "ipAddress",
      title: "IP Address",
      value: (item) => item.ipAddress,
    },
    {
      name: "cookie",
      title: "Cookie",
      className: "w-full",
      value: (i) => <div className="text-foreground w-20 truncate text-xs">{i.userAnalyticsId}</div>,
    }
  );

  return headers;
}

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  await requireAuth({ request, params });
  await verifyUserHasPermission(request, "admin.surveys");
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

export const action = async ({ request, params }: LoaderFunctionArgs) => {
  await requireAuth({ request, params });
  await verifyUserHasPermission(request, "admin.surveys");
  const { t } = await getTranslations(request);
  const form = await request.formData();
  const action = form.get("action")?.toString();
  if (action === "delete") {
    const id = form.get("id")?.toString() ?? "";
    try {
      await deleteSurveySubmission(id);
      return Response.json({ success: t("shared.deleted") });
    } catch (e: any) {
      return Response.json({ error: e }, { status: 400 });
    }
  }
};

export default function SurveySubmissionsRoute() {
  const { t } = useTranslation();
  const data = useLoaderData<LoaderData>();
  const actionData = useActionData<{ success?: string; error?: string }>();
  const submit = useSubmit();
  const params = useParams();

  useEffect(() => {
    if (actionData?.success) {
      toast.success(actionData?.success);
    } else if (actionData?.error) {
      toast.error(actionData?.error);
    }
  }, [actionData]);

  const headers = useMemo(
    () => buildSubmissionHeaders(data.item.items, renderSubmissionResult),
    [data.item.items]
  );

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
        <TableSimple
          items={data.submissions}
          actions={[
            {
              title: t("shared.delete"),
              onClick: (_, item) => {
                const form = new FormData();
                form.append("action", "delete");
                form.append("id", item.id);
                submit(form, {
                  method: "post",
                });
              },
              destructive: true,
              confirmation: (i) => ({
                title: t("shared.delete"),
                description: t("shared.warningCannotUndo"),
              }),
            },
          ]}
          headers={headers}
        />
      </div>
    </EditPageLayout>
  );
}
