import { EntityRelationshipWithDetails } from "../db/entities/entityRelationships.db.server";

// function getTopEntities({ entity }: { entity: EntityWithDetails }) {
//   return [...entity.parentEntities.filter((f) => f.type !== "one-to-one")];
// }

// function getBottomEntities({ entity }: { entity: EntityWithDetails }) {
//   return [...entity.childEntities, ...entity.parentEntities.filter((f) => f.type === "one-to-one")];
// }

function getTitle({ fromEntityId, relationship }: { fromEntityId: string; relationship: EntityRelationshipWithDetails }) {
  if (relationship.title) {
    return relationship.title;
  }
  const isParent = relationship.parentId === fromEntityId;
  switch (relationship.type) {
    case "one-to-one":
      return isParent ? relationship.child.title : relationship.parent.title;
    case "one-to-many":
      return isParent ? relationship.child.titlePlural : relationship.parent.title;
    case "many-to-one":
      return isParent ? relationship.child.title : relationship.parent.titlePlural;
    case "many-to-many":
      return isParent ? relationship.child.titlePlural : relationship.parent.titlePlural;
    default:
      return isParent ? relationship.child.titlePlural : relationship.parent.title;
  }
}

type RelationshipTitleConfig = {
  parentTitle: string;
  childTitle: string;
  parentCardinality: string;
  childCardinality: string;
};

function getRelationshipTitleConfig(
  relationship: EntityRelationshipWithDetails,
  type: string
): RelationshipTitleConfig {
  const configs: Record<string, RelationshipTitleConfig> = {
    "one-to-one": {
      parentTitle: `${relationship.child.title} (1)`,
      childTitle: `${relationship.parent.title} (1)`,
      parentCardinality: "(1)",
      childCardinality: "(1)",
    },
    "one-to-many": {
      parentTitle: `${relationship.child.titlePlural} (N)`,
      childTitle: `${relationship.parent.title} (1)`,
      parentCardinality: "(N)",
      childCardinality: "(1)",
    },
    "many-to-one": {
      parentTitle: `${relationship.child.title} (1)`,
      childTitle: `${relationship.parent.titlePlural} (N)`,
      parentCardinality: "(1)",
      childCardinality: "(N)",
    },
    "many-to-many": {
      parentTitle: `${relationship.child.titlePlural} (N)`,
      childTitle: `${relationship.parent.titlePlural} (N)`,
      parentCardinality: "(N)",
      childCardinality: "(N)",
    },
  };

  return configs[type] || configs["one-to-many"];
}

function getTitleWithName({ fromEntityId, relationship }: { fromEntityId: string; relationship: EntityRelationshipWithDetails }) {
  if (relationship.title) {
    return relationship.title;
  }

  const isParent = relationship.parentId === fromEntityId;
  const config = getRelationshipTitleConfig(relationship, relationship.type);
  const title = isParent ? config.parentTitle : config.childTitle;
  const requiresMarker = !isParent && relationship.required ? "*" : "";

  return `${title}${requiresMarker}`;
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
  // getTopEntities,
  // getBottomEntities,
  getTitle,
  getTitleWithName,
  getInputType,
};
