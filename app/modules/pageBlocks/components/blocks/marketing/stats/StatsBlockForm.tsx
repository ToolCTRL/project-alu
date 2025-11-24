import { StatsBlockDto, defaultStatsBlock } from "./StatsBlockUtils";

export default function StatsBlockForm({
  item = defaultStatsBlock,
  onUpdate,
}: {
  item?: StatsBlockDto;
  onUpdate: (item: StatsBlockDto) => void;
}) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600">
        Stats Block configuration - Edit JSON for detailed customization
      </p>
    </div>
  );
}
