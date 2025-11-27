import { forwardRef, Ref, useEffect, useImperativeHandle, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";
import { cn } from "~/lib/utils";

export interface RefConfirmModal {
  setDestructive: (destructive: boolean) => void;
  setValue: (value: any) => void;
  show: (_question: string, _yesTitle?: string, _noTitle?: string, _description?: string, _inputString?: string) => void;
}

interface Props {
  destructive?: boolean;
  inputType?: string;
  onYes?: (value: any) => void;
  onNo?: () => void;
  placeholder?: string;
}

const ConfirmModal = (props: Props, ref: Ref<RefConfirmModal>) => {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState<string>();
  const [value, setValue] = useState<string>();
  const [description, setDescription] = useState<string>();
  const [inputString, setInputString] = useState<string | undefined>("");
  const [yesTitle, setYesTitle] = useState<string>("");
  const [noTitle, setNoTitle] = useState<string>("");
  const [isDestructive, setIsDestructive] = useState<boolean>(props.destructive || false);

  const inputValue = useRef<HTMLInputElement>(null);

  function setDestructive(destructive: boolean) {
    setIsDestructive(destructive);
  }

  useEffect(() => {
    setTitle(t("shared.confirm").toString());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function no() {
    setOpen(false);
    if (props.onNo) {
      props.onNo();
    }
  }

  function yes() {
    setOpen(false);
    if (props.onYes) {
      props.onYes(value ?? inputString);
    }
  }

  useImperativeHandle(ref, () => ({ show, setValue, setDestructive }));

  function show(
    _question: string,
    _yesTitle: string = t("shared.confirm").toString(),
    _noTitle: string = t("shared.back").toString(),
    _description?: string,
    _inputString?: string
  ) {
    setTitle(_question.toString());
    if (_yesTitle) {
      setYesTitle(_yesTitle);
    }
    if (_noTitle) {
      setNoTitle(_noTitle);
    }
    if (_description) {
      setDescription(_description);
    }
    setTimeout(() => {
      if ((props.inputType === "email" || props.inputType === "string" || props.inputType === "slug") && inputValue.current) {
        inputValue.current.focus();
        inputValue.current.select();
      }
    }, 0);
    setOpen(true);
    setInputString(_inputString);
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {description && <AlertDialogDescription>{description}</AlertDialogDescription>}
        </AlertDialogHeader>

        <div>
          {props.inputType === "email" && (
            <div className="mt-4">
              <label htmlFor="email" className="text-foreground/80 block text-sm font-medium">Email</label>
              <div className="relative mt-1 rounded-md shadow-2xs">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <svg className="text-muted-foreground h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </div>
                <input
                  value={inputString}
                  onChange={(e) => setInputString(e.target.value)}
                  ref={inputValue}
                  type="email"
                  name="email"
                  id="email"
                  className="border-border focus:border-border block w-full rounded-md pl-10 focus:ring-gray-500 sm:text-sm"
                  placeholder="your@email.com"
                />
              </div>
            </div>
          )}
          {props.inputType === "string" && (
            <div className="mt-4">
              <label htmlFor="value" className="text-foreground/80 block text-sm font-medium">Value</label>
              <div className="relative mt-1 rounded-md shadow-2xs">
                <input
                  value={inputString}
                  onChange={(e) => setInputString(e.target.value)}
                  ref={inputValue}
                  type="text"
                  name="value"
                  id="value"
                  className="border-border focus:border-border block w-full rounded-md focus:ring-gray-500 sm:text-sm"
                  placeholder={props.placeholder}
                />
              </div>
            </div>
          )}
          {props.inputType === "slug" && (
            <div className="mt-4">
              <label htmlFor="slug-value" className="text-foreground/80 block text-sm font-medium">Slug</label>
              <div className="relative mt-1 rounded-md shadow-2xs">
                <input
                  value={inputString}
                  onChange={(e) => setInputString(e.target.value.toLowerCase())}
                  ref={inputValue}
                  type="text"
                  name="slug-value"
                  id="slug-value"
                  className="border-border focus:border-border block w-full rounded-md focus:ring-gray-500 sm:text-sm"
                  placeholder={props.placeholder}
                />
              </div>
            </div>
          )}
        </div>

        <AlertDialogFooter className="mt-5 sm:mt-6">
          <AlertDialogCancel onClick={no} className={cn("sm:col-start-1")}>
            {noTitle}
          </AlertDialogCancel>
          <AlertDialogAction onClick={yes} className={cn(isDestructive ? "bg-destructive hover:bg-destructive/90" : undefined)}>
            {yesTitle}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default forwardRef(ConfirmModal);
