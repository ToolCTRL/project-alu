import { useSearchParams } from "react-router";

export function FilterableValueLink({ name, value, param, children }: Readonly<{ name: string; value?: string; param?: string; children?: React.ReactNode }>) {
  const [searchParams, setSearchParams] = useSearchParams();
  function isFiltered() {
    if (param) {
      return searchParams.get(name) === param;
    }
    return searchParams.get(name) === value;
  }

  const filtered = isFiltered();

  return (
    <div>
      {filtered ? (
        <button
          type="button"
          onClick={() => {
            searchParams.delete(name);
            searchParams.delete("page");
            setSearchParams(searchParams);
          }}
          className="hover:text-muted-foreground underline hover:line-through"
        >
          {children ?? value}
        </button>
      ) : (
        <button
          type="button"
          onClick={() => {
            searchParams.set(name, param ?? value ?? "");
            searchParams.delete("page");
            setSearchParams(searchParams);
          }}
          className="hover:text-blue-700 hover:underline"
        >
          {children ?? value}
        </button>
      )}
    </div>
  );
}
