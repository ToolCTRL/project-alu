import { Fragment } from "react";
import ButtonEvent from "~/components/ui/buttons/ButtonEvent";
import { useRootData } from "~/utils/data/useRootData";

interface Props {
  readonly theme?: "light" | "neutral" | "dark";
}

function getProductHuntImage(theme: string | undefined, postId: string, title: string) {
  let themeParam = "light";
  if (theme === "neutral") {
    themeParam = "neutral";
  } else if (theme === "dark") {
    themeParam = "dark";
  } else if (theme === "light") {
    themeParam = "light";
  }

  return (
    <img
      src={`https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=${postId}&theme=${themeParam}`}
      alt={title}
      style={{ width: "220px" }}
      width="250"
      height="54"
    />
  );
}

export default function ProductHuntBadge({ theme }: Readonly<Props>) {
  const rootData = useRootData();
  const producthunt = rootData?.appConfiguration.launches?.producthunt;
  if (!producthunt) {
    return null;
  }
  return (
    <Fragment>
      {producthunt ? (
        <div className="mx-auto mb-6 flex justify-center text-center">
          <ButtonEvent
            event={{ action: "click", category: "hero", label: "producthunt", value: producthunt.title }}
            to={producthunt.url}
            target="_blank"
            rel="noreferrer"
          >
            {getProductHuntImage(theme, producthunt.postId, producthunt.title)}
          </ButtonEvent>
        </div>
      ) : null}
    </Fragment>
  );
}
