import { Colors } from "~/application/enums/shared/Colors";
import SimpleBadge from "~/components/ui/badges/SimpleBadge";

interface Props {
  startedAt: Date | null;
  finishedAt: Date | null;
  endpoint: string;
  status: number | null;
}
enum State {
  NotCatched = "Webhook not catched",
  Running = "Running",
  Info = "Info",
  Success = "Success",
  Redirect = "Redirected",
  ClientError = "Client error",
  ServerError = "Server error",
  Unknown = "Unknown",
}
export default function StatusBadge({ startedAt, finishedAt, endpoint, status }: readonly Props) {
  function getStatusCategory() {
    if (status === null) return null;
    if (status >= 200 && status < 300) return "success";
    if (status >= 300 && status < 400) return "redirect";
    if (status >= 400 && status < 500) return "clientError";
    if (status >= 500) return "serverError";
    return "unknown";
  }

  function getState() {
    if (status === null && startedAt === null) {
      return State.NotCatched;
    }
    if (status === null && startedAt !== null && finishedAt === null) {
      return State.Running;
    }
    if (status === null || finishedAt === null) {
      return State.Unknown;
    }
    const category = getStatusCategory();
    const statusLabel = {
      success: State.Success,
      redirect: State.Redirect,
      clientError: State.ClientError,
      serverError: State.ServerError,
      unknown: State.Unknown,
    }[category];
    return `[${status}] ${statusLabel}`;
  }

  function getColor() {
    if (status === null) {
      return Colors.YELLOW;
    }
    const category = getStatusCategory();
    return {
      success: Colors.GREEN,
      redirect: Colors.ORANGE,
      clientError: Colors.RED,
      serverError: Colors.RED,
      unknown: Colors.UNDEFINED,
    }[category];
  }
  return (
    <div title={endpoint}>
      <SimpleBadge title={getState()} color={getColor()} />
    </div>
  );
}
