import CustomCarousel from "../images/CustomCarousel";

interface Props {
  items: {
    type: string;
    title: string;
    src: string;
  }[];
}

export default function DocCarousel({ items }: Readonly<Props>) {
  return <CustomCarousel items={items} />;
}
