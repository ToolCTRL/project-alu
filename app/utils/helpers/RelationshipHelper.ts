import { EntityRelationshipWithDetails } from "../db/entities/entityRelationships.db.server";

function getTitle({ fromEntityId, relationship }: { fromEntityId: string; relationship: EntityRelationshipWithDetails }) {
  if (relationship.title) {
    return relationship.title;
  }
  const isParent = relationship.parentId === fromEntityId;
  const child = relationship.child;
  const parent = relationship.parent;

  if (relationship.type === "one-to-one") {
    return isParent ? child.title : parent.title;
  }
  if (relationship.type === "one-to-many") {
    return isParent ? child.titlePlural : parent.title;
  }
  if (relationship.type === "many-to-one") {
    return isParent ? child.title : parent.titlePlural;
  }
  if (relationship.type === "many-to-many") {
    return isParent ? child.titlePlural : parent.titlePlural;
  }
  return isParent ? child.titlePlural : parent.title;
}

function getTitleWithName({ fromEntityId, relationship }: { fromEntityId: string; relationship: EntityRelationshipWithDetails }) {
  if (relationship.title) {
    return relationship.title;
  }
  const isParent = relationship.parentId === fromEntityId;
  const child = relationship.child;
  const parent = relationship.parent;
  const requiredMarker = relationship.required ? "*" : "";

  if (relationship.type === "one-to-one") {
    return isParent ? `${child.title} (1)` : `${parent.title} (1)${requiredMarker}`;
  }
  if (relationship.type === "one-to-many") {
    return isParent ? `${child.titlePlural} (N)` : `${parent.title} (1)${requiredMarker}`;
  }
  if (relationship.type === "many-to-one") {
    return isParent ? `${child.title} (1)${requiredMarker}` : `${parent.titlePlural} (N)`;
  }
  if (relationship.type === "many-to-many") {
    return isParent ? `${child.titlePlural} (N)` : `${parent.titlePlural} (N)${requiredMarker}`;
  }
  return isParent ? `${child.titlePlural} (N)` : `${parent.title} (1)${requiredMarker}`;
}

function getInputType({ fromEntityId, relationship }: { fromEntityId: string; relationship: EntityRelationshipWithDetails }): "single-select" | "multi-select" {
  const isParent = relationship.parentId === fromEntityId;
  switch (relationship.type) {
    case "one-to-one":
      return "single-select";
    case "one-to-many":
      return isParent ? "multi-select" : "single-select";
    case "many-to-one":
      return isParent ? "single-select" : "multi-select";
    case "many-to-many":
      return "multi-select";
    default:
      return isParent ? "multi-select" : "single-select";
  }
}

export default {
  getTitle,
  getTitleWithName,
  getInputType,
};
