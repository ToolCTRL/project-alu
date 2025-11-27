import InputText from "../InputText";
import InputEmail from "./InputEmail";
import InputPhone from "./InputPhone";
import InputUrl from "./InputUrl";
import { PromptFlowWithDetails } from "~/modules/promptBuilder/db/promptFlows.db.server";

type InputTextSubtypeProps = {
  subtype: "singleLine" | "email" | "phone" | "url" | null;
  name?: string;
  title?: string;
  withLabel?: boolean;
  className?: string;
  classNameBg?: string;
  minLength?: number;
  maxLength?: number;
  readOnly?: boolean;
  disabled?: boolean;
  required?: boolean;
  autoComplete?: string;
  translationParams?: string[];
  placeholder?: string;
  pattern?: string;
  rows?: number;
  button?: React.ReactNode;
  lowercase?: boolean;
  uppercase?: boolean;
  password?: boolean;
  type?: string;
  darkMode?: boolean;
  hint?: React.ReactNode;
  help?: string;
  icon?: string;
  editor?: string;
  editorLanguage?: string;
  editorHideLineNumbers?: boolean;
  editorTheme?: "vs-dark" | "light";
  editorFontSize?: number;
  onBlur?: () => void;
  borderless?: boolean;
  editorSize?: "sm" | "md" | "lg" | "auto" | "full" | "screen";
  autoFocus?: boolean;
  promptFlows?: { rowId?: string; prompts: PromptFlowWithDetails[] };
};

type WithDefaultValue = { defaultValue?: string };
type WithValueAndSetValue = { value?: string; setValue: React.Dispatch<React.SetStateAction<string>> };

export default function InputTextSubtype(props: InputTextSubtypeProps & (WithDefaultValue | WithValueAndSetValue)) {
  function renderSubtype() {
    if (!props.subtype || props.subtype === "singleLine") {
      return <InputText {...props} type={props.password ? "password" : undefined} autoComplete={props.password ? "off" : undefined} />;
    }
    if (props.subtype === "email") {
      return <InputEmail {...props} />;
    }
    if (props.subtype === "url") {
      return <InputUrl {...props} />;
    }
    if (props.subtype === "phone") {
      return <InputPhone {...props} />;
    }
    return null;
  }

  return <>{renderSubtype()}</>;
}
