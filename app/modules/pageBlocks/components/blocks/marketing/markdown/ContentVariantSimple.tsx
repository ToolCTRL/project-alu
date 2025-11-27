import { ContentBlockDto } from "./ContentBlockUtils";
import { marked } from "marked";

export default function ContentVariantSimple({ item }: { readonly item: ContentBlockDto }) {
  return (
    <div className="prose dark:prose-dark">
      {item.content ? <div dangerouslySetInnerHTML={{ __html: marked(item.content) }} /> : <div className="text-muted-foreground">No content</div>}
    </div>
  );
}
