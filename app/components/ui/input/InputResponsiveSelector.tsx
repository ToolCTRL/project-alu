import { ReactNode } from "react";
import { Colors } from "~/application/enums/shared/Colors";
import InputRadioGroup from "./InputRadioGroup";
import InputSelector from "./InputSelector";

type OptionValue = string | number | undefined;

interface Props {
  readonly name?: string;
  readonly title?: string;
  readonly value?: OptionValue;
  readonly disabled?: boolean;
  readonly options: { name: string | ReactNode; value: OptionValue; color?: Colors; disabled?: boolean }[];
  readonly setValue?: React.Dispatch<React.SetStateAction<OptionValue>>;
  readonly className?: string;
  readonly withSearch?: boolean;
  readonly withLabel?: boolean;
  readonly withColors?: boolean;
  readonly selectPlaceholder?: string;
  readonly onNew?: () => void;
  readonly onNewRoute?: string;
  readonly required?: boolean;
  readonly help?: string;
  readonly hint?: ReactNode;
  readonly icon?: string;
  readonly borderless?: boolean;
}
export default function InputResponsiveSelector(props: Props) {
  return (
    <>
      <InputSelector className="sm:hidden" {...props} />
      <InputRadioGroup className="hidden sm:block" {...props} />
    </>
  );
}
