import { Fragment } from "react";
import { Colors } from "~/application/enums/shared/Colors";
import SimpleBadge from "~/components/ui/badges/SimpleBadge";
import { ApiKeyLogDto } from "../dtos/ApiKeyLogDto";

function getStatusColor(status: number | null): Colors {
  if (status === null) {
    return Colors.YELLOW;
  }

  if (status >= 200 && status < 300) {
    return Colors.GREEN;
  }

  if (status >= 300 && status < 400) {
    return Colors.ORANGE;
  }

  if (status >= 400) {
    return Colors.RED;
  }

  return Colors.UNDEFINED;
}

export default function ApiCallStatusBadge({ item, underline }: { readonly item: ApiKeyLogDto; readonly underline?: boolean }) {
  const title = item.status?.toString() ?? "?";
  const color = getStatusColor(item.status);

  return <SimpleBadge title={title} color={color} underline={underline} />;
}
