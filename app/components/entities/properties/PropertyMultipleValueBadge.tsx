import { RowValueMultipleDto } from "~/application/dtos/entities/RowValueMultipleDto";

type OptionDto = { value: string; name: string | null };

interface Props {
  readonly values: RowValueMultipleDto[] | null;
  readonly options?: OptionDto[];
}
export default function PropertyMultipleValueBadge({ values, options }: Props) {
  function getSelectedNames() {
    let names: string[] = [];
    if (values) {
      for (const value of values) {
        const option = options?.find((f) => f.value === value.value);
        names.push(option?.name ?? value.value);
      }
    }
    return names;
  }
  return (
    <div className="flex space-x-1">
      {getSelectedNames().join(", ") ?? <span className="text-gray-300"></span>}
    </div>
  );
}
