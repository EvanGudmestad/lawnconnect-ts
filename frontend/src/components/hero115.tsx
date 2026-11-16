import { ArrowRight, Wifi } from "lucide-react";
import { cn } from "cn";

import { Button } from "@/components/ui/button";

interface Image {
  src: string;
  alt: string;
  srcDark?: string;
}
interface Button {
  text: string;
  url: string;
  icon?: React.ReactNode;
}
interface Buttons {
  primary?: Button;
  secondary?: Button;
}

interface HeroBasicProps {
  heading: string;
  description: string;
  buttons?: Buttons;
  image: Image;
  byline?: string;
  className?: string;
  icon?: React.ReactNode;
}

interface Hero115Props extends HeroBasicProps {}
type Props = Partial<Hero115Props>;

const defaultProps: Hero115Props = {
  heading: "The CRM platform for modern product teams.",
  description: "An open-source project management platform built for modern product teams. Plan, track, and ship with confidence.",
  buttons: {
    primary: { text: "Get started", url: "#" },
    secondary: { text: "Learn more", url: "#" },
  },
  image: {
    src: "https://cdn.shadcnblocks.com/shadcnblocks/image-set/modern/saas-details/saas-detail-1-16x9.png",
    alt: "Product dashboard",
  },
  byline: "Trusted by teams at Arc, Notion, Raycast, and more",
  icon: <Wifi className="size-6" />,
};

const Hero115 = (props: Props) => {
  const { icon, heading, description, buttons, image, byline, className } = {
    ...defaultProps,
    ...props,
  };

  return (
    <section className={cn("overflow-hidden py-32", className)}>
      <div className="container mx-auto">
        <div className="flex flex-col gap-5">
          <div className="relative isolate flex flex-col gap-5">
            <div
              aria-hidden
              className="pointer-events-none absolute top-1/2 left-1/2 -z-10 mx-auto size-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-border mask-[linear-gradient(to_top,transparent,transparent,white,white,white,transparent,transparent)] p-16 [-webkit-mask-image:linear-gradient(to_top,transparent,transparent,white,white,white,transparent,transparent)] md:size-[1300px] md:p-32"
            >
              <div className="size-full rounded-full border border-border p-16 md:p-32">
                <div className="size-full rounded-full border border-border" />
              </div>
            </div>
            <span className="mx-auto flex size-16 items-center justify-center rounded-full border md:size-20">
              {icon}
            </span>
            <h1 className="mx-auto max-w-xl text-center text-4xl font-semibold tracking-tight text-pretty md:text-5xl lg:max-w-3xl lg:text-6xl">
              {heading}
            </h1>
            <p className="mx-auto max-w-5xl text-center text-lg text-balance text-muted-foreground md:text-xl">
              {description}
            </p>
            <div className="flex flex-col items-center gap-3 pt-3 pb-12">
              {buttons?.primary && (
                <Button size="lg" className="w-full sm:w-auto" render={<a href={buttons.primary.url} />} nativeButton={false}>{buttons.primary.text}<ArrowRight className="size-4" /></Button>
              )}
              {byline && (
                <div className="text-center text-sm text-muted-foreground">
                  {byline}
                </div>
              )}
            </div>
          </div>
          {image.srcDark ? (
            <>
              <img
                src={image.src}
                alt={image.alt}
                className="mx-auto aspect-3/4 h-full max-h-[524px] w-full max-w-5xl rounded-lg border border-border object-cover object-top-left md:aspect-video md:object-top dark:hidden"
              />
              <img
                src={image.srcDark}
                alt={image.alt}
                className="mx-auto hidden aspect-3/4 h-full max-h-[524px] w-full max-w-5xl rounded-lg border border-border object-cover object-top-left md:aspect-video md:object-top dark:block"
              />
            </>
          ) : (
            <img
              src={image.src}
              alt={image.alt}
              className="mx-auto aspect-3/4 h-full max-h-[524px] w-full max-w-5xl rounded-lg border border-border object-cover object-top-left md:aspect-video md:object-top"
            />
          )}
        </div>
      </div>
    </section>
  );
};

export { Hero115 };
