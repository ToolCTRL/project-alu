import { useParams } from "react-router";

export default function EntityRowRelationshipsRoute() {
  const { entity } = useParams();

  if (typeof entity !== "string") {
    throw new TypeError("Route param 'entity' must be a string");
  }

  return <div>Todo</div>;
}
