import type { EntryContext } from "react-router";
import KnowledgeBaseServiceServer from "~/modules/knowledgeBase/service/KnowledgeBaseService.server";
import KnowledgeBaseUtils from "~/modules/knowledgeBase/utils/KnowledgeBaseUtils";
import { getAppConfiguration } from "./db/appConfiguration.db.server";
import { i18nConfig } from "~/locale/i18n";
import { defaultPages } from "~/modules/pageBlocks/utils/defaultPages";
import { getAllBlogPosts } from "~/modules/blog/db/blog.db.server";
import { getPages } from "~/modules/pageBlocks/db/pages.db.server";


function removeTrailingSlash(s: string) {
  return s.endsWith("/") ? s.slice(0, -1) : s;
}

function getDomainUrl(request: Request) {
  const host = request.headers.get("X-Forwarded-Host") ?? request.headers.get("host");
  if (!host) {
    throw new Error("Could not determine domain URL.");
  }
  const protocol = host.includes("localhost") ? "http" : "https";
  return `${protocol}://${host}`;
}

type SitemapEntry = {
  route: string;
  lastmod?: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: 0 | 0.1 | 0.2 | 0.3 | 0.4 | 0.5 | 0.6 | 0.7 | 0.8 | 0.9 | 1;
};
type SitemapHandle = {
  /** this just allows us to identify routes more directly rather than relying on pathnames */
  id?: string;
  /** this is here to allow us to disable scroll restoration until Remix gives us better control */
  restoreScroll?: false;
  getSitemapEntries?: (request: Request) => Promise<Array<SitemapEntry | null> | null> | Array<SitemapEntry | null> | null;
};

function shouldSkipRoute(id: string): boolean {
  return id === "root" || id.startsWith("routes/_") || id.startsWith("__test_routes__");
}

function buildRoutePath(manifestEntry: any, manifest: any): string | null {
  let path;
  if (manifestEntry.path) {
    path = removeTrailingSlash(manifestEntry.path);
  } else if (manifestEntry.index) {
    path = "";
  } else {
    return null;
  }

  let parentId = manifestEntry.parentId;
  let parent = parentId ? manifest.routes[parentId] : null;

  while (parent) {
    const parentPath = parent.path ? removeTrailingSlash(parent.path) : "";
    path = `${parentPath}/${path}`;
    parentId = parent.parentId;
    parent = parentId ? manifest.routes[parentId] : null;
  }

  return path;
}

function getExcludedRoutes(appConfiguration: any): string[] {
  const excludeRoutes = ["/*", "/app", "/admin", "/debug", "/404", "/401", "/new-account", "/reset", "/iframe", "/components"];
  if (!appConfiguration.subscription.allowSignUpBeforeSubscribe) {
    excludeRoutes.push("/register");
  }
  if (!(appConfiguration.affiliates?.provider?.rewardfulApiKey)) {
    excludeRoutes.push("/affiliate-program");
  }
  return excludeRoutes;
}

function shouldExcludeEntry(entry: SitemapEntry, excludeRoutes: string[], sitemapEntries: SitemapEntry[]): boolean {
  if (excludeRoutes.some((r) => entry.route.startsWith(r))) {
    return true;
  }
  return sitemapEntries.some((e) => e.route === entry.route);
}

function shouldSkipLanguageEntry(entry: SitemapEntry): boolean {
  return (
    entry.route === "/docs" ||
    entry.route.startsWith("/blog/") ||
    entry.route.startsWith("/api/") ||
    entry.route.startsWith("/components/")
  );
}

async function addLanguageVariants(sitemapEntries: SitemapEntry[], domainUrl: string): Promise<void> {
  i18nConfig.supportedLngs
    .filter((f) => f !== i18nConfig.fallbackLng)
    .forEach((lng) => {
      sitemapEntries.forEach((entry) => {
        const url = new URL(`${domainUrl}${entry.route}`);
        if (url.searchParams.get("lng") || shouldSkipLanguageEntry(entry)) return;

        const newEntry = { ...entry, route: `${entry.route}?lng=${lng}` };
        sitemapEntries.push(newEntry);
      });
    });
}

async function addKnowledgeBaseEntries(sitemapEntries: SitemapEntry[], request: Request): Promise<void> {
  const knowledgeBases = await KnowledgeBaseServiceServer.getAll({ enabled: true, request });

  for (const kb of knowledgeBases) {
    const kbUrl = KnowledgeBaseUtils.getKbUrl({ kb, params: {} });
    addSitemapEntry(sitemapEntries, {
      route: kbUrl,
      lastmod: kb.updatedAt ? kb.updatedAt.toISOString() : kb.createdAt?.toISOString(),
    });

    await addKnowledgeBaseCategoryEntries(sitemapEntries, kb, request);
  }
}

async function addKnowledgeBaseCategoryEntries(sitemapEntries: SitemapEntry[], kb: any, request: Request): Promise<void> {
  const allCategories = await KnowledgeBaseServiceServer.getCategories({ kb, params: {}, request });

  for (const category of allCategories) {
    addSitemapEntry(sitemapEntries, {
      route: KnowledgeBaseUtils.getCategoryUrl({ kb, category, params: {} }),
      lastmod: kb.updatedAt ? kb.updatedAt.toISOString() : kb.createdAt?.toISOString(),
    });

    const allArticles = await KnowledgeBaseServiceServer.getArticles({
      kb,
      language: kb.defaultLanguage,
      categoryId: category.id,
      query: undefined,
      params: {},
      request,
    });

    allArticles
      .filter((f) => f.publishedAt)
      .forEach((article) => {
        addSitemapEntry(sitemapEntries, {
          route: KnowledgeBaseUtils.getArticleUrl({ kb, article, params: {} }),
          lastmod: article.updatedAt ? article.updatedAt.toISOString() : article.createdAt?.toISOString(),
        });
      });
  }
}

async function getSitemapXml(request: Request, remixContext: EntryContext) {
  const appConfiguration = await getAppConfiguration({ request });
  const domainUrl = getDomainUrl(request);

  function getEntry({ route, lastmod, changefreq, priority }: SitemapEntry) {
    return `
<url>
  <loc>${domainUrl}${route}</loc>
  ${lastmod ? `<lastmod>${lastmod}</lastmod>` : ""}
  ${changefreq ? `<changefreq>${changefreq}</changefreq>` : ""}
  ${priority ? `<priority>${priority}</priority>` : ""}
</url>
  `.trim();
  }

  const rawSitemapEntries = (
    await Promise.all(
      Object.entries(remixContext.routeModules).map(async ([id, mod]) => {
        if (shouldSkipRoute(id)) return;

        const handle = mod?.handle as SitemapHandle | undefined;
        if (handle?.getSitemapEntries) {
          return handle.getSitemapEntries(request);
        }

        if (!mod || !("default" in mod)) return;

        const manifestEntry = remixContext.manifest.routes[id];
        if (!manifestEntry) {
          console.warn(`Could not find a manifest entry for ${id}`);
          return;
        }

        const path = buildRoutePath(manifestEntry, remixContext.manifest);
        if (!path || path.includes(":")) return;

        const entry: SitemapEntry = { route: removeTrailingSlash(path) };
        return entry;
      })
    )
  )
    .flat()
    .filter(Boolean);

  const sitemapEntries: Array<SitemapEntry> = [];
  const excludeRoutes = getExcludedRoutes(appConfiguration);

  for (const entry of rawSitemapEntries) {
    if (!shouldExcludeEntry(entry, excludeRoutes, sitemapEntries)) {
      sitemapEntries.push(entry);
    }
  }

  defaultPages
    .filter((f) => !f.includes(":"))
    .forEach((page) => {
      addSitemapEntry(sitemapEntries, { route: page });
    });

  const blogPosts = await getAllBlogPosts({ tenantId: null, published: true });
  blogPosts.forEach((post) => {
    addSitemapEntry(sitemapEntries, {
      route: `/blog/${post.slug}`,
      lastmod: post.updatedAt ? post.updatedAt.toISOString() : post.date?.toISOString(),
    });
  });

  const pages = (await getPages()).filter((f) => !f.slug.includes(":") && f.isPublished && f.isPublic && !defaultPages.includes(f.slug));
  if (pages.length > 0) {
    console.log("[sitemap.xml] custom pages: " + pages.map((f) => f.slug).join(", "));
  }
  pages.forEach((page) => {
    addSitemapEntry(sitemapEntries, {
      route: `${page.slug}`,
      lastmod: page.updatedAt ? page.updatedAt.toISOString() : page.createdAt?.toISOString(),
    });
  });

  await addLanguageVariants(sitemapEntries, domainUrl);
  await addKnowledgeBaseEntries(sitemapEntries, request);

  return `
<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd"
>
  ${sitemapEntries.map((entry) => getEntry(entry)).join("")}
</urlset>
  `.trim();
}

function addSitemapEntry(sitemapEntries: SitemapEntry[], entry: SitemapEntry) {
  if (sitemapEntries.some((e) => e.route === entry.route)) return;
  sitemapEntries.push(entry);
}

export { getSitemapXml };
