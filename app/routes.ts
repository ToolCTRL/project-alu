import { type RouteConfig } from "@react-router/dev/routes";
import { remixConfigRoutes } from "@react-router/remix-config-routes-adapter";
import { createRoutesFromFolders } from "./utils/compat/v1-route-convention";

const routes: RouteConfig = remixConfigRoutes(async (defineRoutes) => {
  return createRoutesFromFolders(defineRoutes, {
    ignoredFilePatterns: ["**/.*", "**/*.css"],
  });
});

export default routes;
