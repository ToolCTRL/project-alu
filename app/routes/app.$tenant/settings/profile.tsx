import { useEffect } from "react";
import { useAppData } from "~/utils/data/useAppData";
import { ActionFunction, LoaderFunctionArgs, MetaFunction, redirect, useActionData } from "react-router";
import { updateUserPassword, updateUserProfile } from "~/utils/db/users.db.server";
import { getUserInfo } from "~/utils/session.server";
import { db } from "~/utils/db.server";
import bcrypt from "bcryptjs";
import { getTranslations } from "~/locale/i18next.server";
import { deleteUserWithItsTenants } from "~/utils/services/userService";
import { storeSupabaseFile } from "~/utils/integrations/supabaseService";
import EditPageLayout from "~/components/ui/layouts/EditPageLayout";
import EventsService from "~/modules/events/services/.server/EventsService";
import { UserProfileUpdatedDto } from "~/modules/events/dtos/UserProfileUpdatedDto";
import { getTenantIdFromUrl } from "~/utils/services/.server/urlService";
import { getTenant } from "~/utils/db/tenants.db.server";
import { UserPasswordUpdatedDto } from "~/modules/events/dtos/UserPasswordUpdatedDto";
import { AccountDeletedDto } from "~/modules/events/dtos/AccountDeletedDto";
import { UserProfileDeletedDto } from "~/modules/events/dtos/UserProfileDeletedDto";
import UserProfileSettings from "~/modules/users/components/UserProfileSettings";
import toast from "react-hot-toast";
import { requireAuth } from "~/utils/loaders.middleware";

type LoaderData = {
  title: string;
};

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  await requireAuth({ request, params });
  const { t } = await getTranslations(request);
  const data: LoaderData = {
    title: `${t("settings.profile.profileTitle")} | ${process.env.APP_NAME}`,
  };
  return data;
};

type ActionData = {
  success?: string;
  error?: string;
};

async function handleProfileUpdate(
  firstName: string | undefined,
  lastName: string,
  avatar: string,
  userInfo: any,
  user: any,
  request: Request,
  t: any
) {
  const fieldErrors = {
    firstName: (firstName ?? "").length < 2 ? "First name required" : "",
  };
  if (Object.values(fieldErrors).some(Boolean)) {
    return Response.json({ error: `Form not submitted correctly.`, fields: fieldErrors }, { status: 400 });
  }

  if (typeof firstName !== "string" || typeof lastName !== "string") {
    return Response.json({ error: `Form not submitted correctly.` }, { status: 400 });
  }

  const avatarStored = avatar ? await storeSupabaseFile({ bucket: "users-icons", content: avatar, id: userInfo?.userId }) : avatar;
  const profile = await updateUserProfile({ firstName, lastName, avatar: avatarStored }, userInfo?.userId);
  if (!profile) {
    return Response.json({ error: `Something went wrong.` }, { status: 400 });
  }
  await EventsService.create({
    request,
    event: "user.profile.updated",
    tenantId: null,
    userId: user.id,
    data: {
      email: user.email,
      new: { firstName, lastName },
      old: { firstName: user.firstName, lastName: user.lastName },
      userId: userInfo?.userId,
    } satisfies UserProfileUpdatedDto,
  });
  return Response.json({
    success: t("shared.updated"),
  });
}

async function handlePasswordUpdate(
  passwordCurrent: string | undefined,
  passwordNew: string | undefined,
  passwordNewConfirm: string | undefined,
  user: any,
  userInfo: any,
  request: Request,
  t: any
) {
  if (typeof passwordCurrent !== "string" || typeof passwordNew !== "string" || typeof passwordNewConfirm !== "string") {
    return Response.json({ error: `Form not submitted correctly.` }, { status: 400 });
  }

  if (passwordNew !== passwordNewConfirm) {
    return Response.json({ error: t("account.shared.passwordMismatch") }, { status: 400 });
  }

  if (passwordNew.length < 6) {
    return Response.json(
      {
        error: `Passwords must have least 6 characters.`,
      },
      { status: 400 }
    );
  }

  if (!user) return null;

  const isCorrectPassword = await bcrypt.compare(passwordCurrent, user.passwordHash);
  if (!isCorrectPassword) {
    return Response.json({ error: `Invalid password.` }, { status: 400 });
  }

  const passwordHash = await bcrypt.hash(passwordNew, 10);
  await updateUserPassword({ passwordHash }, userInfo?.userId);
  await EventsService.create({
    request,
    event: "user.password.updated",
    tenantId: null,
    userId: user.id,
    data: {
      user: { id: user.id, email: user.email },
    } satisfies UserPasswordUpdatedDto,
  });

  return Response.json({
    success: "Password updated",
  });
}

async function handleDeleteAccount(user: any, request: Request) {
  if (!user) {
    return null;
  }
  if (user.admin !== null) {
    return Response.json(
      {
        error: "Cannot delete an admin",
      },
      { status: 400 }
    );
  }

  try {
    const { deletedTenants } = await deleteUserWithItsTenants(user.id);
    const deletedAccounts = await Promise.all(
      deletedTenants.map(async (tenant) => {
        const data = {
          tenant: { id: tenant.id, name: tenant.name },
          user: { id: user.id, email: user.email },
        } satisfies AccountDeletedDto;
        await EventsService.create({
          request,
          event: "account.deleted",
          tenantId: null,
          userId: null,
          data,
        });
        return data;
      })
    );
    await EventsService.create({
      request,
      event: "user.profile.deleted",
      tenantId: null,
      userId: null,
      data: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        deletedAccounts,
      } satisfies UserProfileDeletedDto,
    });
  } catch (e: any) {
    return Response.json(
      {
        error: e,
      },
      { status: 400 }
    );
  }

  return redirect("/login");
}

export const action: ActionFunction = async ({ request, params }) => {
  await requireAuth({ request, params });
  const { t } = await getTranslations(request);
  const tenantId = await getTenantIdFromUrl(params);
  const userInfo = await getUserInfo(request);
  const form = await request.formData();
  const action = form.get("action");

  const toSafeString = (value: FormDataEntryValue | null) => (typeof value === "string" ? value : "");

  const firstName = toSafeString(form.get("firstName"));
  const lastName = toSafeString(form.get("lastName"));
  const avatar = toSafeString(form.get("avatar"));

  const passwordCurrent = toSafeString(form.get("passwordCurrent")) || undefined;
  const passwordNew = toSafeString(form.get("passwordNew")) || undefined;
  const passwordNewConfirm = toSafeString(form.get("passwordNewConfirm")) || undefined;

  if (typeof action !== "string") {
    return Response.json({ error: `Form not submitted correctly.` }, { status: 400 });
  }

  const user = await db.user.findUnique({
    where: { id: userInfo?.userId },
    include: {
      admin: true,
    },
  });
  const tenant = await getTenant(tenantId);
  if (!user) {
    return Response.json({ error: `User not found.` }, { status: 400 });
  }
  if (!tenant) {
    return Response.json({ error: `Account not found.` }, { status: 400 });
  }
  switch (action) {
    case "profile":
      return handleProfileUpdate(firstName, lastName, avatar, userInfo, user, request, t);
    case "password":
      return handlePasswordUpdate(passwordCurrent, passwordNew, passwordNewConfirm, user, userInfo, request, t);
    case "deleteAccount":
      return handleDeleteAccount(user, request);
  }
};

export const meta: MetaFunction<typeof loader> = ({ data }) => [{ title: data?.title }];

export default function ProfileRoute() {
  const appData = useAppData();
  const actionData = useActionData<ActionData>();

  useEffect(() => {
    if (actionData?.success) {
      toast.success(actionData.success);
    } else if (actionData?.error) {
      toast.error(actionData.error);
    }
  }, [actionData]);

  return (
    <EditPageLayout className="pb-20">
      <UserProfileSettings user={appData.user} />
    </EditPageLayout>
  );
}
