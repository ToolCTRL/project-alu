import clsx from "clsx";
import { MediaDto } from "~/application/dtos/entities/MediaDto";
import DownloadIcon from "~/components/ui/icons/DownloadIcon";

function getFileName(name: string): string {
  let fileName = name;
  if (name.includes("/")) {
    fileName = name.split("/").pop() ?? name;
  }
  if (name.includes("\\")) {
    fileName = name.split("\\").pop() ?? name;
  }
  return fileName;
}

export default function RowMediaCell({ media, layout = "table" }: Readonly<{ media: MediaDto[] | undefined; layout?: string }>) {
  const onDownload = (mediaItem: MediaDto) => {
    const downloadLink = document.createElement("a");
    downloadLink.href = mediaItem.publicUrl ?? mediaItem.file;
    downloadLink.download = mediaItem.name;
    downloadLink.click();
  };

  return (
    <div className={clsx(layout === "table" ? "flex max-h-12 items-center space-x-2 overflow-x-visible truncate" : "grid max-h-60 gap-1  overflow-auto")}>
      {media
        ?.filter((f) => f.type.includes("image"))
        .map((item) => {
          return <img key={item.name} className={clsx("object-cover", layout === "table" ? "h-10" : "")} src={item.publicUrl ?? item.file} alt={item.name} />;
        })}

      {media
        ?.filter((f) => !f.type.includes("image"))
        .map((item) => {
          return (
            <button
              type="button"
              key={item.name}
              onClick={() => onDownload(item)}
              className={
                "hover:border-border text-muted-foreground hover:text-foreground flex items-center space-x-1 border-b border-transparent text-xs hover:border-dashed"
              }
            >
              <div className="font-normal">{getFileName(item.title)}</div>
              <DownloadIcon className="h-3 w-3" />
            </button>
          );
        })}
    </div>
  );
}
