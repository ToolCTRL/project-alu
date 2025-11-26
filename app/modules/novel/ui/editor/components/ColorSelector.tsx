import { Editor } from "@tiptap/core";
import clsx from "clsx";
import { Check, ChevronDown } from "lucide-react";

export interface BubbleColorMenuItem {
  name: string;
  color: string;
}

interface ColorSelectorProps {
  editor: Editor;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export interface BubbleColorMenuItemWithId extends BubbleColorMenuItem {
  id: string;
}

export default function ColorSelector({ editor, isOpen, setIsOpen }: Readonly<ColorSelectorProps>) {
  const items: BubbleColorMenuItemWithId[] = [
    {
      id: "default",
      name: "Default",
      color: "#000000",
    },
    {
      id: "purple",
      name: "Purple",
      color: "#9333EA",
    },
    {
      id: "red",
      name: "Red",
      color: "#E00000",
    },
    {
      id: "blue",
      name: "Blue",
      color: "#2563EB",
    },
    {
      id: "green",
      name: "Green",
      color: "#008A00",
    },
    {
      id: "orange",
      name: "Orange",
      color: "#FFA500",
    },
    {
      id: "pink",
      name: "Pink",
      color: "#BA4081",
    },
    {
      id: "gray",
      name: "Gray",
      color: "#A8A29E",
    },
  ];

  const activeItem = items.find(({ color }) => editor.isActive("textStyle", { color }));

  return (
    <div className="relative h-full">
      <button
        type="button"
        className="text-muted-foreground hover:bg-secondary flex h-full items-center gap-1 p-2 text-sm font-medium"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span style={{ color: activeItem?.color || "#000000" }}>Color</span>

        <ChevronDown className="h-4 w-4 " />
      </button>

      {isOpen && (
        <section className="animate-in fade-in slide-in-from-top-1 bg-background fixed top-full z-99999 mt-1 flex w-48 flex-col overflow-hidden rounded border border-stone-200 p-1 shadow-xl">
          {items.map(({ id, name, color }) => (
            <button
              type="button"
              key={id}
              onClick={() => {
                editor.chain().focus().setColor(color).run();
                setIsOpen(false);
              }}
              className={clsx("flex items-center justify-between rounded-sm px-2 py-1 text-sm text-stone-600 hover:bg-stone-100", {
                "text-blue-600": editor.isActive("textStyle", { color }),
              })}
            >
              <div className="flex items-center space-x-2">
                <div className="rounded-sm border border-stone-200 px-1 py-px font-medium" style={{ color }}>
                  A
                </div>
                <span>{name}</span>
              </div>
              {editor.isActive("textStyle", { color }) && <Check className="h-4 w-4" />}
            </button>
          ))}
        </section>
      )}
    </div>
  );
}
