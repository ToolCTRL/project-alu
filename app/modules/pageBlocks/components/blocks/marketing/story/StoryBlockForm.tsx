import { StoryBlockDto, defaultStoryBlock } from "./StoryBlockUtils";

export default function StoryBlockForm({
  item = defaultStoryBlock,
  onUpdate,
}: {
  readonly item?: StoryBlockDto;
  readonly onUpdate: (item: StoryBlockDto) => void;
}) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600">
        Story Block configuration - Edit JSON for detailed customization
      </p>
    </div>
  );
}
