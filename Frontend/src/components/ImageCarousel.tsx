import { useCallback, useEffect, useRef, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';

export interface CarouselImage {
  src: string;
  alt: string;
}

interface ImageCarouselProps {
  images: CarouselImage[];
  className?: string;
  autoPlayInterval?: number;
}

export function ImageCarousel({
  images,
  className = '',
  autoPlayInterval = 4800,
}: ImageCarouselProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: 'start',
    containScroll: 'trimSnaps',
    slidesToScroll: 1,
    dragFree: false,
    skipSnaps: false,
  });
  const [isPaused, setIsPaused] = useState(false);
  const autoPlayRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on('select', onSelect);
    onSelect();
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((index: number) => emblaApi?.scrollTo(index), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const play = () => {
      if (!isPaused) {
        emblaApi.scrollNext();
      }
      autoPlayRef.current = setTimeout(play, autoPlayInterval);
    };
    autoPlayRef.current = setTimeout(play, autoPlayInterval);
    return () => {
      if (autoPlayRef.current) clearTimeout(autoPlayRef.current);
    };
  }, [emblaApi, isPaused, autoPlayInterval]);

  return (
    <div className={`max-w-none w-full px-4 sm:px-6 md:px-8 ${className}`}>
      <div className="relative">
        {/* Carousel Container */}
        <div className="overflow-hidden rounded-2xl" ref={emblaRef}>
          <div className="flex gap-2 sm:gap-3 md:gap-4">
            {images.map((image, index) => (
              <div
                key={index}
                className="flex-[0_0_100%] sm:flex-[0_0_calc(50%-6px)] md:flex-[0_0_calc(50%-8px)]"
              >
                <div className="relative aspect-video rounded-lg overflow-hidden shadow-lg group bg-gray-100">
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Buttons */}
        <button
          onClick={scrollPrev}
          aria-label="Diapositiva anterior"
          className="icon-button-primary absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 sm:-translate-x-6 z-10"
        >
          <ChevronLeft className="w-6 h-6 text-gray-900" />
        </button>

        <button
          onClick={scrollNext}
          aria-label="Siguiente diapositiva"
          className="icon-button-primary absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 sm:translate-x-6 z-10"
        >
          <ChevronRight className="w-6 h-6 text-gray-900" />
        </button>
      </div>

      {/* Controls Below Carousel */}
      <div className="flex items-center justify-between mt-6">
        {/* Play/Pause Button */}
        <button
          onClick={() => setIsPaused(!isPaused)}
          aria-label={isPaused ? 'Reproducir' : 'Pausar'}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors text-gray-900 font-medium"
        >
          {isPaused ? (
            <>
              <Play className="w-5 h-5" />
              <span>Reproducir</span>
            </>
          ) : (
            <>
              <Pause className="w-5 h-5" />
              <span>Pausar</span>
            </>
          )}
        </button>

        {/* Dot Indicators */}
        <div className="flex gap-2 justify-center flex-1 mx-4">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              aria-label={`Ir a diapositiva ${index + 1}`}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                index === selectedIndex
                  ? 'bg-cyan-600 w-8'
                  : 'bg-gray-300 hover:bg-gray-400 w-2.5'
              }`}
            />
          ))}
        </div>

        {/* Image Counter */}
        <div className="text-sm font-medium text-gray-600">
          {selectedIndex + 1} / {images.length}
        </div>
      </div>
    </div>
  );
}
