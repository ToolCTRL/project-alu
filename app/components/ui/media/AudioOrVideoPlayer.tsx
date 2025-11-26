import { forwardRef, useRef, useImperativeHandle, Ref } from "react";

export interface RefAudioOrVideo {
  media: HTMLAudioElement | HTMLVideoElement | null;
}

const AudioOrVideoPlayer = ({ url, type }: { url: string; type: "audio" | "video" }, ref: Ref<RefAudioOrVideo>) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useImperativeHandle(ref, () => ({
    get media() {
      return type === "video" ? videoRef.current : audioRef.current;
    },
  }));

  const renderMedia = () => {
    if (type === "video") {
      return <video ref={videoRef} src={url} controls className="border-border bg-secondary/90 w-full rounded-md border shadow-2xs"><track kind="captions" /></video>;
    }
    if (type === "audio") {
      return <audio ref={audioRef} src={url} controls className="border-border bg-secondary/90 w-full rounded-md border shadow-2xs"><track kind="captions" /></audio>;
    }
    return null;
  };

  return (
    <div className="w-full">
      {renderMedia()}
    </div>
  );
};

export default forwardRef(AudioOrVideoPlayer);
