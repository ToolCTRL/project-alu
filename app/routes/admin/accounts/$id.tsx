import { useTranslation } from "react-i18next";
import { ActionFunction, LoaderFunctionArgs, MetaFunction, redirect, useLoaderData } from "react-router";
import { useActionData, useParams, useSubmit } from "react-router";
import { getTranslations } from "~/locale/i18next.server";
import { getTenant, getTenantBySlug, getTenantUsers, TenantWithDetails, updateTenant } from "~/utils/db/tenants.db.server";
import UpdateTenantDetailsForm from "~/components/core/tenants/UpdateTenantDetailsForm";
import { createAdminLog } from "~/utils/db/logs.db.server";
import UsersTable from "~/components/core/users/UsersTable";
import { adminGetAllTenantUsers } from "~/utils/db/users.db.server";
import {
  getOrPersistTenantSubscription,
  getTenantSubscription,
  TenantSubscriptionWithDetails,
  updateTenantSubscriptionCustomerId,
} from "~/utils/db/tenantSubscriptions.db.server";
import { getAllSubscriptionProducts } from "~/utils/db/subscriptionProducts.db.server";
import { createStripeCustomer } from "~/utils/stripe.server";
import { Fragment, useEffect, useRef } from "react";
import ErrorModal, { RefErrorModal } from "~/components/ui/modals/ErrorModal";
import SuccessModal, { RefSuccessModal } from "~/components/ui/modals/SuccessModal";
import { useAdminData } from "~/utils/data/useAdminData";
import ConfirmModal, { RefConfirmModal } from "~/components/ui/modals/ConfirmModal";
import ButtonPrimary from "~/components/ui/buttons/ButtonPrimary";
import { deleteAndCancelTenant } from "~/utils/services/tenantService";
import { getUserHasPermission } from "~/utils/helpers/PermissionsHelper";
import { verifyUserHasPermission } from "~/utils/helpers/.server/PermissionsService";
import { TenantUserType } from "~/application/enums/tenants/TenantUserType";
import { SubscriptionProductDto } from "~/application/dtos/subscriptions/SubscriptionProductDto";
import { EntityWithDetails, findEntityByName } from "~/utils/db/entities/entities.db.server";
import { RowsApi } from "~/utils/api/.server/RowsApi";
import { getAllTenantTypes } from "~/utils/db/tenants/tenantTypes.db.server";
import { TenantType } from "@prisma/client";
import EditPageLayout from "~/components/ui/layouts/EditPageLayout";
import SettingSection from "~/components/ui/sections/SettingSection";
import { getUserInfo } from "~/utils/session.server";

export const meta: MetaFunction<typeof loader> = ({ data }) => [{ title: data?.title }];

type LoaderData = {
  title: string;
  tenant: TenantWithDetails;
  users: Awaited<ReturnType<typeof adminGetAllTenantUsers>>;
  subscription: TenantSubscriptionWithDetails | null;
  subscriptionProducts: SubscriptionProductDto[];
  isStripeTest: boolean;
  tenantSettingsEntity: EntityWithDetails | null;
  tenantTypes: TenantType[];
};

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  await verifyUserHasPermission(request, "admin.account.view");
  const { t } = await getTranslations(request);

  const tenant = await getTenant(params.id!);
  if (!tenant) {
    throw redirect("/admin/accounts");
  }
  const users = await adminGetAllTenantUsers(tenant.id);
  const subscription = await getTenantSubscription(params.id ?? "");
  const subscriptionProducts = await getAllSubscriptionProducts();

  const tenantSettingsEntity = await findEntityByName({ tenantId: null, name: "tenantSettings" });
  const data: LoaderData = {
    title: `${t("models.tenant.object")} | ${process.env.APP_NAME}`,
    tenant,
    users,
    subscription,
    subscriptionProducts,
    isStripeTest: process.env.STRIPE_SK?.toString().startsWith("sk_test_") ?? true,
    tenantSettingsEntity,
    tenantTypes: await getAllTenantTypes(),
  };
  return data;
};

type ActionData = {
  updateSubscriptionSuccess?: string;
  updateDetailsError?: string;
  updateSubscriptionError?: string;
};

const badRequest = (data: ActionData) => Response.json(data, { status: 400 });

async function validateTenantEdit(name: string, slug: string, typeIds: string[]) {
  if ((name?.length ?? 0) < 1) {
    return badRequest({
      updateDetailsError: "Account name must have at least 1 character",
    });
  }
  if (!slug || slug.length < 1) {
    return badRequest({ updateDetailsError: "Account slug must have at least 1 character" });
  }

  const tenantTypes = await getAllTenantTypes();
  for (const type of typeIds) {
    if (!tenantTypes.find((t) => t.id === type)) {
      return badRequest({
        updateDetailsError: "Invalid tenant type",
      });
    }
  }

  if (["settings"].includes(slug.toLowerCase())) {
    return badRequest({
      updateDetailsError: "Slug cannot be " + slug,
    });
  }
  if (slug.includes(" ")) {
    return badRequest({
      updateDetailsError: "Slug cannot contain white spaces",
    });
  }
  return null;
}

async function handleEditAction(form: FormData, params: any) {
  const { t } = await getTranslations({ request: {} as Request });
  const nameValue = form.get("name");
  const name = nameValue != null ? String(nameValue) : "";
  const slugValue = form.get("slug");
  const slug = (slugValue != null ? String(slugValue) : "").toLowerCase();
  const iconValue = form.get("icon");
  const icon = iconValue != null ? String(iconValue) : "";
  const typeIds = form.getAll("typeIds[]").map(String);

  const validationError = await validateTenantEdit(name, slug, typeIds);
  if (validationError) {
    return validationError;
  }

  const existing = await getTenant(params.id!);
  if (!existing) {
    return badRequest({ updateDetailsError: "Invalid tenant" });
  }

  if (existing.slug !== slug) {
    const existingSlug = await getTenantBySlug(slug);
    if (existingSlug) {
      return badRequest({
        updateDetailsError: "Slug already taken",
      });
    }
  }

  await createAdminLog({} as Request, "Update tenant details", JSON.stringify({ name, slug }));

  const tenantSettingsEntity = await findEntityByName({ tenantId: null, name: "tenantSettings" });
  if (tenantSettingsEntity) {
    try {
      await RowsApi.createCustom({
        entity: tenantSettingsEntity,
        tenantId: existing.id,
        t,
        form,
        row: existing?.tenantSettingsRow?.row,
        rowCreateInput: { tenantSettingsRow: { create: { tenantId: existing.id } } },
      });
    } catch (e: any) {
      return badRequest({ updateDetailsError: e.message });
    }
  }

  await updateTenant(existing, { name, icon, slug, typeIds });
  return Response.json({
    success: t("settings.tenant.updated"),
  });
}

export const action: ActionFunction = async ({ request, params }) => {
  await verifyUserHasPermission(request, "admin.account.settings.update");
  const { t } = await getTranslations(request);
  const userInfo = await getUserInfo(request);

  const form = await request.formData();
  const action = form.get("action")?.toString() ?? "";

  if (action === "edit") {
    return handleEditAction(form, params);
  } else if (action === "create-stripe-customer") {
    const tenant = await getTenant(params.id ?? "");
    if (!tenant) {
      return badRequest({ updateSubscriptionError: "Invalid tenant" });
    }
    const tenantUsers = await getTenantUsers(params.id ?? "");
    if (tenantUsers.length === 0) {
      return badRequest({ updateSubscriptionError: "No users found" });
    }
    const tenantOwner = tenantUsers.find((user) => user.type === TenantUserType.OWNER);
    if (!tenantOwner) {
      return badRequest({ updateSubscriptionError: "No owner found" });
    }
    const tenantSubscription = await getOrPersistTenantSubscription(tenant.id);
    if (tenantSubscription.stripeCustomerId) {
      return badRequest({ updateSubscriptionError: "Stripe Customer already set" });
    }
    const stripeCustomer = await createStripeCustomer(tenantOwner.user.email, tenant.name);
    if (!stripeCustomer) {
      return badRequest({ updateSubscriptionError: "Could not create stripe customer" });
    }
    await updateTenantSubscriptionCustomerId(tenant.id, {
      stripeCustomerId: stripeCustomer.id,
    });
    const data: ActionData = {
      updateSubscriptionSuccess: "Stripe customer created",
    };
    return data;
  } else if (action === "delete-tenant") {
    await deleteAndCancelTenant({ tenantId: params.id ?? "", userId: userInfo.userId, t });
    return redirect("/admin/accounts");
  } else {
    return badRequest({ updateDetailsError: t("shared.invalidForm") });
  }
};

export default function TenantRoute() {
  const adminData = useAdminData();
  const params = useParams();
  const data = useLoaderData<LoaderData>();
  const actionData = useActionData<ActionData>();
  const { t } = useTranslation();
  const submit = useSubmit();

  const errorModal = useRef<RefErrorModal>(null);
  const successModal = useRef<RefSuccessModal>(null);
  const confirmDelete = useRef<RefConfirmModal>(null);

  useEffect(() => {
    if (actionData?.updateSubscriptionSuccess) {
      successModal.current?.show(actionData?.updateSubscriptionSuccess);
    } else if (actionData?.updateSubscriptionError) {
      errorModal.current?.show(actionData?.updateSubscriptionError);
    } else if (actionData?.updateDetailsError) {
      errorModal.current?.show(actionData?.updateDetailsError);
    }
  }, [actionData]);

  function deleteAccount() {
    confirmDelete.current?.show(t("settings.danger.confirmDeleteTenant"), t("shared.confirm"), t("shared.cancel"), t("shared.warningCannotUndo"));
  }
  function confirmDeleteTenant() {
    const form = new FormData();
    form.set("action", "delete-tenant");
    submit(form, { method: "post" });
  }

  return (
    <EditPageLayout
      title={data.tenant.name}
      menu={[
        { title: t("models.tenant.plural"), routePath: "/admin/accounts" },
        { title: data.tenant?.name ?? "", routePath: "/admin/accounts/" + params.id },
      ]}
    >
      <SettingSection title={t("settings.tenant.general")} description={t("settings.tenant.generalDescription")}>
        <div className="mt-5 md:col-span-2 md:mt-0">
          <UpdateTenantDetailsForm
            tenant={data.tenant}
            disabled={!getUserHasPermission(adminData, "admin.account.settings.update")}
            tenantSettingsEntity={data.tenantSettingsEntity}
            tenantTypes={data.tenantTypes}
            options={{
              canChangeType: true,
            }}
          />
        </div>
      </SettingSection>

      {/*Separator */}
      <div className="block">
        <div className="py-5">
          <div className="border-border border-t"></div>
        </div>
      </div>

      {/* Tenant Users */}
      {getUserHasPermission(adminData, "admin.account.users") && (
        <Fragment>
          <SettingSection title={t("models.user.plural")}>
            <div className="mt-5 md:col-span-2 md:mt-0">
              <UsersTable
                items={data.users}
                canImpersonate={getUserHasPermission(adminData, "admin.users.impersonate")}
                canChangePassword={getUserHasPermission(adminData, "admin.users.changePassword")}
                canSetUserRoles={false}
                canDelete={getUserHasPermission(adminData, "admin.users.delete")}
              />
            </div>
          </SettingSection>

          {/*Separator */}
          <div className="block">
            <div className="py-5">
              <div className="border-border border-t"></div>
            </div>
          </div>
        </Fragment>
      )}

      {/* Tenant Subscription */}
      {/* {getUserHasPermission(adminData, "admin.account.subscription") && (
          <>
            <div className="md:grid lg:grid-cols-3 md:gap-2">
              <div className="md:col-span-1">
                <div className="sm:px-0">
                  <h3 className="text-lg font-medium leading-6 text-foreground">{t("models.subscriptionProduct.object")}</h3>
                </div>
              </div>
              <div className="mt-5 md:mt-0 md:col-span-2">
                <UpdateTenantSubscriptionForm
                  tenant={data.tenant}
                  subscription={data.subscription}
                  subscriptionProducts={data.subscriptionProducts}
                  isStripeTest={data.isStripeTest}
                />
              </div>
            </div>

            <div className="block">
              <div className="py-5">
                <div className="border-t border-border"></div>
              </div>
            </div>
          </>
        )} */}

      {/*Danger */}
      {getUserHasPermission(adminData, "admin.account.delete") && (
        <SettingSection title={t("settings.danger.title")} description={t("settings.danger.description")}>
          <div className="mt-12 md:col-span-2 md:mt-0">
            <div>
              <input hidden type="text" name="action" value="deleteAccount" readOnly />
              <div className="">
                <div className="">
                  <h3 className="text-foreground text-lg font-medium leading-6">Delete account</h3>
                  <div className="text-muted-foreground mt-2 max-w-xl text-sm leading-5">
                    <p>Delete organization and cancel subscriptions.</p>
                  </div>
                  <div className="mt-4">
                    <ButtonPrimary destructive={true} onClick={deleteAccount}>
                      {t("settings.danger.deleteAccount")}
                    </ButtonPrimary>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </SettingSection>
      )}

      <ConfirmModal ref={confirmDelete} onYes={confirmDeleteTenant} />
      <SuccessModal ref={successModal} />
      <ErrorModal ref={errorModal} />
    </EditPageLayout>
  );
}
