import { EditorView } from "@tiptap/pm/view";
import { toast } from "sonner";

export const handleImageUpload = (file: File, view: EditorView, event: ClipboardEvent | DragEvent | Event) => {
  // check if the file is an image
  if (!file.type.includes("image/")) {
    toast.error("File type not supported.");

    // check if the file size is less than 50MB
  } else if (file.size / 1024 / 1024 > 50) {
    toast.error("File size too big (max 50MB).");
  } else {
    // upload to Vercel Blob
    toast.promise(
      fetch("/api/ai/upload", {
        method: "POST",
        headers: {
          "content-type": file?.type || "application/octet-stream",
          "x-filename": file?.name || "image.png",
        },
        body: file,
      }).then(async (res) => {
        // Successfully uploaded image
        if (res.status === 200) {
          const { url } = await res.json();
          // preload the image
          let image = new Image();
          image.src = url;
          image.onload = () => {
            insertImage(url);
          };

          // No blob store configured
        } else if (res.status === 401) {
          const reader = new FileReader();
          reader.onload = (e) => {
            insertImage(e.target?.result as string);
          };
          reader.readAsDataURL(file);
          throw new Error("Supabase environment variables not set, reading image locally instead.");

          // Unknown error
        } else {
          throw new Error(`Error uploading image. Please try again.`);
        }
      }),
      {
        loading: "Uploading image...",
        success: "Image uploaded successfully.",
        error: (e) => e.message,
      }
    );
  }

  const insertImage = (url: string) => {
    const imageNode = view.state.schema.nodes.image.create({
      src: url,
      alt: file.name,
      title: file.name,
    });

    // for paste events
    if (event instanceof ClipboardEvent) {
      return view.dispatch(view.state.tr.replaceSelectionWith(imageNode));

      // for drag and drop events
    } else if (event instanceof DragEvent) {
      const coordinates = view.posAtCoords({
        left: event.clientX,
        top: event.clientY,
      });
      const transaction = view.state.tr.insert(coordinates?.pos || 0, imageNode);
      return view.dispatch(transaction);

      // for input upload events
    } else if (event instanceof Event) {
      return view.dispatch(view.state.tr.replaceSelectionWith(imageNode));
    }
  };
};
