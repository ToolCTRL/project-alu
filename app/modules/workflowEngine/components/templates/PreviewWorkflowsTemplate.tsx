import TableSimple from "~/components/ui/tables/TableSimple";
import { WorkflowsTemplateDto } from "../../dtos/WorkflowsTemplateDto";

function BlockTypeCell({ type, description }: { readonly type: string; readonly description: string | undefined }) {
  return (
    <div className="flex-col">
      <div>{type}</div>
      <div className="text-muted-foreground text-xs">{description || "No description"}</div>
    </div>
  );
}

function InputCell({ input }: { readonly input: any }) {
  return JSON.stringify({ input });
}

export default function PreviewWorkflowsTemplate({ template }: { readonly template: WorkflowsTemplateDto }) {
  return (
    <div>
      {template.workflows.map((workflow) => {
        return (
          <div key={workflow.name} className="space-y-2">
            <h3 className="font-medium">{workflow.name}</h3>
            <TableSimple
              items={workflow.blocks}
              headers={[
                {
                  name: "block",
                  title: "Block Type",
                  value: (i) => <BlockTypeCell type={i.type} description={i.description} />,
                },
                {
                  name: "input",
                  title: "Input",
                  value: (i) => <InputCell input={i.input} />,
                },
              ]}
            />
          </div>
        );
      })}
    </div>
  );
}
