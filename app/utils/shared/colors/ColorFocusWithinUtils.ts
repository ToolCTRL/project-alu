import { Colors } from "~/application/enums/shared/Colors";

const TEXT_600_MAP: Record<Colors, string> = {
  [Colors.UNDEFINED]: "focus-within:text-gray-600",
  [Colors.SLATE]: "focus-within:text-slate-600",
  [Colors.GRAY]: "focus-within:text-gray-600",
  [Colors.NEUTRAL]: "focus-within:text-neutral-600",
  [Colors.STONE]: "focus-within:text-stone-600",
  [Colors.RED]: "focus-within:text-red-600",
  [Colors.ORANGE]: "focus-within:text-orange-600",
  [Colors.AMBER]: "focus-within:text-amber-600",
  [Colors.YELLOW]: "focus-within:text-yellow-600",
  [Colors.LIME]: "focus-within:text-lime-600",
  [Colors.GREEN]: "focus-within:text-green-600",
  [Colors.EMERALD]: "focus-within:text-emerald-600",
  [Colors.TEAL]: "focus-within:text-teal-600",
  [Colors.CYAN]: "focus-within:text-cyan-600",
  [Colors.SKY]: "focus-within:text-sky-600",
  [Colors.BLUE]: "focus-within:text-blue-600",
  [Colors.INDIGO]: "focus-within:text-indigo-600",
  [Colors.VIOLET]: "focus-within:text-violet-600",
  [Colors.PURPLE]: "focus-within:text-purple-600",
  [Colors.FUCHSIA]: "focus-within:text-fuchsia-600",
  [Colors.PINK]: "focus-within:text-pink-600",
  [Colors.ROSE]: "focus-within:text-rose-600",
};

function getText600(itemColor: Colors): string {
  return TEXT_600_MAP[itemColor];
}

export default {
  getText600,
};
