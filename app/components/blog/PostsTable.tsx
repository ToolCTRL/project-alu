import { useTranslation } from "react-i18next";
import DateUtils from "~/utils/shared/DateUtils";
import { useState, useMemo } from "react";
import { BlogPostWithDetails } from "~/modules/blog/db/blog.db.server";
import ButtonTertiary from "../ui/buttons/ButtonTertiary";
import InputSearch from "../ui/input/InputSearch";
import TableSimple from "../ui/tables/TableSimple";
import DateCell from "../ui/dates/DateCell";
import UrlUtils from "~/utils/app/UrlUtils";
import { useParams } from "react-router";

interface Props {
  blogPath: string;
  items: BlogPostWithDetails[];
}

function TitleCell({ item, blogPath, t }: { item: BlogPostWithDetails; blogPath: string; t: any }) {
  return (
    <div className="flex flex-col">
      <div>
        {item.title}{" "}
        <span>
          {!item.published && (
            <span className="text-xs text-red-500">({t("blog.draft")})</span>
          )}
        </span>
      </div>
      <a href={blogPath + "/" + item.slug} target="_blank" rel="noreferrer" className="text-muted-foreground underline">
        {item.slug}
      </a>
    </div>
  );
}

function CreatedAtCellPost({ item }: { item: BlogPostWithDetails }) {
  return (
    <div>
      <DateCell date={item.createdAt} displays={["ymd"]} />
    </div>
  );
}

function AuthorCell({ item }: { item: BlogPostWithDetails }) {
  return (
    <div className="flex flex-col">
      {item.author ? (
        <div>
          {item.author.firstName} {item.author.lastName}
        </div>
      ) : (
        <div className="text-muted-foreground text-xs italic hover:underline">No author</div>
      )}
    </div>
  );
}

function ActionsCell({ item, params, t }: { item: BlogPostWithDetails; params: any; t: any }) {
  return (
    <div className="flex items-center space-x-2">
      <ButtonTertiary to={UrlUtils.getModulePath(params, "blog/" + item.id)}>{t("shared.edit")}</ButtonTertiary>
    </div>
  );
}

export default function PostsTable({ blogPath, items }: Props) {
  const { t } = useTranslation();
  const params = useParams();

  const [searchInput, setSearchInput] = useState("");

  const filteredItems = () => {
    if (!items) {
      return [];
    }
    return items.filter(
      (f) =>
        DateUtils.dateYMDHMS(f.createdAt)?.toString().toUpperCase().includes(searchInput.toUpperCase()) ||
        f.slug?.toString().toUpperCase().includes(searchInput.toUpperCase()) ||
        f.title?.toString().toUpperCase().includes(searchInput.toUpperCase()) ||
        f.description?.toString().toUpperCase().includes(searchInput.toUpperCase()) ||
        DateUtils.dateYMDHMS(f.date).includes(searchInput.toUpperCase()) ||
        f.description?.toString().toUpperCase().includes(searchInput.toUpperCase()) ||
        f.content?.toString().toUpperCase().includes(searchInput.toUpperCase()) ||
        f.readingTime?.toString().toUpperCase().includes(searchInput.toUpperCase()) ||
        (f.author?.firstName + " " + f.author?.lastName)?.toString().toUpperCase().includes(searchInput.toUpperCase()) ||
        f.category?.name?.toString().toUpperCase().includes(searchInput.toUpperCase()) ||
        f.tags
          .map((f) => f.tag)
          ?.toString()
          .toUpperCase()
          .includes(searchInput.toUpperCase())
    );
  };

  const renderTitleCell = (item: BlogPostWithDetails) => <TitleCell item={item} blogPath={blogPath} t={t} />;
  const renderActionsCell = (item: BlogPostWithDetails) => <ActionsCell item={item} params={params} t={t} />;

  const headers = useMemo(
    () => [
      {
        name: "title",
        title: t("models.post.object"),
        className: "w-full",
        value: renderTitleCell,
      },
      {
        name: "createdAt",
        title: t("shared.createdAt"),
        value: CreatedAtCellPost,
      },
      {
        name: "author",
        title: t("models.post.author"),
        value: AuthorCell,
      },
      {
        name: "actions",
        title: t("shared.actions"),
        value: renderActionsCell,
      },
    ],
    [renderTitleCell, renderActionsCell]
  );

  return (
    <div className="space-y-2">
      <InputSearch value={searchInput} setValue={setSearchInput} />
      <TableSimple items={filteredItems()} headers={headers} />
    </div>
  );
}
