import { TFunction } from "i18next";
import { MetaTagsDto } from "~/application/dtos/seo/MetaTagsDto";

type SiteTags = {
  title: string;
  description: string;
  keywords: string;
  image: string;
  thumbnail: string;
  twitterCreator: string;
  twitterSite: string;
};
export function getDefaultSiteTags(): SiteTags {
  return {
    title: "ALU - Geerkens GmbH",
    description: "ALU - Geerkens GmbH",
    keywords: "alu, geerkens gmbh, crm",
    image: "",
    thumbnail: "",
    twitterCreator: "",
    twitterSite: "",
  };
}

export function defaultSeoMetaTags({ t, slug }: { t: TFunction; slug?: string }): MetaTagsDto {
  const siteTags = getDefaultSiteTags();
  if (slug === "/pricing") {
    siteTags.title = `${t("front.pricing.title")} | ${siteTags.title}`;
    siteTags.description = t("front.pricing.headline");
  } else if (slug === "/blog") {
    siteTags.title = `${t("blog.title")} | ${siteTags.title}`;
    siteTags.description = t("blog.headline");
  } else if (slug === "/contact") {
    siteTags.title = `${t("front.contact.title")} | ${siteTags.title}`;
    siteTags.description = t("front.contact.headline");
  } else if (slug === "/newsletter") {
    siteTags.title = `${t("front.newsletter.title")} | ${siteTags.title}`;
    siteTags.description = t("front.newsletter.headline");
  } else if (slug === "/changelog") {
    siteTags.title = `${t("front.changelog.title")} | ${siteTags.title}`;
    siteTags.description = t("front.changelog.headline");
  }
  return parseMetaTags(siteTags);
}

function parseMetaTags(tags: SiteTags): MetaTagsDto {
  const metatags: MetaTagsDto = [
    { title: tags.title },
    { name: "description", content: tags.description },
    { name: "keywords", content: tags.keywords },
    { property: "og:title", content: tags.title },
    { property: "og:type", content: "website" },
    { property: "og:description", content: tags.description },
    { property: "twitter:title", content: tags.title },
    { property: "twitter:description", content: tags.description },
  ];

  if (tags.image) {
    metatags.push({ property: "og:image", content: tags.image });
  }
  if (tags.thumbnail) {
    metatags.push({ property: "twitter:image", content: tags.thumbnail });
  }
  if (tags.twitterCreator) {
    metatags.push({ property: "twitter:creator", content: tags.twitterCreator });
    metatags.push({ property: "og:creator", content: tags.twitterCreator });
  }
  if (tags.twitterSite) {
    metatags.push({ property: "twitter:site", content: tags.twitterSite });
  }
  if (tags.image || tags.thumbnail) {
    metatags.push({ property: "twitter:card", content: "summary_large_image" });
    metatags.push({ property: "og:card", content: "summary_large_image" });
  }

  return metatags;
}
