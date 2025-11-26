import { Form, useNavigate, useNavigation } from "react-router";
import { useEffect, useRef, useState } from "react";
import ButtonSecondary from "~/components/ui/buttons/ButtonSecondary";
import LoadingButton from "~/components/ui/buttons/LoadingButton";
import InputText, { RefInputText } from "~/components/ui/input/InputText";
import UrlUtils from "~/utils/app/UrlUtils";
import { KnowledgeBaseDto } from "~/modules/knowledgeBase/dtos/KnowledgeBaseDto";
import EntityIcon from "~/components/layouts/icons/EntityIcon";
import { KnowledgeBaseCategoryWithDetails } from "../../helpers/KbCategoryModelHelper";
import KbSortArticles from "../articles/KbSortArticles";

export default function KbCategoryForm({
  knowledgeBase,
  language,
  item,
  onDelete,
}: Readonly<{
  knowledgeBase: KnowledgeBaseDto;
  language: string;
  item?: KnowledgeBaseCategoryWithDetails;
  onDelete?: () => void;
}>) {
  const navigation = useNavigation();
  const navigate = useNavigate();

  const mainInput = useRef<RefInputText>(null);
  useEffect(() => {
    setTimeout(() => {
      mainInput.current?.input.current?.focus();
    }, 100);
  }, []);

  const [slug, setSlug] = useState(item?.slug || "");
  const [title, setTitle] = useState(item?.title || "");
  const [description, setDescription] = useState(item?.description || "");
  const [icon, setIcon] = useState(item?.icon || "");
  const [seoImage, setSeoImage] = useState(item?.seoImage || "");

  useEffect(() => {
    if (!item) {
      setSlug(UrlUtils.slugify(title.toLowerCase()));
    }
  }, [item, title]);

  return (
    <div>
      <Form method="post" className="inline-block w-full overflow-hidden p-1 text-left align-bottom sm:align-middle">
        <input type="hidden" name="action" value={item ? "edit" : "new"} hidden readOnly />
        <div className="space-y-2">
          <InputText ref={mainInput} autoFocus name="title" title={"Title"} value={title} setValue={setTitle} required />
          <InputText name="slug" title={"Slug"} value={slug} setValue={setSlug} required />
          <InputText name="description" title={"Description"} value={description} setValue={setDescription} />

          <InputText
            name="icon"
            title={"Icon"}
            value={icon}
            setValue={(e) => setIcon(e.toString() ?? "")}
            hint={"svg or url"}
            button={
              <div className="absolute inset-y-0 right-0 flex py-0.5 pr-0.5 ">
                <kbd className="border-border text-muted-foreground bg-secondary inline-flex w-10 items-center justify-center rounded border px-1 text-center font-sans text-xs font-medium">
                  {icon ? <EntityIcon className="text-muted-foreground h-7 w-7" icon={icon} title={title} /> : <span className="text-red-600">?</span>}
                </kbd>
              </div>
            }
          />
          <InputText name="seoImage" title={"SEO Image"} value={seoImage} setValue={setSeoImage} hint={"url"} />
          {seoImage && (
            <div className="col-span-12">
              <img className="xl:border-border overflow-hidden rounded-lg shadow-xl xl:border-b" src={seoImage} alt={title} />
            </div>
          )}

          {item && <KbSortArticles items={item.articles.filter((f) => !f.sectionId).sort((a, b) => a.order - b.order)} />}
        </div>
        <div className="mt-5 flex justify-between space-x-2 sm:mt-6">
          <div>
            {onDelete && (
              <ButtonSecondary
                disabled={navigation.state === "submitting" || (item?.articles ?? []).length > 0}
                type="button"
                className="w-full"
                onClick={onDelete}
                destructive
              >
                <div>{"Delete"}</div>
              </ButtonSecondary>
            )}
          </div>
          <div className="flex space-x-2">
            <ButtonSecondary onClick={() => navigate(`/admin/knowledge-base/bases/${knowledgeBase.slug}/categories/${language}`)}>{"Cancel"}</ButtonSecondary>
            <LoadingButton actionName={item ? "edit" : "new"} type="submit" disabled={navigation.state === "submitting"}>
              {"Save"}
            </LoadingButton>
          </div>
        </div>
      </Form>
    </div>
  );
}
