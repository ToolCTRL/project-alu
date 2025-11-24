import { ValuesBlockDto, defaultValuesBlock } from "./ValuesBlockUtils";

export default function ValuesBlockForm({
  item = defaultValuesBlock,
  onUpdate,
}: {
  item?: ValuesBlockDto;
  onUpdate: (item: ValuesBlockDto) => void;
}) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600">
        Values Block configuration - Edit JSON for detailed customization
      </p>
    </div>
  );
}
