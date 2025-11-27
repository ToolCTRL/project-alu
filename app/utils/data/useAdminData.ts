import { useMatches } from "react-router";
import { AppOrAdminData } from "./useAppOrAdminData";
import EntitiesSingleton from "~/modules/rows/repositories/EntitiesSingleton";

export type AdminLoaderData = AppOrAdminData;

export function useAdminData(): AdminLoaderData {
  const paths = new Set(["routes/admin"]);
  const adminData = (useMatches().find((f) => paths.has(f.id.toLowerCase()))?.data ?? {}) as AdminLoaderData;
  EntitiesSingleton.getInstance().setEntities(adminData.entities);
  return adminData;
}
