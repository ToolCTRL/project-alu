import { KnowledgeBase, KnowledgeBaseArticle } from "@prisma/client";
import { createKnowledgeBaseArticle, getAllKnowledgeBaseArticles, getKbArticleBySlug, updateKnowledgeBaseArticle } from "../db/kbArticles.db.server";
import { createKnowledgeBaseCategory, getAllKnowledgeBaseCategories, getKbCategoryBySlug, updateKnowledgeBaseCategory } from "../db/kbCategories.db.server";
import { createKnowledgeBase, getAllKnowledgeBases, getKnowledgeBaseBySlug, updateKnowledgeBase } from "../db/knowledgeBase.db.server";
import { KbNavLinkDto } from "../dtos/KbNavLinkDto";
import { KnowledgeBasesTemplateDto } from "../dtos/KnowledgeBasesTemplateDto";
import { KnowledgeBaseCategoryWithDetails } from "../helpers/KbCategoryModelHelper";
import { createKnowledgeBaseCategorySection, updateKnowledgeBaseCategorySection } from "../db/kbCategorySections.db.server";
import { adminGetAllUsersNames } from "~/utils/db/users.db.server";

interface ImportStats {
  kbs: number;
  categories: number;
  sections: number;
  articles: number;
}

async function upsertKnowledgeBase(kb: KnowledgeBasesTemplateDto["knowledgeBases"][0]): Promise<{ kb: KnowledgeBase; isNew: boolean }> {
  const basePath = kb.basePath || "/";
  const kbData = {
    basePath,
    slug: kb.slug,
    title: kb.title,
    description: kb.description,
    defaultLanguage: kb.defaultLanguage,
    layout: kb.layout,
    color: kb.color,
    enabled: kb.enabled,
    languages: JSON.stringify(kb.languages),
    links: JSON.stringify(kb.links),
    logo: kb.logo,
    seoImage: kb.seoImage,
  };

  const existing = await getKnowledgeBaseBySlug(kb.slug);
  if (existing) {
    await updateKnowledgeBase(existing.id, kbData);
    return { kb: existing, isNew: false };
  }

  const created = await createKnowledgeBase(kbData);
  return { kb: created, isNew: true };
}

async function upsertCategory(
  category: KnowledgeBasesTemplateDto["categories"][0],
  kbId: string
): Promise<{ category: KnowledgeBaseCategoryWithDetails; isNew: boolean }> {
  const categoryData = {
    title: category.title,
    order: category.order,
    description: category.description,
    icon: category.icon,
    language: category.language,
    seoImage: category.seoImage,
  };

  const existing = await getKbCategoryBySlug({
    knowledgeBaseId: kbId,
    slug: category.slug,
    language: category.language,
  });

  if (existing) {
    await updateKnowledgeBaseCategory(existing.id, categoryData);
    return { category: existing, isNew: false };
  }

  const created = await createKnowledgeBaseCategory({
    knowledgeBaseId: kbId,
    slug: category.slug,
    ...categoryData,
  });
  return { category: created, isNew: true };
}

async function upsertSection(
  section: KnowledgeBasesTemplateDto["categories"][0]["sections"][0],
  existingCategory: KnowledgeBaseCategoryWithDetails | null
): Promise<boolean> {
  const existingSection = existingCategory?.sections.find((s) => s.order === section.order) ?? null;

  if (existingSection) {
    await updateKnowledgeBaseCategorySection(existingSection.id, {
      title: section.title,
      description: section.description,
    });
    return false;
  }

  await createKnowledgeBaseCategorySection({
    categoryId: existingCategory?.id ?? null,
    order: section.order,
    title: section.title,
    description: section.description,
  });
  return true;
}

async function findArticleCategory(article: KnowledgeBasesTemplateDto["articles"][0], kbId: string): Promise<{
  category: KnowledgeBaseCategoryWithDetails | null;
  sectionId: string | null;
}> {
  if (!article.categorySlug) {
    return { category: null, sectionId: null };
  }

  const category = await getKbCategoryBySlug({
    knowledgeBaseId: kbId,
    slug: article.categorySlug,
    language: article.language,
  });

  if (!category || !article.categorySectionOrder) {
    return { category, sectionId: null };
  }

  const section = category.sections.find((s) => s.order === article.categorySectionOrder);
  return { category, sectionId: section?.id ?? null };
}

async function upsertArticle(
  article: KnowledgeBasesTemplateDto["articles"][0],
  kbId: string,
  currentUserId: string,
  allUsers: Array<{ id: string; email: string }>
): Promise<boolean> {
  const { category, sectionId } = await findArticleCategory(article, kbId);

  let createdByUserId = currentUserId;
  if (article.createdByUserEmail) {
    const user = allUsers.find((f) => f.email === article.createdByUserEmail);
    if (user) {
      createdByUserId = user.id;
    }
  }

  const articleData = {
    categoryId: category?.id ?? null,
    sectionId,
    slug: article.slug,
    title: article.title,
    description: article.description,
    order: article.order,
    contentDraft: article.contentDraft,
    contentPublished: article.contentPublished,
    contentPublishedAsText: article.contentPublishedAsText,
    contentType: article.contentType,
    language: article.language,
    featuredOrder: article.featuredOrder,
    createdByUserId,
    seoImage: article.seoImage,
    publishedAt: article.publishedAt ? new Date(article.publishedAt) : null,
  };

  const existing = await getKbArticleBySlug({
    knowledgeBaseId: kbId,
    slug: article.slug,
    language: article.language,
  });

  if (existing) {
    await updateKnowledgeBaseArticle(existing.id, articleData);
    return false;
  }

  await createKnowledgeBaseArticle({
    knowledgeBaseId: kbId,
    ...articleData,
  });
  return true;
}

async function getTemplate(): Promise<KnowledgeBasesTemplateDto> {
  const template: KnowledgeBasesTemplateDto = {
    knowledgeBases: [],
    categories: [],
    articles: [],
  };
  const allKbs = await getAllKnowledgeBases();
  for (const kb of allKbs) {
    template.knowledgeBases.push({
      basePath: kb.basePath,
      slug: kb.slug,
      title: kb.title,
      description: kb.description,
      defaultLanguage: kb.defaultLanguage,
      layout: kb.layout,
      color: kb.color,
      enabled: kb.enabled,
      languages: JSON.parse(kb.languages) as string[],
      links: JSON.parse(kb.links) as KbNavLinkDto[],
      logo: kb.logo,
      seoImage: kb.seoImage,
    });
    const allCategories = await getAllKnowledgeBaseCategories({
      knowledgeBaseSlug: kb.slug,
      language: undefined,
    });
    for (const category of allCategories) {
      template.categories.push({
        knowledgeBaseSlug: kb.slug,
        slug: category.slug,
        order: category.order,
        title: category.title,
        description: category.description,
        icon: category.icon,
        language: category.language,
        seoImage: category.seoImage,
        sections: category.sections.map((section) => ({
          order: section.order,
          title: section.title,
          description: section.description,
        })),
      });
    }
    const allArticles = await getAllKnowledgeBaseArticles({
      knowledgeBaseSlug: kb.slug,
      language: undefined,
    });
    for (const article of allArticles) {
      template.articles.push({
        knowledgeBaseSlug: kb.slug,
        categorySlug: article.category?.slug ?? null,
        categorySectionOrder: article.section?.order ?? null,
        slug: article.slug,
        title: article.title,
        description: article.description,
        order: article.order,
        contentDraft: article.contentDraft,
        contentPublished: article.contentPublished,
        contentPublishedAsText: article.contentPublishedAsText,
        contentType: article.contentType,
        language: article.language,
        featuredOrder: article.featuredOrder,
        seoImage: article.seoImage,
        publishedAt: article.publishedAt ? article.publishedAt.toISOString() : null,
        createdByUserEmail: article.createdByUser?.email ?? null,
        relatedArticles: article.relatedArticles.map(({ relatedArticle }) => ({
          slug: relatedArticle.slug,
        })),
      });
    }
  }
  return template;
}

async function importKbs({ template, currentUserId }: { template: KnowledgeBasesTemplateDto; currentUserId: string }) {
  const created: ImportStats = { kbs: 0, categories: 0, sections: 0, articles: 0 };
  const updated: ImportStats = { kbs: 0, categories: 0, sections: 0, articles: 0 };
  const allUsers = await adminGetAllUsersNames();

  for (const kb of template.knowledgeBases) {
    const { kb: existingKb, isNew: isNewKb } = await upsertKnowledgeBase(kb);
    if (isNewKb) {
      created.kbs++;
    } else {
      updated.kbs++;
    }

    const kbCategories = template.categories.filter((c) => c.knowledgeBaseSlug === kb.slug);
    for (const category of kbCategories) {
      const { category: existingCategory, isNew: isNewCategory } = await upsertCategory(category, existingKb.id);
      if (isNewCategory) {
        created.categories++;
      } else {
        updated.categories++;
      }

      for (const section of category.sections) {
        const isNew = await upsertSection(section, existingCategory);
        if (isNew) {
          created.sections++;
        } else {
          updated.sections++;
        }
      }
    }

    const kbArticles = template.articles.filter((a) => a.knowledgeBaseSlug === kb.slug);
    for (const article of kbArticles) {
      const isNew = await upsertArticle(article, existingKb.id, currentUserId, allUsers);
      if (isNew) {
        created.articles++;
      } else {
        updated.articles++;
      }
    }
  }

  return { created, updated };
}

export default {
  getTemplate,
  importKbs,
};
