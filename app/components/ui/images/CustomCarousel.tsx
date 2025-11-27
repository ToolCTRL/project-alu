import clsx from "clsx";
import { useEffect, useState } from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../carousel";
import { Card } from "../card";

interface Props {
  readonly items: { type: string; title: string; src: string }[];
  readonly size?: "sm" | "md" | "lg" | "full";
}
export default function CustomCarousel({ items, size = "full" }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);

  function nextImage() {
    if (items.length > currentIndex + 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
    }
  }

  function previousImage() {
    if (currentIndex === 0) {
      setCurrentIndex(items.length - 1);
    } else {
      setCurrentIndex(currentIndex - 1);
    }
  }

  return (
    <div className="relative mx-auto w-full">
      <CarouselItems items={items} size={size} />
    </div>
  );
}

export function CarouselItems({ items, size }: Props) {
  return (
    <Carousel
      className={clsx("mx-auto w-full", size === "sm" && "max-w-xs", size === "md" && "max-w-md", size === "lg" && "max-w-lg", size === "full" && "max-w-full")}
    >
      <CarouselContent>
        {items.map((item) => (
          <CarouselItem key={item.src}>
            <div className="p-1">
              <Card className="overflow-hidden rounded-lg">
                {/* <span className="text-4xl font-semibold">{index + 1}</span> */}
                {item.type === "image" && (
                  <img
                    key={item.src}
                    loading="lazy"
                    className={clsx("min-h-full w-full object-cover md:h-auto", size === "sm" && "h-48", size === "md" && "h-64", size === "lg" && "h-96")}
                    src={item.src}
                    alt={item.title}
                  />
                )}
                {item?.type === "video" && (
                  <iframe
                    key={item.src}
                    src={item.src}
                    title={item?.title ?? ""}
                    loading="lazy"
                    className="h-96 min-h-full w-full object-cover md:h-auto"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  ></iframe>
                )}
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
