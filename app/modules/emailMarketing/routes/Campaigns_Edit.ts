import { LoaderFunctionArgs, redirect, ActionFunction } from "react-router";
import { getTranslations } from "~/locale/i18next.server";
import { getTenantIdOrNull } from "~/utils/services/.server/urlService";
import { CampaignWithDetails, getCampaign, deleteCampaign, updateCampaign } from "../db/campaigns.db.server";
import { EmailSenderWithoutApiKey, getAllEmailSenders } from "../db/emailSender";
import EmailMarketingService from "../services/EmailMarketingService";
import { EntityWithDetails, getAllEntities } from "~/utils/db/entities/entities.db.server";
import { requireAuth } from "~/utils/loaders.middleware";

export namespace Campaigns_Edit {
  export type LoaderData = {
    title: string;
    item: CampaignWithDetails;
    emailSenders: EmailSenderWithoutApiKey[];
    allEntities: EntityWithDetails[];
  };
  export const loader = async ({ request, params }: LoaderFunctionArgs) => {
    await requireAuth({ request, params });
    const tenantId = await getTenantIdOrNull({ request, params });
    const item = await getCampaign(params.id, tenantId);
    if (!item) {
      return redirect(params.tenant ? `/app/${params.tenant}/email-marketing/campaigns` : "/admin/email-marketing/campaigns");
    }
    const emailSenders = await getAllEmailSenders(tenantId);
    const data: LoaderData = {
      title: `${item.name} | ${process.env.APP_NAME}`,
      item,
      emailSenders,
      allEntities: await getAllEntities({ tenantId, active: true }),
    };
    return data;
  };

  export type ActionData = {
    error?: string;
    success?: string;
  };

  async function handleDelete(params: any, tenantId: string | null) {
    await deleteCampaign(params.id, tenantId);
    return redirect(params.tenant ? `/app/${params.tenant}/email-marketing/campaigns` : "/admin/email-marketing/campaigns");
  }

  async function handleUpdate(params: any, form: FormData, t: any) {
    const name = form.get("name");
    const subject = form.get("subject");
    const htmlBody = form.get("htmlBody");
    const textBody = form.get("textBody");
    await updateCampaign(params.id, {
      name: String(name ?? ""),
      subject: String(subject ?? ""),
      htmlBody: String(htmlBody ?? ""),
      textBody: String(textBody ?? ""),
    });
    return Response.json({ success: t("shared.saved") });
  }

  async function handleSend(item: any, t: any) {
    await EmailMarketingService.sendCampaign(item);
    return Response.json({ success: t("shared.sent") }, { status: 200 });
  }

  async function handleSendPreview(item: any, form: FormData, t: any) {
    const emailValue = form.get("email");
    const email = String(emailValue ?? "");
    await EmailMarketingService.sendCampaignTest(item, email);
    return Response.json({ success: t("shared.sent") }, { status: 200 });
  }

  export const action: ActionFunction = async ({ request, params }) => {
    await requireAuth({ request, params });
    const { t } = await getTranslations(request);
    const tenantId = await getTenantIdOrNull({ request, params });
    const form = await request.formData();
    const action = form.get("action")?.toString() ?? "";
    const item = await getCampaign(params.id, tenantId);

    if (!item) {
      return Response.json({ error: t("shared.notFound") }, { status: 404 });
    }

    try {
      switch (action) {
        case "delete":
          return await handleDelete(params, tenantId);
        case "update":
          return await handleUpdate(params, form, t);
        case "send":
          return await handleSend(item, t);
        case "send-preview":
          return await handleSendPreview(item, form, t);
        default:
          return Response.json({ error: t("shared.invalidForm") }, { status: 400 });
      }
    } catch (e: any) {
      return Response.json({ error: e.message }, { status: 400 });
    }
  };
}
