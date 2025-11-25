import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import LinkOrAhref from "../ui/buttons/LinkOrAhref";
import clsx from "clsx";
import { FeatureDto } from "~/modules/pageBlocks/components/blocks/marketing/features/FeaturesBlockUtils";
import CheckIcon from "../ui/icons/CheckIcon";
import { Colors } from "~/application/enums/shared/Colors";
import Modal from "../ui/modals/Modal";
import XIcon from "../ui/icons/XIcon";
import ExternalLinkEmptyIcon from "../ui/icons/ExternalLinkEmptyIcon";
import { Link } from "react-router";

function getGridColumnsClass(itemsLength: number) {
  const classes = ["grid w-full grid-cols-1"];

  if (itemsLength > 1) {
    classes.push("md:grid-cols-2");
  }

  if (itemsLength === 2) {
    classes.push("lg:grid-cols-2");
  } else if (itemsLength === 3) {
    classes.push("lg:grid-cols-3");
  } else if (itemsLength === 4) {
    classes.push("lg:grid-cols-4");
  } else if (itemsLength > 4) {
    classes.push("lg:grid-cols-3");
  }

  return clsx(classes);
}

function getHighlightColorClass(color?: Colors) {
  if (!color) return "";

  const colorMap: Record<Colors, string> = {
    [Colors.GREEN]: "bg-teal-500/30 text-teal-800 dark:text-teal-100",
    [Colors.ROSE]: "bg-rose-500/30 text-rose-800 dark:text-rose-100",
    [Colors.VIOLET]: "bg-violet-500/30 text-violet-800 dark:text-violet-100",
    [Colors.BLUE]: "bg-blue-500/30 text-blue-800 dark:text-blue-100",
    [Colors.YELLOW]: "bg-yellow-500/30 text-yellow-800 dark:text-yellow-100",
    [Colors.RED]: "bg-red-500/30 text-red-800 dark:text-red-100",
    [Colors.ORANGE]: "bg-orange-500/30 text-orange-800 dark:text-orange-100",
    [Colors.CYAN]: "bg-cyan-500/30 text-cyan-800 dark:text-cyan-100",
    [Colors.INDIGO]: "bg-indigo-500/30 text-indigo-800 dark:text-indigo-100",
    [Colors.PINK]: "bg-pink-500/30 text-pink-800 dark:text-pink-100",
    [Colors.PURPLE]: "bg-purple-500/30 text-purple-800 dark:text-purple-100",
    [Colors.LIME]: "bg-lime-500/30 text-lime-800 dark:text-lime-100",
    [Colors.EMERALD]: "bg-emerald-500/30 text-emerald-800 dark:text-emerald-100",
    [Colors.AMBER]: "bg-amber-500/30 text-amber-800 dark:text-amber-100",
    [Colors.GRAY]: "bg-gray-500/30 text-gray-800 dark:text-gray-100",
    [Colors.SLATE]: "bg-slate-500/30 text-slate-800 dark:text-slate-100",
    [Colors.NEUTRAL]: "bg-neutral-500/30 text-neutral-800 dark:text-neutral-100",
    [Colors.UNDEFINED]: "",
  };

  return colorMap[color] || "";
}

export const HoverEffect = ({ items }: { items: FeatureDto[] }) => {
  let [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [selectedImage, setSelectedImage] = useState<FeatureDto | null>(null);
  const [showImage, setShowImage] = useState<boolean>(false);

  return (
    <div className={getGridColumnsClass(items.length)}>
      {items.map((item) => (
        <LinkOrAhref
          key={item.name}
          to={item?.link?.href}
          target={item?.link?.target}
          className="group relative  block h-full w-full p-2 "
          onMouseEnter={() => setHoveredIndex(items.indexOf(item))}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <AnimatePresence>
            {hoveredIndex === items.indexOf(item) && (
              <motion.span
                className="absolute inset-0 block h-full w-full rounded-3xl bg-slate-200/[0.8] dark:bg-slate-800/[0.8]"
                layoutId="hoverBackground" // required for the background to follow
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  transition: { duration: 0.15 },
                }}
                exit={{
                  opacity: 0,
                  transition: { duration: 0.15, delay: 0.2 },
                }}
              />
            )}
          </AnimatePresence>
          <article
            className={clsx(
              "relative  h-full w-full overflow-hidden rounded-2xl border border-transparent bg-linear-to-br p-3",
              item.className || "text-muted-foreground bg-slate-900/5 dark:bg-white/5"
            )}
          >
            <div className="relative ">
              <div className="p-4">
                <div className=" mt-4 flex items-center justify-between space-x-2">
                  <h4 className="text-foreground font-bold tracking-wide">
                    <div className="flex items-center space-x-2">
                      <Name item={item} />
                    </div>
                  </h4>
                  {item.highlight && (
                    <div
                      className={clsx(
                        "border-border inline-flex cursor-default items-center truncate rounded-md border px-2 py-1 text-sm font-medium",
                        getHighlightColorClass(item.highlight.color)
                      )}
                    >
                      {item.highlight.text}
                    </div>
                  )}
                </div>
                <p className="mt-4 text-sm leading-relaxed tracking-wide">{item.description}</p>

                {item.img && (
                  <div className="hidden xl:block">
                    <img
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        setSelectedImage(item);
                        setShowImage(true);
                      }}
                      src={item.img}
                      alt={item.name}
                      className={clsx("mt-4 w-full rounded-lg object-cover", items.length === 1 ? "h-full" : "h-44")}
                    />
                  </div>
                )}

                {item.subFeatures && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {item.subFeatures.map((subFeature) => (
                      <div
                        key={`${item.name}-${subFeature.name}`}
                        className={clsx("text-muted-foreground bg-muted/30 border-border flex space-x-1 rounded-md border px-2 py-1 text-xs font-medium")}
                      >
                        <CheckIcon className="text-muted-foreground/50 h-4 w-4" />
                        <div>{subFeature.name}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </article>
        </LinkOrAhref>
      ))}

      <Modal open={showImage} setOpen={() => setShowImage(false)}>
        <div>
          <div className="flex justify-between space-x-2">
            <h1 className="text-2xl font-bold">{selectedImage?.name}</h1>
            <div className="flex items-center space-x-4">
              {selectedImage?.link && (
                <div>
                  <Link to={selectedImage.link.href} target={selectedImage.link.target}>
                    <div className="text-muted-foreground hover:text-foreground focus:ring-ring hover:bg-secondary rounded-md p-2 focus:outline-hidden focus:ring-2 focus:ring-offset-2">
                      <ExternalLinkEmptyIcon className="h-6 w-6" />
                    </div>
                  </Link>
                </div>
              )}
              <button
                type="button"
                className="text-muted-foreground hover:text-foreground focus:ring-ring hover:bg-secondary rounded-md p-2 focus:outline-hidden focus:ring-2 focus:ring-offset-2"
                onClick={() => setShowImage(false)}
              >
                <span className="sr-only">Close panel</span>
                <XIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
          </div>
          <p className="text-muted-foreground mt-2">{selectedImage?.description}</p>
        </div>
        {selectedImage && <img src={selectedImage.img} alt={selectedImage.name} className="mt-4 h-full w-full rounded-lg object-cover" />}
      </Modal>
    </div>
  );
};

function Name({ item }: { item: FeatureDto }) {
  return item.name;
}
