import { LoaderFunctionArgs, ActionFunction, redirect } from "react-router";
import { getTranslations } from "~/locale/i18next.server";
import { EntityViewsApi } from "~/utils/api/.server/EntityViewsApi";
import { getTenantIdOrNull } from "~/utils/services/.server/urlService";
import { EmailSenderWithoutApiKey, getAllEmailSenders, getEmailSender } from "../db/emailSender";
import EmailMarketingService from "../services/EmailMarketingService";
import { requireAuth } from "~/utils/loaders.middleware";

export namespace Campaigns_New {
  export type LoaderData = {
    title: string;
    contactsViews: EntityViewsApi.GetEntityViewsWithRows[];
    emailSenders: EmailSenderWithoutApiKey[];
  };
  export const loader = async ({ request, params }: LoaderFunctionArgs) => {
    await requireAuth({ request, params });
    const tenantId = await getTenantIdOrNull({ request, params });
    const emailSenders = await getAllEmailSenders(tenantId);
    const data: LoaderData = {
      title: `New campaign | ${process.env.APP_NAME}`,
      emailSenders,
      contactsViews: await EntityViewsApi.getAll({
        entityName: "contact",
        tenantId,
        withDefault: false,
        withRows: false,
      }),
    };
    return data;
  };

  export type ActionData = {
    error?: string;
    success?: string;
  };

  async function handleSendPreview(sender: any, tenantId: string | null, email: string, subject: string, htmlBody: string, textBody: string, t: any) {
    await EmailMarketingService.sendPreview({
      from: { sender, tenantId },
      email: { to: email, subject, htmlBody, textBody, track: true },
    });
    return Response.json({ success: t("shared.sent") }, { status: 200 });
  }

  async function handleSendContactPreview(params: {
    sender: any;
    tenantId: string | null;
    contactRowId: string;
    email: string;
    subject: string;
    htmlBody: string;
    textBody: string;
    t: any;
  }) {
    await EmailMarketingService.sendContactPreview({
      contactRowId: params.contactRowId,
      from: { sender: params.sender, tenantId: params.tenantId },
      email: { to: params.email, subject: params.subject, htmlBody: params.htmlBody, textBody: params.textBody, track: true },
    });
    return Response.json({ success: params.t("shared.sent") }, { status: 200 });
  }

  async function handleCreateCampaign(
    params: any,
    form: FormData,
    sender: any,
    tenantId: string | null,
    subject: string,
    htmlBody: string,
    textBody: string
  ) {
    const nameValue = form.get("name");
    const name = String(nameValue ?? "");
    if (!name) {
      return Response.json({ error: "Invalid name" }, { status: 400 });
    }
    const contactViewIdValue = form.get("contactViewId");
    const contactViewId = String(contactViewIdValue ?? "");
    if (!contactViewId) {
      return Response.json({ error: "Invalid contact/recipient list" }, { status: 400 });
    }
    const campaign = await EmailMarketingService.createCampaignDraft({
      name,
      contactViewId,
      from: { sender, tenantId },
      email: { subject, htmlBody, textBody, track: true },
    });
    return redirect(params.tenant ? `/app/${params.tenant}/email-marketing/campaigns/${campaign.id}` : `/admin/email-marketing/campaigns/${campaign.id}`);
  }

  export const action: ActionFunction = async ({ request, params }) => {
    await requireAuth({ request, params });
    const { t } = await getTranslations(request);
    const tenantId = await getTenantIdOrNull({ request, params });
    const form = await request.formData();
    const action = form.get("action")?.toString() ?? "";
    const email = form.get("email")?.toString() ?? "";
    const senderId = form.get("senderId")?.toString() ?? "";
    const subject = form.get("subject")?.toString() ?? "";
    const htmlBody = form.get("htmlBody")?.toString() ?? "";
    const textBody = form.get("textBody")?.toString() ?? "";
    const sender = await getEmailSender(senderId, tenantId);

    if (!sender) {
      return Response.json({ error: "Invalid sender" }, { status: 400 });
    }
    if (!htmlBody && !textBody) {
      return Response.json({ error: "Email body is required" }, { status: 400 });
    }

    try {
      switch (action) {
        case "send-preview":
          return await handleSendPreview(sender, tenantId, email, subject, htmlBody, textBody, t);
        case "send-contact-preview": {
          const contactRowId = form.get("contactRowId")?.toString() ?? "";
          return await handleSendContactPreview({ sender, tenantId, contactRowId, email, subject, htmlBody, textBody, t });
        }
        case "create":
          return await handleCreateCampaign(params, form, sender, tenantId, subject, htmlBody, textBody);
        default:
          return Response.json({ error: t("shared.invalidForm") }, { status: 400 });
      }
    } catch (e: any) {
      return Response.json({ error: e.message }, { status: 400 });
    }
  };
}
