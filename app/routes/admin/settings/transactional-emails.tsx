import { ActionFunction, LoaderFunctionArgs, MetaFunction, useFetcher, Form, useActionData, useLoaderData } from "react-router";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import ButtonPrimary from "~/components/ui/buttons/ButtonPrimary";
import TableSimple from "~/components/ui/tables/TableSimple";
import { getTranslations } from "~/locale/i18next.server";
import { useAdminData } from "~/utils/data/useAdminData";
import { createAdminLog } from "~/utils/db/logs.db.server";
import { verifyUserHasPermission } from "~/utils/helpers/.server/PermissionsService";
import { createPostmarkEmailTemplates, deleteEmailTemplate } from "~/utils/services/emailService";
import EmailTemplates from "~/modules/emails/utils/EmailTemplates";
import EditPageLayout from "~/components/ui/layouts/EditPageLayout";
import { AppConfiguration, getAppConfiguration, updateAppConfiguration } from "~/utils/db/appConfiguration.db.server";
import { Badge } from "~/components/ui/badge";
import { sendEmail } from "~/modules/emails/services/EmailService";
import { Button } from "~/components/ui/button";
import { toast } from "sonner";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { cn } from "~/lib/utils";
import InputSelect from "~/components/ui/input/InputSelect";
import ModalOrSlide from "~/components/ui/modals/ModalOrSlide";
import { GearIcon } from "@radix-ui/react-icons";
import { requireUser } from "~/utils/session.server";
import { db } from "~/utils/db.server";
import { requireAuth } from "~/utils/loaders.middleware";
import BackButtonWithTitle from "~/components/ui/buttons/BackButtonWithTitle";

export const meta: MetaFunction<typeof loader> = ({ data }) => [{ title: data?.title }];

type LoaderData = {
  title: string;
  items: { name: string; description: string }[];
  appConfiguration: AppConfiguration;
  providers: {
    name: string;
    value: string;
    error: string | null;
  }[];
};
export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  await requireAuth({ request, params });
  const appConfiguration = await getAppConfiguration({ request });
  await verifyUserHasPermission(request, "admin.emails.view");
  const items = EmailTemplates.allTemplates;
  const { t } = await getTranslations(request);
  let providers = [
    {
      name: "Postmark",
      value: "postmark",
      error: process.env.POSTMARK_SERVER_TOKEN ? null : "POSTMARK_SERVER_TOKEN is not set",
    },
    {
      name: "Resend",
      value: "resend",
      error: process.env.RESEND_API_KEY ? null : "RESEND_API_KEY is not set",
    },
    {
      name: "SendGrid",
      value: "sendgrid",
      error: process.env.SENDGRID_API_KEY ? null : "SENDGRID_API_KEY is not set",
    },
  ];
  const data: LoaderData = {
    title: `${t("settings.admin.transactionalEmails.title")} | ${process.env.APP_NAME}`,
    items,
    appConfiguration,
    providers,
  };
  return data;
};

type ActionData = {
  error?: string;
  success?: string;
};
const stringOrEmpty = (value: FormDataEntryValue | null | undefined) => (typeof value === "string" ? value : "");
async function handleCreatePostmarkTemplates(request: Request) {
  await verifyUserHasPermission(request, "admin.emails.create");
  try {
    await createPostmarkEmailTemplates();
    return { success: "All templates created" };
  } catch (e: any) {
    return { error: e?.toString() };
  }
}

async function handleCreateEmailTemplate(request: Request, form: FormData) {
  await verifyUserHasPermission(request, "admin.emails.create");
  try {
    const alias = stringOrEmpty(form.get("alias"));
    if (alias === "") {
      return { error: `Alias ${alias} not found` };
    }
    await createPostmarkEmailTemplates(alias);
    await createAdminLog(request, "Created email template", alias);
    return { success: "Template created" };
  } catch (e: any) {
    return { error: e?.toString() };
  }
}

async function handleDeleteEmailTemplate(request: Request, form: FormData) {
  await verifyUserHasPermission(request, "admin.emails.delete");
  try {
    const alias = stringOrEmpty(form.get("alias"));
    if (alias === "") {
      return { error: `Alias ${alias} not found` };
    }
    await deleteEmailTemplate(alias);
    await createAdminLog(request, "Deleted email template", alias);
    return { success: "Template deleted" };
  } catch (e: any) {
    return { error: e?.toString() };
  }
}

async function handleSendTest(request: Request, form: FormData, user: Awaited<ReturnType<typeof requireUser>>) {
  const email = stringOrEmpty(form.get("email"));
  const templateName = stringOrEmpty(form.get("template"));
  if (email === "") {
    return { error: "Invalid email" };
  }
  const template = EmailTemplates.allTemplates.find((f) => f.name === templateName);
  if (!template) {
    return { error: "Invalid template" };
  }
  const appConfiguration = await getAppConfiguration({ request });
  try {
    await sendEmail({
      request,
      to: email,
      alias: template.name,
      ...template.parse({
        appConfiguration,
        data: {
          name: user?.firstName,
          invite_sender_name: user?.firstName,
          invite_sender_organization: "{Account Name}",
        },
      }),
    });
    return { success: "Test email sent" };
  } catch (e: any) {
    return { error: e?.toString() };
  }
}

async function handleUpdateAppConfiguration(request: Request, form: FormData, t: Awaited<ReturnType<typeof getTranslations>>["t"]) {
  const data = {
    emailProvider: stringOrEmpty(form.get("emailProvider")),
    emailFromEmail: stringOrEmpty(form.get("emailFromEmail")),
    emailFromName: stringOrEmpty(form.get("emailFromName")),
    emailSupportEmail: stringOrEmpty(form.get("emailSupportEmail")),
  };
  await updateAppConfiguration(data);
  const apiKey = stringOrEmpty(form.get("apiKey"));
  if (data.emailProvider && apiKey !== undefined) {
    await db.credential.upsert({
      where: { name: data.emailProvider },
      update: { value: apiKey },
      create: { name: data.emailProvider, value: apiKey },
    });
  }
  return { success: t("shared.updated") };
}

export const action: ActionFunction = async ({ request, params }) => {
  await requireAuth({ request, params });
  await verifyUserHasPermission(request, "admin.emails.update");
  const { t } = await getTranslations(request);
  const user = await requireUser({ request });

  const form = await request.formData();
  const action = form.get("action")?.toString();

  if (action === "create-postmark-email-templates") {
    return handleCreatePostmarkTemplates(request);
  }
  if (action === "create-email-template") {
    return handleCreateEmailTemplate(request, form);
  }
  if (action === "delete-postmark-email") {
    return handleDeleteEmailTemplate(request, form);
  }
  if (action === "send-test") {
    return handleSendTest(request, form, user);
  }
  if (action === "update-app-configuration") {
    return handleUpdateAppConfiguration(request, form, t);
  }
  return { error: t("shared.invalidForm") };
};

export default function TransactionalEmailsRoute() {
  const adminData = useAdminData();
  const data = useLoaderData<LoaderData>();
  const actionData = useActionData<ActionData>();
  const { t } = useTranslation();
  const fetcher = useFetcher<{ success?: string; error?: string }>();

  const [settingApiKey, setSettingApiKey] = useState(false);
  const [openSettings, setOpenSettings] = useState(false);
  const [emailProvider, setEmailProvider] = useState(data.appConfiguration.email.provider);

  useEffect(() => {
    if (fetcher.data?.success) {
      toast.success(fetcher.data.success);
      setOpenSettings(false);
      setSettingApiKey(false);
    } else if (fetcher.data?.error) {
      toast.error(fetcher.data.error);
    }
  }, [fetcher.data]);

  useEffect(() => {
    if (actionData?.success) {
      toast.success(actionData.success);
    } else if (actionData?.error) {
      toast.error(actionData.error);
    }
  }, [actionData]);

  function sendTest(templateName: string): void {
    let to = adminData.user?.email;
    if (to === "admin@email.com") {
      to = data.appConfiguration.email.supportEmail;
    }
    const email = globalThis.prompt("Email", to);
    if (!email || email.trim() === "") {
      return;
    }
    const form = new FormData();
    form.set("action", "send-test");
    form.set("template", templateName);
    form.set("email", email);
    fetcher.submit(form, {
      method: "post",
    });
  }
  function createPostmarkEmailTemplates() {
    const form = new FormData();
    form.set("action", "create-postmark-email-templates");
    fetcher.submit(form, {
      method: "post",
    });
  }
  function getProviderEnvName() {
    switch (emailProvider) {
      case "postmark":
        return "POSTMARK_SERVER_TOKEN";
      case "resend":
        return "RESEND_API_KEY";
      case "sendgrid":
        return "SENDGRID_API_KEY";
      default:
        return "";
    }
  }
  return (
    <EditPageLayout
      title={
        <BackButtonWithTitle href="/admin/settings">
          <div className="flex items-center gap-2">
            <div>{t("settings.admin.transactionalEmails.title")}</div>
            {data.appConfiguration.email.provider ? (
              <Badge variant="secondary" className="border border-blue-300 bg-blue-50 text-blue-800">
                {data.appConfiguration.email.provider}
              </Badge>
            ) : (
              <Badge variant="destructive">No provider configured</Badge>
            )}
          </div>
        </BackButtonWithTitle>
      }
      buttons={
        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={() => setOpenSettings(true)}>
            <GearIcon className="h-4 w-4" />
          </Button>
          {data.appConfiguration.email.provider === "postmark" && (
            <ButtonPrimary disabled={fetcher.state === "submitting"} type="button" onClick={createPostmarkEmailTemplates}>
              Create Postmark templates
            </ButtonPrimary>
          )}
        </div>
      }
    >
      <TableSimple
        items={EmailTemplates.allTemplates}
        headers={[
          {
            name: "name",
            title: t("admin.emails.name"),
            value: (i) => i.name,
          },
          {
            name: "description",
            title: t("shared.description"),
            value: (i) => i.description,
          },
        ]}
        actions={[
          {
            title: t("admin.emails.sendTest"),
            onClick: (_, item) => sendTest(item.name),
            disabled: () => fetcher.state === "submitting",
          },
        ]}
      />

      <ModalOrSlide
        type="slide"
        title="Email Settings"
        open={openSettings}
        setOpen={() => {
          setOpenSettings(false);
          setSettingApiKey(false);
        }}
        size="lg"
      >
        <fetcher.Form method="post">
          <input type="hidden" name="action" value="update-app-configuration" readOnly hidden />
          <div className="grid gap-2 sm:grid-cols-12">
            <div className="sm:col-span-12">
              <Label className="mb-1 block text-xs">Provider</Label>
              <InputSelect
                name="emailProvider"
                value={emailProvider}
                setValue={(e) => setEmailProvider(e?.toString() ?? "")}
                options={data.providers.map((p) => ({
                  value: p.value,
                  name: `${p.name}`,
                }))}
              />
            </div>

            <div className="sm:col-span-6">
              <Label className="mb-1 block text-xs">
                From email <span className="text-red-500">*</span>
              </Label>
              <Input
                type="email"
                name="emailFromEmail"
                defaultValue={data.appConfiguration.email.fromEmail}
                placeholder=""
                className="bg-background"
                required
              />
            </div>
            <div className="sm:col-span-6">
              <Label className="mb-1 block text-xs">From name</Label>
              <Input autoComplete="name" name="emailFromName" defaultValue={data.appConfiguration.email.fromName} placeholder="" className="bg-background" />
            </div>
            <div className="sm:col-span-12">
              <Label className="mb-1 block text-xs">Support email</Label>
              <Input type="email" name="emailSupportEmail" defaultValue={data.appConfiguration.email.supportEmail} placeholder="" className="bg-background" />
            </div>

            {settingApiKey && (
              <div className="sm:col-span-12">
                <Label className="mb-1 block text-xs">API Key</Label>
                <Input
                  name="apiKey"
                  placeholder={"Leave blank to use env variable: " + getProviderEnvName()}
                  className="bg-background"
                  style={{ WebkitTextSecurity: "disc" } as any}
                  autoFocus
                />
              </div>
            )}
          </div>
          <div className="mt-4 flex justify-between">
            <div>
              <Button type="button" size="sm" variant="ghost" onClick={() => setSettingApiKey(!settingApiKey)} className="w-full">
                <div className="flex justify-start text-left">Change API Key</div>
              </Button>
            </div>
            <Button
              variant="outline"
              type="submit"
              disabled={fetcher.state === "submitting"}
              className={cn(fetcher.state === "submitting" && fetcher.formData?.get("action") === "update-app-configuration" && "base-spinner")}
            >
              {t("shared.save")}
            </Button>
          </div>
        </fetcher.Form>
      </ModalOrSlide>
    </EditPageLayout>
  );
}
