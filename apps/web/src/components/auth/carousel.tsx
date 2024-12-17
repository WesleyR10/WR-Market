'use client'

import Autoplay from 'embla-carousel-autoplay'
import Image from 'next/image'

import { Card, CardContent } from '@/components/ui/card'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel'
export const CarouselComponent = () => {
  return (
    <div className="box-border h-full w-full p-4">
      <Carousel
        plugins={[
          Autoplay({
            delay: 5000,
          }),
        ]}
        className="h-full w-full"
      >
        <CarouselContent className="h-full w-full">
          {Array.from({ length: 5 }).map((_, index) => (
            <CarouselItem key={index} className="h-full w-full">
              <Card className="h-full w-full overflow-hidden rounded-lg">
                <CardContent className="aspect-square flex h-full w-full items-center justify-center">
                  <Image
                    key={index}
                    src={`/images/image${index + 1}.jpg`}
                    alt={`Image ${index + 1}`}
                    width={100}
                    height={100}
                    className="rounded-lg"
                  />
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  )
}
