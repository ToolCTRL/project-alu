import { ReactNode, useState } from "react";
import ErrorBanner from "~/components/ui/banners/ErrorBanner";
import Tabs from "~/components/ui/tabs/Tabs";
import { UserSession } from "~/utils/session.server";
import { PageBlockDto } from "../../dtos/PageBlockDto";
import RowsListBlock from "./app/rows/list/RowsListBlock";
import RowsListBlockForm from "./app/rows/list/RowsListBlockForm";
import RowsNewBlock from "./app/rows/new/RowsNewBlock";
import RowsNewBlockForm from "./app/rows/new/RowsNewBlockForm";
import RowsOverviewBlock from "./app/rows/overview/RowsOverviewBlock";
import RowsOverviewBlockForm from "./app/rows/overview/RowsOverviewBlockForm";
import BannerBlock from "./marketing/banner/BannerBlock";
import BannerBlockForm from "./marketing/banner/BannerBlockForm";
import CommunityBlock from "./marketing/community/CommunityBlock";
import CommunityBlockForm from "./marketing/community/CommunityBlockForm";
import FaqBlock from "./marketing/faq/FaqBlock";
import FaqBlockForm from "./marketing/faq/FaqBlockForm";
import FeaturesBlock from "./marketing/features/FeaturesBlock";
import FeaturesBlockForm from "./marketing/features/FeaturesBlockForm";
import FooterBlock from "./marketing/footer/FooterBlock";
import FooterBlockForm from "./marketing/footer/FooterBlockForm";
import GalleryBlock from "./marketing/gallery/GalleryBlock";
import GalleryBlockForm from "./marketing/gallery/GalleryBlockForm";
import HeaderBlock from "./marketing/header/HeaderBlock";
import HeaderBlockForm from "./marketing/header/HeaderBlockForm";
import HeadingBlock from "./marketing/heading/HeadingBlock";
import HeadingBlockForm from "./marketing/heading/HeadingBlockForm";
import HeroBlock from "./marketing/hero/HeroBlock";
import HeroBlockForm from "./marketing/hero/HeroBlockForm";
import LogoCloudsBlock from "./marketing/logoClouds/LogoCloudsBlock";
import LogoCloudsBlockForm from "./marketing/logoClouds/LogoCloudsBlockForm";
import NewsletterBlock from "./marketing/newsletter/NewsletterBlock";
import NewsletterBlockForm from "./marketing/newsletter/NewsletterBlockForm";
import PricingBlock from "./marketing/pricing/PricingBlock";
import PricingBlockForm from "./marketing/pricing/PricingBlockForm";
import TestimonialsBlock from "./marketing/testimonials/TestimonialsBlock";
import TestimonialsBlockForm from "./marketing/testimonials/TestimonialsBlockForm";
import VideoBlock from "./marketing/video/VideoBlock";
import VideoBlockForm from "./marketing/video/VideoBlockForm";
import PageBlockBoundary from "./PageBlockBoundary";
import JsonBlockForm from "./shared/layout/json/JsonBlockForm";
import LayoutBlockForm from "./shared/layout/LayoutBlockForm";
import ContentBlock from "./marketing/markdown/ContentBlock";
import ContentBlockForm from "./marketing/markdown/ContentBlockForm";
import StoryBlock from "./marketing/story/StoryBlock";
import StoryBlockForm from "./marketing/story/StoryBlockForm";
import ValuesBlock from "./marketing/values/ValuesBlock";
import ValuesBlockForm from "./marketing/values/ValuesBlockForm";
import StatsBlock from "./marketing/stats/StatsBlock";
import StatsBlockForm from "./marketing/stats/StatsBlockForm";

export function PageBlock({ item, userSession }: { readonly item: PageBlockDto; readonly userSession?: UserSession }) {
  return (
    <>
      <PageBlockBoundary item={item} />
      {item.heading && <HeadingBlock item={item.heading} />}
      {item.banner && <BannerBlock item={item.banner} />}
      {item.header && <HeaderBlock item={item.header} />}
      {item.footer && <FooterBlock item={item.footer} />}
      {item.hero && <HeroBlock item={item.hero} />}
      {item.gallery && <GalleryBlock item={item.gallery} />}
      {item.logoClouds && <LogoCloudsBlock item={item.logoClouds} />}
      {item.video && <VideoBlock item={item.video} />}
      {item.community && <CommunityBlock item={item.community} />}
      {item.testimonials && <TestimonialsBlock item={item.testimonials} />}
      {item.features && <FeaturesBlock item={item.features} />}
      {item.newsletter && <NewsletterBlock item={item.newsletter} />}
      {item.faq && <FaqBlock item={item.faq} />}
      {item.pricing && <PricingBlock item={item.pricing} />}
      {item.rowsList && <RowsListBlock item={item.rowsList} />}
      {item.rowsNew && <RowsNewBlock item={item.rowsNew} />}
      {item.rowsOverview && <RowsOverviewBlock item={item.rowsOverview} />}
      {item.content && <ContentBlock item={item.content} />}
      {item.story && <StoryBlock item={item.story} />}
      {item.values && <ValuesBlock item={item.values} />}
      {item.stats && <StatsBlock item={item.stats} />}
    </>
  );
}

function getBlockForm(type: string, item: PageBlockDto | undefined, onUpdate: (item: PageBlockDto) => void): ReactNode {
  const blockFormMap: Record<string, ReactNode> = {
    heading: <HeadingBlockForm item={item?.heading} onUpdate={(heading) => onUpdate({ heading })} />,
    banner: <BannerBlockForm item={item?.banner} onUpdate={(banner) => onUpdate({ banner })} />,
    header: <HeaderBlockForm item={item?.header} onUpdate={(header) => onUpdate({ header })} />,
    footer: <FooterBlockForm item={item?.footer} onUpdate={(footer) => onUpdate({ footer })} />,
    hero: <HeroBlockForm item={item?.hero} onUpdate={(hero) => onUpdate({ hero })} />,
    logoClouds: <LogoCloudsBlockForm item={item?.logoClouds} onUpdate={(logoClouds) => onUpdate({ logoClouds })} />,
    gallery: <GalleryBlockForm item={item?.gallery} onUpdate={(gallery) => onUpdate({ gallery })} />,
    video: <VideoBlockForm item={item?.video} onUpdate={(video) => onUpdate({ video })} />,
    community: <CommunityBlockForm item={item?.community} onUpdate={(community) => onUpdate({ community })} />,
    testimonials: <TestimonialsBlockForm item={item?.testimonials} onUpdate={(testimonials) => onUpdate({ testimonials })} />,
    faq: <FaqBlockForm item={item?.faq} onUpdate={(faq) => onUpdate({ faq })} />,
    features: <FeaturesBlockForm item={item?.features} onUpdate={(features) => onUpdate({ features })} />,
    newsletter: <NewsletterBlockForm item={item?.newsletter} onUpdate={(newsletter) => onUpdate({ newsletter })} />,
    pricing: <PricingBlockForm item={item?.pricing} onUpdate={(pricing) => onUpdate({ pricing })} />,
    rowsList: <RowsListBlockForm item={item?.rowsList} onUpdate={(rowsList) => onUpdate({ rowsList })} />,
    rowsNew: <RowsNewBlockForm item={item?.rowsNew} onUpdate={(rowsNew) => onUpdate({ rowsNew })} />,
    rowsOverview: <RowsOverviewBlockForm item={item?.rowsOverview} onUpdate={(rowsOverview) => onUpdate({ rowsOverview })} />,
    content: <ContentBlockForm item={item?.content} onUpdate={(content) => onUpdate({ content })} />,
    story: <StoryBlockForm item={item?.story} onUpdate={(story) => onUpdate({ story })} />,
    values: <ValuesBlockForm item={item?.values} onUpdate={(values) => onUpdate({ values })} />,
    stats: <StatsBlockForm item={item?.stats} onUpdate={(stats) => onUpdate({ stats })} />,
  };

  return blockFormMap[type] || <ErrorBanner title="TODO" text={"TODO BLOCK FORM FOR TYPE: " + type} />;
}

export function PageBlockForm({
  type,
  item,
  onUpdate,
  onUpdateLayout,
}: {
  readonly type: string;
  readonly item?: PageBlockDto;
  readonly onUpdate: (item: PageBlockDto) => void;
  readonly onUpdateLayout: (layout?: PageBlockDto["layout"]) => void;
}) {
  const [selectedTab, setSelectedTab] = useState<number>(0);
  const block = getBlockForm(type, item, onUpdate);

  return (
    <div className="space-y-4">
      <Tabs asLinks={false} onSelected={(index) => setSelectedTab(index)} tabs={[{ name: `Block` }, { name: `JSON` }]} />
      {selectedTab === 0 && (
        <>
          {block}
          <LayoutBlockForm item={item} onUpdate={(item) => onUpdateLayout(item?.layout)} />
        </>
      )}
      {selectedTab === 1 && <JsonBlockForm item={item} onUpdate={(block) => onUpdate(block)} />}
    </div>
  );
}
