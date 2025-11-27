import TableSimple from "~/components/ui/tables/TableSimple";
import { KnowledgeBasesTemplateDto } from "../../dtos/KnowledgeBasesTemplateDto";

interface TitleCellProps {
  readonly title: string;
  readonly description: string;
}

function TitleCell({ title, description }: TitleCellProps) {
  return (
    <div className="flex-col">
      <div>{title}</div>
      <div className="text-muted-foreground text-xs">{description}</div>
    </div>
  );
}

interface KbTableProps {
  readonly title: string;
  readonly description: string;
}

function KbTitleCell({ title, description }: KbTableProps) {
  return <TitleCell title={title} description={description} />;
}

interface CategoryTableProps {
  readonly title: string;
  readonly description: string;
}

function CategoryTitleCell({ title, description }: CategoryTableProps) {
  return <TitleCell title={title} description={description} />;
}

interface ArticleTableProps {
  readonly title: string;
  readonly description: string;
}

function ArticleTitleCell({ title, description }: ArticleTableProps) {
  return <TitleCell title={title} description={description} />;
}

const knowledgeBaseHeaders = [
  { name: "slug", title: "Slug", value: (i: KnowledgeBasesTemplateDto["knowledgeBases"][number]) => i.slug },
  { name: "title", title: "Title", value: (i: KnowledgeBasesTemplateDto["knowledgeBases"][number]) => <KbTitleCell title={i.title} description={i.description} /> },
  { name: "enabled", title: "Enabled", value: (i: KnowledgeBasesTemplateDto["knowledgeBases"][number]) => i.enabled },
];

const categoriesHeaders = [
  { name: "slug", title: "Slug", value: (i: KnowledgeBasesTemplateDto["categories"][number]) => i.slug },
  { name: "title", title: "Title", value: (i: KnowledgeBasesTemplateDto["categories"][number]) => <CategoryTitleCell title={i.title} description={i.description} /> },
  { name: "sections", title: "Sections", value: (i: KnowledgeBasesTemplateDto["categories"][number]) => i.sections.map((s) => s.title).join(", ") },
  { name: "knowledgeBase", title: "Knowledge Base", value: (i: KnowledgeBasesTemplateDto["categories"][number]) => i.knowledgeBaseSlug },
];

const articlesHeaders = [
  { name: "slug", title: "Slug", value: (i: KnowledgeBasesTemplateDto["articles"][number]) => i.slug },
  { name: "title", title: "Title", value: (i: KnowledgeBasesTemplateDto["articles"][number]) => <ArticleTitleCell title={i.title} description={i.description} /> },
  { name: "knowledgeBase", title: "Knowledge Base", value: (i: KnowledgeBasesTemplateDto["articles"][number]) => i.knowledgeBaseSlug },
];

export default function PreviewKbsTemplate({ template }: { readonly template: KnowledgeBasesTemplateDto }) {
  return (
    <div className="space-y-2">
      <h3 className="font-medium">Knowledge Bases</h3>
      <TableSimple
        items={template.knowledgeBases}
        headers={knowledgeBaseHeaders}
      />

      <h3 className="font-medium">Categories</h3>
      <TableSimple
        items={template.categories}
        headers={categoriesHeaders}
      />

      <h3 className="font-medium">Articles</h3>
      <TableSimple
        items={template.articles}
        headers={articlesHeaders}
      />
    </div>
  );
}
