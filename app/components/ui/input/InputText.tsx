import clsx from "clsx";
import { forwardRef, lazy, ReactNode, Ref, RefObject, Suspense, useEffect, useImperativeHandle, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import EntityIcon from "~/components/layouts/icons/EntityIcon";
import HintTooltip from "~/components/ui/tooltips/HintTooltip";
import { PromptFlowWithDetails } from "~/modules/promptBuilder/db/promptFlows.db.server";
import { Input } from "../input";
import { Textarea } from "../textarea";
import { i18n as I18nInstance, TFunction } from "i18next";

const Editor = lazy(() => import("@monaco-editor/react").then((module) => ({ default: module.Editor })));
const NovelEditor = lazy(() => import("~/modules/novel/ui/editor"));

function getTranslation(i18n: I18nInstance, t: TFunction, value: string): string | null {
  if (!i18n.exists(value)) {
    return null;
  }
  return t(value);
}

function handleValueChange(
  value: string,
  setActualValue: React.Dispatch<React.SetStateAction<string>>,
  setValue?: React.Dispatch<React.SetStateAction<string>>
): void {
  setActualValue(value);
  if (setValue) {
    setValue(value);
  }
}

export interface RefInputText {
  input: RefObject<HTMLInputElement | null> | RefObject<HTMLTextAreaElement | null>;
  textArea: RefObject<HTMLTextAreaElement | null>;
}

type EditorSize = "sm" | "md" | "lg" | "auto" | "full" | "screen";

type WithDefaultValue = { defaultValue: string | undefined };
type WithValueAndSetValue = { value: string | undefined; setValue: React.Dispatch<React.SetStateAction<string>> };

export type InputTextProps = (WithDefaultValue | WithValueAndSetValue) & {
  id?: string;
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
  withTranslation?: boolean;
  translationParams?: string[];
  placeholder?: string;
  pattern?: string;
  rows?: number;
  button?: ReactNode;
  type?: string;
  darkMode?: boolean;
  hint?: ReactNode;
  help?: string;
  icon?: string;
  editor?: string;
  editorLanguage?: string;
  editorHideLineNumbers?: boolean;
  editorTheme?: "vs-dark" | "light";
  editorFontSize?: number;
  editorOptions?: any;
  onBlur?: () => void;
  onFocus?: () => void;
  borderless?: boolean;
  editorSize?: EditorSize;
  autoFocus?: boolean;
  promptFlows?: { rowId: string; prompts: PromptFlowWithDetails[] };
  hideChars?: boolean;
  onPaste?: (e: React.ClipboardEvent<HTMLInputElement>) => void;
};
const InputText = (props: InputTextProps, ref: Ref<RefInputText>) => {
  const {
    id,
    name,
    title,
    withLabel = true,
    className,
    classNameBg,
    help,
    disabled = false,
    readOnly = false,
    required = false,
    minLength,
    maxLength,
    autoComplete,
    withTranslation = false,
    translationParams = [],
    placeholder,
    pattern,
    hint,
    rows,
    button,
    type = "text",
    darkMode,
    icon,
    editor,
    editorLanguage,
    editorHideLineNumbers,
    editorTheme = "vs-dark",
    editorFontSize,
    editorOptions,
    onBlur,
    onFocus,
    borderless,
    editorSize = "sm",
    autoFocus,
    // isError,
    // isSuccess,
    promptFlows,
    hideChars,
    onPaste,
  } = props;

  const { t, i18n } = useTranslation();

  const value = "value" in props ? props.value : undefined;
  const setValue = "setValue" in props ? props.setValue : undefined;
  const defaultValue = "defaultValue" in props ? props.defaultValue : undefined;

  const [actualEditorSize] = useState<EditorSize>(editorSize ?? ("sm" as EditorSize));

  useImperativeHandle(ref, () => ({ input, textArea }));
  const input = useRef<HTMLInputElement>(null);
  const textArea = useRef<HTMLTextAreaElement>(null);

  const [actualValue, setActualValue] = useState<string>(value ?? defaultValue ?? "");

  useEffect(() => {
    setActualValue(value || defaultValue || "");
  }, [value, defaultValue]);

  useEffect(() => {
    if (setValue && actualValue !== value) {
      setValue(actualValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actualValue]);


  function getEditorSizeClasses() {
    const sizeMap: Record<string, string> = {
      sm: "h-32",
      md: "h-64",
      lg: "h-96",
      auto: "h-auto",
      full: "h-full",
      screen: "h-screen"
    };
    return sizeMap[actualEditorSize] || "";
  }

  function getWysiwygSizeClasses() {
    const sizeMap: Record<string, string> = {
      sm: "min-h-[100px]",
      md: "min-h-[300px]",
      lg: "min-h-[500px]",
      auto: "h-auto",
      full: "h-full",
      screen: "h-screen"
    };
    return clsx(sizeMap[actualEditorSize], borderless && "border-transparent");
  }

  function renderMonacoEditor() {
    return (
      <>
        <textarea hidden readOnly name={name} value={actualValue} />
        {globalThis.window !== undefined && (
          <Suspense
            fallback={
              <div className={clsx(
                "border-border bg-secondary flex items-center justify-center rounded-md border",
                getEditorSizeClasses()
              )}>
                <div className="text-muted-foreground text-sm">Loading editor...</div>
              </div>
            }
          >
            <Editor
              theme={editorTheme}
              className={clsx(
                "focus:border-border focus:ring-ring border-border block w-full min-w-0 flex-1 rounded-md sm:text-sm",
                getEditorSizeClasses(),
                className,
                classNameBg,
                editorHideLineNumbers && "-ml-10",
                borderless && "border-transparent"
              )}
              defaultLanguage={editorLanguage}
              language={editorLanguage}
              options={{
                fontSize: editorFontSize,
                renderValidationDecorations: "off",
                wordWrap: "on",
                readOnly: disabled || readOnly,
                ...editorOptions,
              }}
              value={value}
              defaultValue={defaultValue}
              onChange={(e) => handleValueChange(e ?? "", setActualValue, setValue)}
            />
          </Suspense>
        )}
      </>
    );
  }

  function renderWysiwygEditor() {
    return (
      <>
        <textarea hidden readOnly name={name} value={actualValue} />
        <Suspense
          fallback={
            <div className={clsx(
              "border-border bg-secondary flex items-center justify-center rounded-md border",
              getWysiwygSizeClasses()
            )}>
              <div className="text-muted-foreground text-sm">Loading editor...</div>
            </div>
          }
        >
          <NovelEditor
            autoFocus={autoFocus}
            key={promptFlows?.rowId ?? name ?? "novel-editor"}
            readOnly={readOnly || disabled}
            disabled={disabled}
            darkMode={darkMode}
            className={getWysiwygSizeClasses()}
            content={value || defaultValue}
            onChange={(e) => handleValueChange(e?.html ?? "", setActualValue, setValue)}
            promptFlows={promptFlows}
          />
        </Suspense>
      </>
    );
  }

  function renderInputField() {
    return (
      <>
        {icon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <EntityIcon className="text-muted-foreground h-5 w-5" icon={icon} />
          </div>
        )}
        <Input
          ref={input}
          type={type}
          style={hideChars ? ({ WebkitTextSecurity: "disc" } as any) : {}}
          id={id ?? name}
          name={name}
          autoComplete={autoComplete}
          required={required}
          minLength={minLength}
          maxLength={maxLength}
          defaultValue={defaultValue}
          value={value}
          onChange={(e) => handleValueChange(e.currentTarget.value, setActualValue, setValue)}
          onBlur={onBlur}
          onFocus={onFocus}
          disabled={disabled}
          readOnly={readOnly}
          placeholder={placeholder}
          pattern={pattern !== "" && pattern !== undefined ? pattern : undefined}
          autoFocus={autoFocus}
          className={clsx(className)}
          onPaste={onPaste}
        />
        {button}
      </>
    );
  }

  function renderTextarea() {
    return (
      <Textarea
        rows={rows}
        ref={textArea}
        style={hideChars ? ({ WebkitTextSecurity: "disc" } as any) : {}}
        id={id ?? name}
        name={name}
        autoComplete={autoComplete}
        required={required}
        minLength={minLength}
        maxLength={maxLength}
        defaultValue={defaultValue}
        value={value}
        onChange={(e) => handleValueChange(e.currentTarget.value, setActualValue, setValue)}
        onBlur={onBlur}
        onFocus={onFocus}
        disabled={disabled}
        readOnly={readOnly}
        placeholder={placeholder}
        autoFocus={autoFocus}
      />
    );
  }

  function renderEditor() {
    if (editor === "monaco" && editorLanguage) {
      return renderMonacoEditor();
    }

    if (editor === "wysiwyg") {
      return renderWysiwygEditor();
    }

    if (!rows) {
      return renderInputField();
    }

    return renderTextarea();
  }

  return (
    <div className={clsx(className, !darkMode && "")}>
      {withLabel && title && (
        <label htmlFor={name} className="mb-1 flex justify-between space-x-2 truncate text-xs font-medium">
          <div className="flex shrink-0 items-center space-x-1 truncate">
            <div className="flex space-x-1 truncate">
              <div className="truncate">{title}</div>
              {required && title && <div className="ml-1 text-red-500">*</div>}
            </div>
            <div className="">{help && <HintTooltip text={help} />}</div>
          </div>
          {withTranslation && value?.includes(".") && (
            <div className="text-muted-foreground truncate font-light italic" title={t(value, { 0: translationParams })}>
              {t("admin.pricing.i18n")}:{" "}
              {getTranslation(i18n, t, value) ? (
                <span className="text-muted-foreground">{t(value, { 0: translationParams })}</span>
              ) : (
                <span className="text-red-600">{t("shared.invalid")}</span>
              )}
            </div>
          )}
          {hint}
        </label>
      )}
      <div className={clsx("relative flex w-full rounded-md")}>
        {renderEditor()}
      </div>
    </div>
  );
};

export default forwardRef(InputText);
