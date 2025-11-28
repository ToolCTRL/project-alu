import { ActionFunction, LoaderFunctionArgs } from "react-router";
import invariant from "tiny-invariant";
import { DefaultLogActions } from "~/application/dtos/shared/DefaultLogActions";
import { getTranslations } from "~/locale/i18next.server";
import { createMetrics } from "~/modules/metrics/services/.server/MetricTracker";
import { loadEntities } from "~/modules/rows/repositories/.server/EntitiesSingletonService";
import EntitiesSingleton from "~/modules/rows/repositories/EntitiesSingleton";
import { RowsApi } from "~/utils/api/.server/RowsApi";
import { setApiKeyLogStatus } from "~/utils/db/apiKeys.db.server";
import { createRowLog } from "~/utils/db/logs.db.server";
import ApiHelper from "~/utils/helpers/ApiHelper";
import { ApiAccessValidation, validateApiKey } from "~/utils/services/apiService";
import { reportUsage } from "~/utils/services/.server/subscriptionService";

// GET
export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const { time, getServerTimingHeader } = await createMetrics({ request, params }, `[Rows_API_GET] ${params.entity}`);
  const { t } = await time(getTranslations(request), "getTranslations");
  invariant(params.entity, "Expected params.entity");
  let apiAccessValidation: ApiAccessValidation | undefined = undefined;
  const startTime = performance.now();
  try {
    apiAccessValidation = await time(validateApiKey(request, params), "validateApiKey");
    await loadEntities();
    const { tenant, tenantApiKey, userId } = apiAccessValidation;

    const entity = EntitiesSingleton.getEntityByIdNameOrSlug(params.entity);
    const data = await time(
      RowsApi.get(params.id, {
        entity,
        tenantId: tenant?.id ?? null,
        userId,
        time,
      }),
      "RowsApi.get"
    );
    if (tenant && tenantApiKey) {
      await setApiKeyLogStatus(tenantApiKey.apiKeyLog.id, {
        status: 200,
        startTime,
      });
      await time(reportUsage(tenant.id, "api"), "reportUsage");
    }

    let usage = undefined;
    if (tenantApiKey) {
      usage = {
        plan: t(tenantApiKey.usage?.title ?? "", { 0: tenantApiKey.usage?.value }),
        remaining: tenantApiKey.usage?.remaining,
      };
    }
    const entities = EntitiesSingleton.getInstance().getEntities();
    return Response.json(
      {
        success: true,
        data: ApiHelper.getApiFormatWithRelationships({
          entities,
          item: data.item,
        }),
        usage,
      },
      { headers: getServerTimingHeader() }
    );
  } catch (e: any) {
    let status = e.message.includes("Rate limit exceeded") ? 429 : 400;
    // eslint-disable-next-line no-console
    console.error({ error: e.message });
    if (apiAccessValidation?.tenantApiKey) {
      await setApiKeyLogStatus(apiAccessValidation.tenantApiKey.apiKeyLog.id, {
        error: JSON.stringify(e),
        status,
        startTime,
      });
    }
    return Response.json({ error: e.message }, { status, headers: getServerTimingHeader() });
  }
};

async function handleDelete(params: { id?: string }, entity: any, tenantId: string | null, userId: string, time: any) {
  await time(
    RowsApi.del(params.id, {
      entity,
      tenantId,
      time,
      userId,
    }),
    "RowsApi.del"
  );
  return "{}";
}

interface HandlePutParams {
  request: Request;
  params: { id?: string };
  entity: any;
  tenant: any;
  userId: string;
  existing: any;
  t: any;
  time: any;
}

async function handlePut({ request, params, entity, tenant, userId, existing, t, time }: HandlePutParams) {
  const jsonBody = await time(request.json(), "request.json");
  const rowValues = ApiHelper.getRowPropertiesFromJson(t, entity, jsonBody, existing);
  await time(
    RowsApi.update(params.id, {
      entity,
      tenantId: tenant?.id ?? null,
      userId,
      rowValues,
      time,
    }),
    "RowsApi.update"
  );
  return jsonBody;
}

function assertAllowedMethod(method: string) {
  if (method !== "PUT" && method !== "DELETE") {
    throw new Error("Method not allowed");
  }
}

async function writeApiKeyStatus({
  tenant,
  tenantApiKey,
  status,
  startTime,
}: {
  tenant: any;
  tenantApiKey: any;
  status: number;
  startTime: number;
}) {
  if (!tenant || !tenantApiKey) return;
  await setApiKeyLogStatus(tenantApiKey.apiKeyLog.id, {
    status,
    startTime,
  });
  await reportUsage(tenant.id, "api");
}

// PUT OR DELETE
export const action: ActionFunction = async ({ request, params }) => {
  const { time, getServerTimingHeader } = await createMetrics({ request, params }, `[Rows_API_${request.method}] ${params.entity}`);
  invariant(params.entity, "Expected params.entity");
  const { t } = await time(getTranslations(request), "getTranslations");
  const method = request.method.toUpperCase();
  assertAllowedMethod(method);
  let apiAccessValidation: ApiAccessValidation | undefined = undefined;
  const startTime = performance.now();
  try {
    apiAccessValidation = await time(validateApiKey(request, params), "validateApiKey");
    await loadEntities();
    const { tenant, tenantApiKey, userId } = apiAccessValidation;
    const entity = EntitiesSingleton.getEntityByIdNameOrSlug(params.entity);
    const tenantId = tenant?.id ?? null;
    const data = await time(
      RowsApi.get(params.id, {
        entity,
        tenantId,
        userId,
        time,
      }),
      "RowsApi.get"
    );
    if (!data.item) {
      throw new Error(t("shared.notFound"));
    }
    const existing = data.item;
    const isDelete = method === "DELETE";
    const jsonBody = isDelete
      ? await handleDelete(params, entity, tenantId, userId, time)
      : await handlePut({ request, params, entity, tenant, userId, existing, t, time });
    const status = isDelete ? 204 : 200;
    await time(writeApiKeyStatus({ tenant, tenantApiKey, status, startTime }), "writeApiKeyStatus");
    await time(
      createRowLog(request, {
        tenantId: tenant?.id ?? null,
        createdByApiKey: tenantApiKey?.apiKeyLog.apiKeyId,
        action: isDelete ? DefaultLogActions.Deleted : DefaultLogActions.Updated,
        entity,
        details: JSON.stringify(jsonBody),
        item: isDelete ? null : existing,
      }),
      "createRowLog"
    );
    if (isDelete) {
      return Response.json({ success: true }, { status, headers: getServerTimingHeader() });
    }
    const refreshed = await time(
      RowsApi.get(params.id, {
        entity,
        time,
      }),
      "RowsApi.get"
    );
    return Response.json(ApiHelper.getApiFormat(entity, refreshed.item), {
      status,
      headers: getServerTimingHeader(),
    });
  } catch (e: any) {
    let status = e.message.includes("Rate limit exceeded") ? 429 : 400;
    if (apiAccessValidation?.tenantApiKey) {
      await setApiKeyLogStatus(apiAccessValidation?.tenantApiKey.apiKeyLog.id, {
        error: e.message,
        status,
        startTime,
      });
    }
    return Response.json({ error: e.message }, { status, headers: getServerTimingHeader() });
  }
};
