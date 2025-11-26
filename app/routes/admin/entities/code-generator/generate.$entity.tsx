import { LoaderFunction } from "react-router";
import { getEntityByName } from "~/utils/db/entities/entities.db.server";
import CodeGeneratorService from "~/modules/codeGenerator/service/CodeGeneratorService";
import { verifyUserHasPermission } from "~/utils/helpers/.server/PermissionsService";

export const loader: LoaderFunction = async ({ request, params }) => {
  await verifyUserHasPermission(request, "admin.entities.view");
  const entity = await getEntityByName({ tenantId: null, name: params.entity! });
  await CodeGeneratorService.generate({
    type: "dynamic",
    entity,
    moduleDirectory: `./app/modules/codeGeneratorTests/` + entity.slug,
    routesDirectory: `./app/routes/admin/entities/code-generator/tests/` + entity.slug,
    deleteFilesOnFinish: false,
  });
  return new Response(null, {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename=${entity.slug}.zip`,
    },
  });
};
