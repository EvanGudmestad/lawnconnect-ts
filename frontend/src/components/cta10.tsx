import { cn } from "cn";
import { Button } from "@/components/ui/button";

interface Button {
  text: string;
  url: string;
  icon?: React.ReactNode;
}
interface Buttons {
  primary?: Button;
  secondary?: Button;
}

interface CtaSimpleProps {
  heading: string;
  description: string;
  buttons?: Buttons;
  className?: string;
}

interface Cta10Props extends CtaSimpleProps {}
type Props = Partial<Cta10Props>;

const defaultProps: Cta10Props = {
  heading: "Call to Action",
  description:
    "Get access to our collection of pre-built blocks and components today.",
  buttons: {
    primary: {
      text: "Get Access",
      url: "https://shadcnblocks.com",
    },
    secondary: {
      text: "Schedule a Demo",
      url: "https://shadcnblocks.com",
    },
  },
};

const Cta10 = (props: Props) => {
  const { heading, description, buttons, className } = {
    ...defaultProps,
    ...props,
  };

  return (
    <section className={cn("py-12 md:py-16 lg:py-32", className)}>
      <div className="container mx-auto">
        <div className="mx-auto flex w-full flex-col gap-16 overflow-hidden rounded-lg bg-accent p-8 text-accent-foreground md:rounded-xl lg:flex-row lg:items-center lg:p-12">
          <div className="flex flex-1 flex-col gap-3 md:gap-4 lg:gap-6">
            <h2 className="text-2xl font-semibold tracking-tight md:text-4xl">
              {heading}
            </h2>
            <p className="max-w-xl text-accent-foreground/80 lg:text-lg">
              {description}
            </p>
          </div>
          <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
            {buttons?.secondary && (
              <Button
                variant="outline"
                size="lg"
                className="text-foreground"
                render={<a href={buttons.secondary.url} />}
                nativeButton={false}
              >
                {buttons.secondary.text}
              </Button>
            )}
            {buttons?.primary && (
              <Button
                size="lg"
                render={<a href={buttons.primary.url} />}
                nativeButton={false}
              >
                {buttons.primary.text}
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export { Cta10 };
