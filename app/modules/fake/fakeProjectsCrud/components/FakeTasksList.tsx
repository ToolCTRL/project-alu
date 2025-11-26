import { useNavigation } from "react-router";
import ButtonSecondary from "~/components/ui/buttons/ButtonSecondary";
import CheckIcon from "~/components/ui/icons/CheckIcon";
import { FakeTaskDto } from "../dtos/FakeTaskDto";

interface FakeTasksListProps {
  readonly items?: FakeTaskDto[];
  readonly onComplete: (item: FakeTaskDto) => void;
}

export default function FakeTasksList({ items, onComplete }: FakeTasksListProps) {
  const navigation = useNavigation();
  return (
    <div className="flex flex-col space-y-1">
      {items?.map((item) => (
        <div key={item.id || item.name} className="border-border bg-secondary/90 rounded-md border p-2">
          <div className="flex items-center justify-between space-x-2">
            <div className="flex flex-col">
              <div>{item.name}</div>
            </div>
            {item.completed ? (
              <CheckIcon className="h-5 w-5 text-teal-500" />
            ) : (
              <ButtonSecondary type="button" onClick={() => onComplete(item)} disabled={navigation.state !== "idle"}>
                Complete
              </ButtonSecondary>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
