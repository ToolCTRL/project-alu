import { getAppConfiguration } from "~/utils/db/appConfiguration.db.server";
import { sendEmailPostmark } from "./PostmarkEmailService";
import { sendEmailResend } from "./ResendEmailService";
import { sendEmailSendGrid } from "./SendGridEmailService";
import invariant from "tiny-invariant";
import { db } from "~/utils/db.server";

export async function sendEmail({
  request,
  to,
  subject,
  body,
  alias,
  data,
  manualConfig,
}: {
  request: Request;
  to: string;
  subject: string;
  body: string;
  alias?: string;
  data?: {
    [key: string]: any;
  };
  manualConfig?: {
    provider: "postmark" | "resend" | "sendgrid";
    apiKey: string;
    fromEmail: string;
    fromName: string;
  };
}) {
  const config = manualConfig ?? (await getEmailConfig({ request, throwError: true }));
  if (!config) {
    // eslint-disable-next-line no-console
    throw new Error("📧 Email provider not configured");
  }
  // eslint-disable-next-line no-console
  console.log("📧 Sending email", { providerSettings: config.provider, to, subject, data });
  switch (config.provider) {
    case "postmark":
      return await sendEmailPostmark({ request, data: { to, subject, body, alias, data }, config });
    case "resend":
      invariant(subject, "Subject is required");
      invariant(body, "Body is required");
      return await sendEmailResend({ request, data: { to, subject, body }, config });
    case "sendgrid":
      invariant(subject, "Subject is required");
      invariant(body, "Body is required");
      return await sendEmailSendGrid({ request, data: { to, subject, body }, config });
    default:
      throw new Error("Invalid provider: " + config.provider);
  }
}

export async function getEmailProvider({ request }: { request: Request }) {
  const clientConfig = await getEmailConfig({ request });
  return clientConfig?.provider;
}

async function getProviderApiKey(provider: string, apiKeyCredentialValue?: string): Promise<string | null> {
  const providersMap: { [key: string]: string } = {
    postmark: "POSTMARK_SERVER_TOKEN",
    resend: "RESEND_API_KEY",
    sendgrid: "SENDGRID_API_KEY",
  };
  const envVarName = providersMap[provider];
  if (!envVarName) {
    return apiKeyCredentialValue || null;
  }
  return apiKeyCredentialValue || process.env[envVarName] || null;
}

function validateAndThrowIfNeeded(apiKey: string | null, provider: string, throwError: boolean): boolean {
  if (apiKey) {
    return true;
  }
  const errorMessages: { [key: string]: string } = {
    postmark: "POSTMARK_SERVER_TOKEN required",
    resend: "RESEND_API_KEY required",
    sendgrid: "SENDGRID_API_KEY required",
  };
  const errorMsg = errorMessages[provider] || "Email provider API key required";
  // eslint-disable-next-line no-console
  console.error(`📧 ${errorMsg}`);
  if (throwError) {
    throw new Error(errorMsg);
  }
  return false;
}

export async function getEmailConfig({ request, throwError = false }: { request: Request; throwError?: boolean }) {
  const appConfiguration = await getAppConfiguration({ request });
  const apiKeyCredential = await db.credential.findUnique({
    where: {
      name: appConfiguration.email.provider,
    },
  });
  const provider = appConfiguration.email.provider;
  const apiKey = await getProviderApiKey(provider, apiKeyCredential?.value?.toString());

  if (!validateAndThrowIfNeeded(apiKey, provider, throwError)) {
    return null;
  }

  return {
    apiKey,
    ...appConfiguration.email,
  };
}
