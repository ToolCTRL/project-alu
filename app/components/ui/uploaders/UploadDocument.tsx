import clsx from "clsx";
import { ReactNode, useEffect, useState } from "react";
import { FileBase64 } from "~/application/dtos/shared/FileBase64";
import { useTranslation } from "react-i18next";

interface Props {
  name?: string;
  title?: string;
  accept?: string;
  multiple?: boolean;
  description?: string;
  icon?: ReactNode;
  disabled?: boolean;
  className?: string;
  uploadText?: string;
  autoFocus?: boolean;
  onDropped?: (base64: string, file: File) => void;
  onDroppedFiles?: (fileBase64: FileBase64[], files: any[]) => void;
}

function getBase64(file: File): Promise<string> {
  const reader = new FileReader();
  return new Promise((resolve) => {
    reader.onload = (ev) => {
      const result = ev?.target?.result;
      if (typeof result === "string") {
        resolve(result);
      } else {
        resolve("");
      }
    };
    reader.readAsDataURL(file);
  });
}

export default function UploadDocuments({
  name = "uploadmyfile",
  className,
  title = "",
  accept,
  multiple,
  description,
  icon = "",
  disabled,
  onDropped,
  onDroppedFiles,
  uploadText,
  autoFocus,
}: Readonly<Props>) {
  const { t } = useTranslation();

  const [isDragging, setIsDragging] = useState(false);
  const [loading] = useState(false);
  const [customClasses, setCustomClasses] = useState("");

  function dragOver(e: any) {
    e.preventDefault();
    if (!loading) {
      setIsDragging(true);
    }
  }
  function dragLeave() {
    setIsDragging(false);
  }

  async function drop(e: any) {
    try {
      e.preventDefault();
    } catch {
      // ignore
    }
    const files: File[] = await Promise.all(
      [...e.dataTransfer.files].map(async (element: File) => {
        return element;
      })
    );
    const filesArray: FileBase64[] = [];

    await Promise.all(
      files.map(async (file) => {
        const base64 = await getBase64(file);
        filesArray.push({
          base64,
          file,
        });
        if (onDropped) {
          onDropped(base64, file);
        }
      })
    );
    if (onDroppedFiles) {
      onDroppedFiles(filesArray, files);
    }
    setIsDragging(false);
  }
  function requestUploadFile() {
    const src = document.querySelector("#" + name);
    drop({ dataTransfer: src });
  }

  useEffect(() => {
    setCustomClasses(isDragging && !loading && !disabled ? "border-2 border-border border-dashed" : "");
  }, [isDragging, loading, disabled]);

  return (
    <button
      type="button"
      className={clsx(
        "drop border-border hover:bg-background/90 flex items-center overflow-hidden rounded-md border-2 border-dashed text-center",
        customClasses,
        className
      )}
      onDragOver={dragOver}
      onDragLeave={dragLeave}
      onDrop={drop}
      onClick={() => document.getElementById(name)?.click()}
      disabled={disabled}
    >
      {(() => {
        if (loading) {
          return <div className="mx-auto text-base font-medium">{t("shared.loading")}...</div>;
        } else {
          return (
            <div>
              <div className="text-primary mx-auto text-sm font-bold">{title}</div>
              <div className="manual">
                <div className="space-y-1 text-center">
                  {icon}
                  <div className="text-muted-foreground flex flex-col text-sm">
                    <label
                      htmlFor={name}
                      className={clsx(
                        " text-foreground focus-within:ring-ring relative cursor-pointer rounded-md font-medium focus-within:outline-hidden focus-within:ring-2 focus-within:ring-offset-2"
                      )}
                    >
                      <p className={clsx("text-sm font-semibold underline", disabled ? "cursor-not-allowed" : "cursor-pointer")}>
                        {uploadText ?? <span>{t("app.shared.buttons.uploadDocument")}</span>}
                      </p>
                      <input
                        className="uploadmyfile"
                        disabled={disabled}
                        type="file"
                        id={name}
                        accept={accept}
                        multiple={multiple}
                        onChange={requestUploadFile}
                        autoFocus={autoFocus}
                        aria-label={title || t("app.shared.buttons.uploadDocument")}
                      />
                    </label>
                  </div>
                  <p className="text-muted-foreground text-xs">
                    {description ?? (
                      <span className="lowercase">
                        {t("shared.or")} {t("shared.dragAndDrop")}
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          );
        }
      })()}
    </button>
  );
}
