import { ActionFunctionArgs, LoaderFunctionArgs, redirect, useActionData, useLoaderData, Form, Link, useParams } from "react-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-hot-toast";
import ButtonPrimary from "~/components/ui/buttons/ButtonPrimary";
import InputText from "~/components/ui/input/InputText";
import EditPageLayout from "~/components/ui/layouts/EditPageLayout";
import SettingSection from "~/components/ui/sections/SettingSection";
import { getTranslations } from "~/locale/i18next.server";
import { PortalWithDetails, getPortalById, getPortalBySubdomain, updatePortal } from "~/modules/portals/db/portals.db.server";
import UrlUtils from "~/utils/app/UrlUtils";
import FormHelper from "~/utils/helpers/FormHelper";
import { getTenantIdOrNull } from "~/utils/services/.server/urlService";
import PortalServer from "~/modules/portals/services/Portal.server";
import InputSelect from "~/components/ui/input/InputSelect";
import { defaultThemes } from "~/utils/theme/defaultThemes";
import clsx from "clsx";
import InputImage from "~/components/ui/input/InputImage";
import InputCheckboxWithDescription from "~/components/ui/input/InputCheckboxWithDescription";
import { promiseHash } from "~/utils/promises/promiseHash";
import { storeSupabaseFile } from "~/utils/integrations/supabaseService";
import { useRootData } from "~/utils/data/useRootData";
import JsonPropertyValuesInput from "~/modules/jsonProperties/components/JsonPropertyValuesInput";
import { JsonPropertiesValuesDto } from "~/modules/jsonProperties/dtos/JsonPropertiesValuesDto";
import { getAppConfiguration } from "~/utils/db/appConfiguration.db.server";
import JsonPropertiesUtils from "~/modules/jsonProperties/utils/JsonPropertiesUtils";
import { requireAuth } from "~/utils/loaders.middleware";

type LoaderData = {
  item: PortalWithDetails & { portalUrl?: string };
};
export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  await requireAuth({ request, params });
  const tenantId = await getTenantIdOrNull({ request, params });
  const item = await getPortalById(tenantId, params.portal ?? "");
  if (!item) {
    return redirect(UrlUtils.getModulePath(params, "portals"));
  }
  item.portalUrl = PortalServer.getPortalUrl(item);
  const data: LoaderData = {
    item,
  };
  return data;
};

type ActionData = {
  success?: string;
  error?: string;
};
async function handleEdit(request: Request, form: FormData, item: any, t: any) {
  const subdomain = UrlUtils.slugify(typeof form.get("subdomain") === "string" ? form.get("subdomain") : "");
  const title = (typeof form.get("title") === "string" ? form.get("title") : "") || undefined;

  if (subdomain && subdomain !== item.subdomain) {
    const isValidSubdomainSyntax = /^[a-z0-9-]+$/i.test(subdomain);
    if (!isValidSubdomainSyntax) {
      return Response.json({ error: "Invalid subdomain" }, { status: 400 });
    }
    const existingSubdomain = await getPortalBySubdomain(subdomain);
    if (existingSubdomain) {
      return Response.json({ error: "Subdomain taken" }, { status: 400 });
    }
  }

  const appConfiguration = await getAppConfiguration({ request });
  const metadata = JsonPropertiesUtils.getValuesFromForm({
    form,
    properties: appConfiguration.portals?.metadata || [],
    prefix: "metadata",
  });

  await updatePortal(item, {
    subdomain,
    title,
    metadata,
  });

  return Response.json({ success: t("shared.saved") });
}

async function handleEditSeo(form: FormData, item: any, t: any) {
  const seoTitle = (typeof form.get("seoTitle") === "string" ? form.get("seoTitle") : "") || undefined;
  const seoDescription = (typeof form.get("seoDescription") === "string" ? form.get("seoDescription") : "") || undefined;
  const seoTwitterCreator = (typeof form.get("seoTwitterCreator") === "string" ? form.get("seoTwitterCreator") : "") || undefined;
  const seoTwitterSite = (typeof form.get("seoTwitterSite") === "string" ? form.get("seoTwitterSite") : "") || undefined;
  const seoKeywords = (typeof form.get("seoKeywords") === "string" ? form.get("seoKeywords") : "") || undefined;
  const seoImage = (typeof form.get("seoImage") === "string" ? form.get("seoImage") : "") || undefined;
  const seoThumbnail = (typeof form.get("seoThumbnail") === "string" ? form.get("seoThumbnail") : "") || undefined;

  const { storedSeoImage, storedSeoThumbnail } = await promiseHash({
    storedSeoImage: seoImage ? storeSupabaseFile({ bucket: "seo", content: seoImage, id: `${item.id}-seo-image.png` }) : Promise.resolve(""),
    storedSeoThumbnail: seoThumbnail ? storeSupabaseFile({ bucket: "seo", content: seoThumbnail, id: `${item.id}-thumbnail.png` }) : Promise.resolve(""),
  });

  await updatePortal(item, {
    seoTitle,
    seoDescription,
    seoImage: storedSeoImage,
    seoThumbnail: storedSeoThumbnail,
    seoTwitterCreator,
    seoTwitterSite,
    seoKeywords,
  });

  return Response.json({ success: t("shared.saved") });
}

async function handleEditBranding(form: FormData, item: any, t: any) {
  const themeColor = (typeof form.get("themeColor") === "string" ? form.get("themeColor") : "") || undefined;
  const themeScheme = (typeof form.get("themeScheme") === "string" ? form.get("themeScheme") : "") || undefined;
  const logo = (typeof form.get("logo") === "string" ? form.get("logo") : "") || undefined;
  const logoDarkMode = (typeof form.get("logoDarkMode") === "string" ? form.get("logoDarkMode") : "") || undefined;
  const icon = (typeof form.get("icon") === "string" ? form.get("icon") : "") || undefined;
  const iconDarkMode = (typeof form.get("iconDarkMode") === "string" ? form.get("iconDarkMode") : "") || undefined;
  const favicon = (typeof form.get("favicon") === "string" ? form.get("favicon") : "") || undefined;

  const { storedLogo, storedLogoDarkMode, storedIcon, storedIconDarkMode, storedFavicon } = await promiseHash({
    storedLogo: logo ? storeSupabaseFile({ bucket: "branding", content: logo, id: `${item.id}-logo.png` }) : Promise.resolve(""),
    storedLogoDarkMode: logoDarkMode ? storeSupabaseFile({ bucket: "branding", content: logoDarkMode, id: `${item.id}-logo-dark-mode.png` }) : Promise.resolve(""),
    storedIcon: icon ? storeSupabaseFile({ bucket: "branding", content: icon, id: `${item.id}-icon.png` }) : Promise.resolve(""),
    storedIconDarkMode: iconDarkMode ? storeSupabaseFile({ bucket: "branding", content: iconDarkMode, id: `${item.id}-icon-dark-mode.png` }) : Promise.resolve(""),
    storedFavicon: favicon ? storeSupabaseFile({ bucket: "branding", content: favicon, id: `${item.id}-favicon.ico` }) : Promise.resolve(""),
  });

  await updatePortal(item, {
    themeColor,
    themeScheme,
    brandingLogo: storedLogo,
    brandingLogoDarkMode: storedLogoDarkMode,
    brandingIcon: storedIcon,
    brandingIconDarkMode: storedIconDarkMode,
    brandingFavicon: storedFavicon,
  });

  return Response.json({ success: t("shared.saved") });
}

async function handleEditAnalytics(form: FormData, item: any, t: any) {
  const simpleAnalytics = FormHelper.getBoolean(form, "simpleAnalytics");
  const plausibleAnalytics = FormHelper.getBoolean(form, "plausibleAnalytics");
  const googleAnalyticsTrackingId = (typeof form.get("googleAnalyticsTrackingId") === "string" ? form.get("googleAnalyticsTrackingId") : "") || undefined;

  await updatePortal(item, {
    analyticsSimpleAnalytics: simpleAnalytics,
    analyticsPlausibleAnalytics: plausibleAnalytics,
    analyticsGoogleAnalyticsTrackingId: googleAnalyticsTrackingId,
  });

  return Response.json({ success: t("shared.saved") });
}

export const action = async ({ request, params }: ActionFunctionArgs) => {
  await requireAuth({ request, params });
  const { t } = await getTranslations(request);

  const tenantId = await getTenantIdOrNull({ request, params });
  const item = await getPortalById(tenantId, params.portal ?? "");
  if (!item) {
    return Response.json({ error: t("shared.notFound") }, { status: 404 });
  }

  const form = await request.formData();
  const action = form.get("action");

  if (action === "edit") {
    return handleEdit(request, form, item, t);
  }
  if (action === "edit-seo") {
    return handleEditSeo(form, item, t);
  }
  if (action === "edit-branding") {
    return handleEditBranding(form, item, t);
  }
  if (action === "edit-analytics") {
    return handleEditAnalytics(form, item, t);
  }
  return Response.json({ error: t("shared.invalidForm") }, { status: 400 });
};

export default function PortalSettings() {
  const { t } = useTranslation();
  const data = useLoaderData<LoaderData>();
  const actionData = useActionData<ActionData>();
  const params = useParams();
  const rootData = useRootData();
  const portalsConfig = rootData.appConfiguration.portals;

  const [item, setItem] = useState(data.item);

  useEffect(() => {
    setItem(data.item);
  }, [data]);

  useEffect(() => {
    if (actionData?.success) {
      toast.success(actionData.success);
    } else if (actionData?.error) {
      toast.error(actionData.error);
    }
  }, [actionData]);

  return (
    <EditPageLayout
      title={t("shared.settings")}
      withHome={false}
      menu={[
        // {
        //   title: t("models.portal.plural"),
        //   routePath: UrlUtils.getModulePath(params, "portals"),
        // },
        {
          title: data.item.title,
          routePath: UrlUtils.getModulePath(params, `portals/${data.item.subdomain}`),
        },
        {
          title: t("shared.settings"),
        },
      ]}
    >
      <div className="pb-10">
        <SettingSection title={t("settings.tenant.general")}>
          <Form method="post">
            <input type="hidden" name="action" value="edit" readOnly hidden />
            <div className="space-y-2">
              <InputText
                name="title"
                title={t("models.portal.title")}
                value={item.title}
                setValue={(e) => setItem({ ...item, title: e.toString() })}
                required
              />
              <InputText
                name="subdomain"
                title={t("models.portal.subdomain")}
                value={item.subdomain}
                setValue={(e) => setItem({ ...item, subdomain: e.toString() })}
                required
                hint={
                  <div>
                    {item.portalUrl && (
                      <Link to={item.portalUrl} target="_blank" className="underline">
                        {item.portalUrl}
                      </Link>
                    )}
                  </div>
                }
              />

              {portalsConfig?.metadata && (
                <JsonPropertyValuesInput prefix="metadata" properties={portalsConfig?.metadata} attributes={item.metadata as JsonPropertiesValuesDto} />
              )}
              {/* <InputCheckboxWithDescription
                name="isPublished"
                value={item.isPublished}
                setValue={(e) => setItem({ ...item, isPublished: Boolean(e) })}
                title="Published"
                description="Visible to the public."
              /> */}
              <div className="flex justify-end">
                <ButtonPrimary type="submit">{t("shared.save")}</ButtonPrimary>
              </div>
            </div>
          </Form>
        </SettingSection>

        {/*Separator */}
        <div className="block">
          <div className="py-5">
            <div className="border-border border-t"></div>
          </div>
        </div>

        <SettingSection title={"Branding"}>
          <Form method="post">
            <input type="hidden" name="action" value="edit-branding" readOnly hidden />
            <div className="space-y-2">
              <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-6 sm:gap-x-6">
                <div className="sm:col-span-3">
                  <InputSelect
                    name="themeColor"
                    title={t("models.portal.themeColor")}
                    defaultValue={item.themeColor ?? ""}
                    placeholder={t("shared.select") + "..."}
                    options={defaultThemes.map((item) => ({
                      name: item.name,
                      value: item.value,
                      component: (
                        <div className="flex items-center space-x-2">
                          <div
                            className={clsx(
                              `theme-${item.value}`,
                              " bg-primary text-primary inline-flex shrink-0 items-center rounded-full text-xs font-medium"
                            )}
                          >
                            <svg className={clsx("h-2 w-2")} fill="currentColor" viewBox="0 0 8 8">
                              <circle cx={4} cy={4} r={3} />
                            </svg>
                          </div>
                          <div>{item.name}</div>
                        </div>
                      ),
                    }))}
                  />
                </div>
                <div className="sm:col-span-3">
                  <InputSelect
                    name="themeScheme"
                    title={t("models.portal.themeScheme")}
                    defaultValue={item.themeScheme ?? "light"}
                    placeholder={t("shared.select") + "..."}
                    options={[
                      {
                        name: t("shared.light"),
                        value: "light",
                      },
                      {
                        name: t("shared.dark"),
                        value: "dark",
                      },
                    ]}
                  />
                </div>
                <div className="sm:col-span-3">
                  <InputImage
                    name="logo"
                    title={t("models.portal.logo")}
                    value={item.brandingLogo ?? ""}
                    setValue={(e) => setItem({ ...item, brandingLogo: e.toString() })}
                  />
                </div>
                <div className="sm:col-span-3">
                  <InputImage
                    name="logoDarkMode"
                    title={t("models.portal.logoDark")}
                    value={item.brandingLogoDarkMode ?? ""}
                    setValue={(e) => setItem({ ...item, brandingLogoDarkMode: e.toString() })}
                    className="dark"
                  />
                </div>
                <div className="sm:col-span-3">
                  <InputImage
                    name="icon"
                    title={t("models.portal.icon")}
                    value={item.brandingIcon ?? ""}
                    setValue={(e) => setItem({ ...item, brandingIcon: e.toString() })}
                  />
                </div>
                <div className="sm:col-span-3">
                  <InputImage
                    name="iconDarkMode"
                    title={t("models.portal.iconDark")}
                    value={item.brandingIconDarkMode ?? ""}
                    setValue={(e) => setItem({ ...item, brandingIconDarkMode: e.toString() })}
                    className="dark"
                  />
                </div>
                <div className="sm:col-span-6">
                  <InputImage
                    name="favicon"
                    title={t("models.portal.favicon")}
                    value={item.brandingFavicon ?? ""}
                    setValue={(e) => setItem({ ...item, brandingFavicon: e.toString() })}
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <ButtonPrimary type="submit">{t("shared.save")}</ButtonPrimary>
              </div>
            </div>
          </Form>
        </SettingSection>

        {/*Separator */}
        <div className="block">
          <div className="py-5">
            <div className="border-border border-t"></div>
          </div>
        </div>

        <SettingSection title="SEO">
          <Form method="post">
            <input type="hidden" name="action" value="edit-seo" readOnly hidden />
            <div className="space-y-2">
              <InputText
                name="seoTitle"
                title={t("shared.title")}
                value={item.seoTitle ?? ""}
                setValue={(e) => setItem({ ...item, seoTitle: e.toString() })}
                required
              />
              <InputText
                name="seoDescription"
                title={t("shared.description")}
                value={item.seoDescription ?? ""}
                setValue={(e) => setItem({ ...item, seoDescription: e.toString() })}
                required
              />
              <div className="grid grid-cols-2 gap-2">
                <InputImage
                  name="seoImage"
                  title={t("shared.image")}
                  value={item.seoImage ?? ""}
                  setValue={(e) => setItem({ ...item, seoImage: e.toString() })}
                />
                <InputImage
                  name="seoThumbnail"
                  title={t("shared.thumbnail")}
                  value={item.seoThumbnail ?? ""}
                  setValue={(e) => setItem({ ...item, seoThumbnail: e.toString() })}
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <InputText
                  name="seoTwitterCreator"
                  title={t("models.portal.seoTwitterCreator")}
                  value={item.seoTwitterCreator ?? ""}
                  setValue={(e) => setItem({ ...item, seoTwitterCreator: e.toString() })}
                />
                <InputText
                  name="seoTwitterSite"
                  title={t("models.portal.seoTwitterSite")}
                  value={item.seoTwitterSite ?? ""}
                  setValue={(e) => setItem({ ...item, seoTwitterSite: e.toString() })}
                />
              </div>

              <InputText
                name="seoKeywords"
                title={t("shared.keywords")}
                value={item.seoKeywords ?? ""}
                setValue={(e) => setItem({ ...item, seoKeywords: e.toString() })}
              />

              <div className="flex justify-end">
                <ButtonPrimary type="submit">{t("shared.save")}</ButtonPrimary>
              </div>
            </div>
          </Form>
        </SettingSection>

        {/*Separator */}
        <div className="block">
          <div className="py-5">
            <div className="border-border border-t"></div>
          </div>
        </div>

        <SettingSection title={t("models.portal.analytics")}>
          <Form method="post">
            <input type="hidden" name="action" value="edit-analytics" readOnly hidden />
            <div className="space-y-2">
              <InputCheckboxWithDescription
                name="simpleAnalytics"
                value={item.analyticsSimpleAnalytics}
                setValue={(e) => setItem({ ...item, analyticsSimpleAnalytics: Boolean(e) })}
                title="SimpleAnalytics"
                description={
                  <a href="https://www.simpleanalytics.com/?referral=hesef" target="_blank" rel="noreferrer">
                    {t("shared.clickHereToTryLearnMore")}.
                  </a>
                }
              />

              <InputCheckboxWithDescription
                name="plausibleAnalytics"
                value={item.analyticsPlausibleAnalytics}
                setValue={(e) => setItem({ ...item, analyticsPlausibleAnalytics: Boolean(e) })}
                title="Plausible"
                description={
                  <a href="https://plausible.io/" target="_blank" rel="noreferrer">
                    {t("shared.clickHereToTryLearnMore")}.
                  </a>
                }
              />

              <InputText
                hideChars
                name="googleAnalyticsTrackingId"
                value={item.analyticsGoogleAnalyticsTrackingId ?? ""}
                setValue={(e) => setItem({ ...item, analyticsGoogleAnalyticsTrackingId: e.toString() })}
                title="Google Analytics ID"
                placeholder="UA-123456789-1"
              />

              <div className="flex justify-end">
                <ButtonPrimary type="submit">{t("shared.save")}</ButtonPrimary>
              </div>
            </div>
          </Form>
        </SettingSection>
      </div>
    </EditPageLayout>
  );
}
