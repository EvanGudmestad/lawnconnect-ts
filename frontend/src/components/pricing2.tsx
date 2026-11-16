"use client";

import { CircleCheck } from "lucide-react";
import { useState } from "react";
import { cn } from "cn";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

interface PricingCards2CardsPlan {
  name: string;
  description: string;
  monthlyPrice: string;
  yearlyPrice: string;
  features: string[];
  button: {
    text: string;
    url: string;
  };
  highlighted?: boolean;
  featureListLabel?: string;
  image?: string;
}

interface PricingCards2CardsProps {
  heading: string;
  description: string;
  plans: PricingCards2CardsPlan[];
  className?: string;
}

interface Pricing2Props extends PricingCards2CardsProps {}
type Props = Partial<Pricing2Props>;

const defaultProps: Pricing2Props = {
  heading: "Pricing that scales with your team",
  description:
    "Ship UIs faster with blocks built on React, Tailwind CSS, and shadcn/ui—predictable cost whether you are prototyping or running production apps.",
  plans: [
    {
      name: "Starter",
      image: "https://cdn.shadcnblocks.com/shadcnblocks/image-set/modern/pricing-plans/plan1.svg",
      description:
        "For individual developers and side projects shipping real interfaces.",
      monthlyPrice: "$29",
      yearlyPrice: "$279",
      features: [
        "Single developer seat",
        "Full block library with TypeScript types",
        "Community Discord access",
        "Email support within 2 business days",
      ],
      button: {
        text: "Start building",
        url: "#",
      },
    },
    {
      name: "Team",
      image: "https://cdn.shadcnblocks.com/shadcnblocks/image-set/modern/pricing-plans/plan2.svg",
      description:
        "For product squads that need shared kits, reviews, and faster handoff.",
      monthlyPrice: "$79",
      yearlyPrice: "$759",
      featureListLabel: "Everything in Starter, plus",
      features: [
        "Up to 10 seats with shared design tokens",
        "Priority support and onboarding call",
        "SSO and audit-friendly export (SOC2-friendly workflow)",
        "Quarterly design-system office hours",
        "Custom block requests in your backlog tier",
      ],
      button: {
        text: "Get started",
        url: "#",
      },
      highlighted: true,
    },
  ],
};

const Pricing2 = (props: Props) => {
  const { heading, description, plans, className } = {
    ...defaultProps,
    ...props,
  };

  const [isYearly, setIsYearly] = useState(false);
  return (
    <section className={cn("py-32", className)}>
      <div className="container">
        <div className="mx-auto mb-5 max-w-5xl text-center">
          <h2 className="mb-4 text-4xl font-semibold tracking-tight lg:text-5xl">
            {heading}
          </h2>
          <p className="text-muted-foreground lg:text-lg">{description}</p>
        </div>
        <div className="flex flex-col items-center gap-10">
          <div className="flex items-center gap-5 text-base font-semibold">
            Monthly
            <Switch
              className="scale-125"
              checked={isYearly}
              onCheckedChange={() => setIsYearly(!isYearly)}
            />
            Yearly
          </div>
          <div className="mx-auto flex w-full max-w-5xl min-w-0 flex-col items-stretch gap-4 md:flex-row md:items-stretch md:justify-center">
            {(plans ?? []).map((plan) => (
              <Card
                key={plan.name}
                className={cn(
                  "flex w-full max-w-full min-w-0 flex-col justify-between gap-8 text-left shadow-none ring-0 md:flex-1 md:basis-0",
                  plan.highlighted
                    ? "border-2 border-primary"
                    : "border border-border",
                )}
              >
                <CardHeader className="gap-0.5">
                  <CardTitle>
                    <p className="text-lg font-semibold">{plan.name}</p>
                  </CardTitle>
                  <div className="mb-5 flex min-w-0 flex-wrap items-end gap-x-1">
                    <span className="min-w-0 text-4xl font-medium tracking-tight">
                      {isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                    </span>
                    <span className="text-xl font-normal text-muted-foreground">
                      {isYearly ? "/per year" : "/per month"}
                    </span>
                  </div>
                  <p className="text-muted-foreground">{plan.description}</p>
                </CardHeader>
                <CardContent>
                  <Separator className="mb-6" />
                  {plan.featureListLabel && (
                    <p className="mb-3 font-semibold">
                      {plan.featureListLabel}
                    </p>
                  )}
                  <ul className="flex flex-col gap-3">
                    {plan.features.map((feature, index) => (
                      <li
                        key={index}
                        className="flex items-center gap-2 text-sm"
                      >
                        <CircleCheck className="size-4 shrink-0" />
                        <span className="min-w-0 wrap-break-word">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="mt-auto">
                  <Button className="w-full" variant={plan.highlighted ? "default" : "outline"} render={<a href={plan.button.url} target="_blank" />} nativeButton={false}>{plan.button.text}</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export { Pricing2 };
