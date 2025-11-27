import { Params, useMatches } from "react-router";
import UrlUtils from "../app/UrlUtils";
import { TenantUserWithUser } from "../db/tenants.db.server";

export type MembersLoaderData = {
  users: TenantUserWithUser[];
};

export function useMembersData(params: Params): MembersLoaderData {
  return (useMatches().find((f) => f.pathname === UrlUtils.currentTenantUrl(params, "settings/members"))?.data ?? {}) as MembersLoaderData;
}
