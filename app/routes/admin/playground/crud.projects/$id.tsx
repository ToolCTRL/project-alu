import { ActionFunction, LoaderFunctionArgs, MetaFunction, redirect, useLoaderData, useActionData, useSearchParams, useSubmit } from "react-router";
import ServerError from "~/components/ui/errors/ServerError";
import EditPageLayout from "~/components/ui/layouts/EditPageLayout";
import FakeProjectOverview from "~/modules/fake/fakeProjectsCrud/components/FakeProjectOverview";
import { FakeProjectDto } from "~/modules/fake/fakeProjectsCrud/dtos/FakeProjectDto";
import { FakeProjectService } from "~/modules/fake/fakeProjectsCrud/services/FakeCrudService";
import FakeProjectForm from "~/modules/fake/fakeProjectsCrud/components/FakeProjectForm";
import ButtonSecondary from "~/components/ui/buttons/ButtonSecondary";
import { FakeTaskDto } from "~/modules/fake/fakeProjectsCrud/dtos/FakeTaskDto";

export const meta: MetaFunction<typeof loader> = ({ data }) => data?.metadata || [];

type LoaderData = {
  item?: FakeProjectDto;
  metadata: [{ title: string }];
};
export const loader = async ({ params }: LoaderFunctionArgs) => {
  const item = await FakeProjectService.get(params.id);
  if (!item) {
    throw redirect("/admin/playground/crud/projects");
  }
  const data: LoaderData = {
    metadata: [{ title: item.name }],
    item,
  };
  return data;
};

type ActionData = {
  success?: string;
  error?: string;
};
async function handleEdit(params: any, form: FormData) {
  const name = form.get("name") as string;
  const description = form.get("description");
  const tasks: Partial<FakeTaskDto>[] = form.getAll("tasks[]").map((f: FormDataEntryValue) => {
    return JSON.parse(String(f));
  });
  const isActive = form.get("isActive");
  const active = isActive ? isActive === "on" || isActive === "true" : false;

  if (!name) {
    throw new Error("Please fill all fields");
  }

  if (tasks.length === 0) {
    throw new Error("Please add at least one task");
  }

  await FakeProjectService.update(params.id, {
    name,
    description,
    active,
    tasks,
  });
  return Response.json({ success: "Project updated" });
}

async function handleCompleteTask(form: FormData) {
  const projectId = form.get("project-id") as string;
  const taskId = form.get("task-id") as string;
  await FakeProjectService.completeTask(projectId, taskId);
  return Response.json({ success: "Task completed" });
}

async function handleDelete(params: any) {
  await FakeProjectService.del(params.id);
  return redirect("/admin/playground/crud/projects");
}

export const action: ActionFunction = async ({ request, params }) => {
  const form = await request.formData();
  const action = form.get("action")?.toString() ?? "";

  try {
    if (action === "edit") {
      return await handleEdit(params, form);
    } else if (action === "complete-task") {
      return await handleCompleteTask(form);
    } else if (action === "delete") {
      return await handleDelete(params);
    } else {
      return Response.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (e: any) {
    return Response.json({ error: e.message }, { status: 400 });
  }
};

export default function FakeProjectEditRoute() {
  const data = useLoaderData<LoaderData>();
  const actionData = useActionData<ActionData>();
  const submit = useSubmit();
  const [searchParams, setSearchParams] = useSearchParams();

  return (
    <EditPageLayout
      title="Edit Fake Project"
      menu={[
        {
          title: "Fake Projects",
          routePath: "/admin/playground/crud/projects",
        },
        {
          title: data.item?.name ?? "Edit",
          routePath: "/admin/playground/crud/projects/" + data.item?.id,
        },
      ]}
    >
      <div className="flex items-center justify-between space-x-2">
        <h1 className="text-foreground truncate text-lg font-bold">{data.item?.name}</h1>
        <ButtonSecondary
          onClick={() => {
            if (searchParams.get("editing")) {
              setSearchParams({});
            } else {
              setSearchParams(new URLSearchParams({ editing: "true" }));
            }
          }}
        >
          {searchParams.get("editing") ? "Cancel" : "Edit"}
        </ButtonSecondary>
      </div>

      {data.item && (
        <div className="mx-auto space-y-2">
          {searchParams.get("editing") ? (
            <FakeProjectForm
              item={data.item}
              actionData={actionData}
              canDelete={true}
              onCancel={() => {
                setSearchParams({});
              }}
            />
          ) : (
            <FakeProjectOverview
              item={data.item}
              actionData={actionData}
              onCompleteTask={(s) => {
                const form = new FormData();
                form.append("action", "complete-task");
                form.append("project-id", data.item?.id ?? "");
                form.append("task-id", s.id);
                submit(form, {
                  method: "post",
                });
              }}
            />
          )}
        </div>
      )}
    </EditPageLayout>
  );
}

export function ErrorBoundary() {
  return <ServerError />;
}
