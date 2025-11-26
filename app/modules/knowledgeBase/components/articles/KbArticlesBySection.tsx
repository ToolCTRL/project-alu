import EmptyState from "~/components/ui/emptyState/EmptyState";
import type { KbCategoryDto } from "../../dtos/KbCategoryDto";
import type { KnowledgeBaseDto } from "../../dtos/KnowledgeBaseDto";
import KbArticles from "./KbArticles";
import KnowledgeBaseUtils from "../../utils/KnowledgeBaseUtils";

export default function KbArticlesBySection({ kb, item }: Readonly<{ kb: KnowledgeBaseDto; item: KbCategoryDto }>) {
  return (
    <div>
      {item.articles.length === 0 ? (
        <EmptyState className="bg-background" captions={{ thereAreNo: "No articles" }} />
      ) : (
        <div className="space-y-6">
          {KnowledgeBaseUtils.getCategoryArticlesBySections({ kb, category: item }).map((sectionItem, idx) => {
            return (
              <div key={sectionItem.section?.id || `section-${idx}`} className="space-y-3">
                {sectionItem.section && (
                  <div className="flex items-center space-x-2">
                    <div className="text-xl font-bold">{sectionItem.section.title}</div>
                  </div>
                )}
                <KbArticles kb={kb} items={sectionItem.articles} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
