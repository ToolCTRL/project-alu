import { BlogPostsBlockDto } from "./BlogPostsBlockUtils";
import BlogPostsVariantSimple from "./BlogPostsVariantSimple";

export default function BlogPostsBlock({ item }: readonly { readonly item: BlogPostsBlockDto }) {
  return <>{item.style === "simple" && <BlogPostsVariantSimple item={item} />}</>;
}
