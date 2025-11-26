import { Link } from "react-router";
import type { KbArticleDto } from "../dtos/KbArticleDto";
import ColorTextUtils from "~/utils/shared/colors/ColorTextUtils";
import type { Colors } from "~/application/enums/shared/Colors";
import clsx from "clsx";
import type { KnowledgeBaseDto } from "../dtos/KnowledgeBaseDto";
import EmptyState from "~/components/ui/emptyState/EmptyState";
import { useTranslation } from "react-i18next";

export default function KbFeaturedArticles({ kb, items }: readonly { readonly kb: KnowledgeBaseDto; readonly items: KbArticleDto[] }) {
  const { t } = useTranslation();
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <FeaturedArticlesIcon color={kb.color} />
        <h2 className="text-2xl font-bold">{t("knowledgeBase.featuredArticles")}</h2>
      </div>
      {items.length === 0 && <EmptyState className="bg-background" captions={{ thereAreNo: "No featured articles" }} />}
      <div className={clsx("grid gap-2", items.length === 1 ? "grid-cols-1" : "sm:grid-cols-2")}>
        {items.map((item) => {
          return (
            <Link
              to={item.href}
              key={item.id}
              className="rounded-md border border-border bg-background px-3 py-4 shadow-2xs hover:bg-secondary hover:border-secondary-foreground"
            >
              <div className="flex items-center justify-between space-x-2">
                <div className="grow font-medium">{item.title}</div>
                <div className="shrink-0">
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function FeaturedArticlesIcon({ color }: readonly { readonly color: Colors }) {
  return (
    <svg
      className={clsx("h-5 w-5", ColorTextUtils.getText500(color))}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 14 14"
      height="48"
      width="48"
    >
      <g id="star-1--reward-rating-rate-social-star-media-favorite-like-stars">
        <path
          id="Union"
          fill="currentColor"
          fillRule="evenodd"
          d="M7 .277a1.04 1.04 0 0 0-.94.596L4.472 4.078a.495.495 0 0 0-.012.023.486.486 0 0 0-.023.004L.94 4.623a1.04 1.04 0 0 0-.617 1.788l2.56 2.469.006.005a.03.03 0 0 1 .009.027v.004l-.61 3.568v.001a1.05 1.05 0 0 0 1.526 1.107l3.15-1.665a.09.09 0 0 1 .072 0l3.15 1.664a1.049 1.049 0 0 0 1.527-1.106l-.61-3.57v-.003c-.002-.004-.001-.01 0-.014a.03.03 0 0 1 .008-.013l.006-.005 2.559-2.47a1.04 1.04 0 0 0-.617-1.787l-3.496-.518a.486.486 0 0 0-.023-.004.495.495 0 0 0-.012-.023L7.94.873A1.04 1.04 0 0 0 7 .277Z"
          clipRule="evenodd"
        ></path>
      </g>
    </svg>
  );
}
