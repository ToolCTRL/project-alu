import { Colors } from "~/application/enums/shared/Colors";
import MonacoEditor from "~/components/editors/MonacoEditor";
import SimpleBadge from "~/components/ui/badges/SimpleBadge";
import InputText from "~/components/ui/input/InputText";
import DateUtils from "~/utils/shared/DateUtils";
import { EventWithDetails } from "../db/events.db.server";

interface Props {
  readonly item: EventWithDetails;
}
export default function EventDetails({ item }: Props) {
  const formattedData = () => {
    try {
      return JSON.stringify(JSON.parse(item.data), null, 2);
    } catch {
      return item.data;
    }
  };
  return (
    <div className="space-y-3 text-sm">
      <div className="border-border flex justify-between border-b pb-3">
        <h3>
          <SimpleBadge className="text-lg" title={item.name} color={Colors.VIOLET} />
        </h3>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <InputText name="createdAt" title="Created at" defaultValue={DateUtils.dateYMDHMS(item.createdAt)} readOnly={true} />
        <InputText name="account" title="Account" defaultValue={item.tenant?.name ?? ""} readOnly={true} />
        <InputText name="user" title="User" defaultValue={item.user?.email || ""} readOnly={true} />
      </div>

      <div className="h-96 overflow-auto p-2">
        <MonacoEditor value={formattedData()} onChange={() => {}} theme="vs-dark" language="json" />
      </div>
    </div>
  );
}
