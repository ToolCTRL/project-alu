import { Colors } from "~/application/enums/shared/Colors";

const colorNameMap: Record<Colors, string> = {
  [Colors.UNDEFINED]: "gray",
  [Colors.SLATE]: "slate",
  [Colors.GRAY]: "gray",
  [Colors.NEUTRAL]: "neutral",
  [Colors.STONE]: "stone",
  [Colors.RED]: "red",
  [Colors.ORANGE]: "orange",
  [Colors.AMBER]: "amber",
  [Colors.YELLOW]: "yellow",
  [Colors.LIME]: "lime",
  [Colors.GREEN]: "green",
  [Colors.EMERALD]: "emerald",
  [Colors.TEAL]: "teal",
  [Colors.CYAN]: "cyan",
  [Colors.SKY]: "sky",
  [Colors.BLUE]: "blue",
  [Colors.INDIGO]: "indigo",
  [Colors.VIOLET]: "violet",
  [Colors.PURPLE]: "purple",
  [Colors.FUCHSIA]: "fuchsia",
  [Colors.PINK]: "pink",
  [Colors.ROSE]: "rose",
};

function getFrom700To800(itemColor: Colors): string {
  const colorName = colorNameMap[itemColor];
  return `from-${colorName}-700 to-${colorName}-800`;
}

function getFrom800To900(itemColor: Colors): string {
  const colorName = colorNameMap[itemColor];
  if (itemColor === Colors.GRAY) {
    return "from-gray-900 to-black";
  }
  return `from-${colorName}-800 to-${colorName}-900`;
}

export default {
  getFrom700To800,
  getFrom800To900,
};
