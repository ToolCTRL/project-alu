import clsx from "clsx";

interface Props {
  readonly items: ReadonlyArray<{
    readonly name: string;
    readonly stat: string;
    readonly hint?: string;
  }>;
}
export default function SimpleStats({ items }: Readonly<Props>) {
  return (
    <div>
      <dl
        className={clsx(
          "grid grid-cols-1 gap-3",
          items.length === 1 && "md:grid-cols-1",
          items.length === 2 && "grid-cols-2",
          items.length === 3 && "md:grid-cols-3"
        )}
      >
        {items.map((item) => (
          <div key={item.name} className="bg-background overflow-hidden rounded-lg px-4 py-3 shadow-xs">
            <dt className="text-muted-foreground truncate text-xs font-medium">{item.name}</dt>
            <dd className="text-foreground mt-1 truncate text-lg font-semibold">
              {item.stat} {item.hint && <span className="text-muted-foreground text-xs">{item.hint}</span>}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
