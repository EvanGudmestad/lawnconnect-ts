"use client";

import { cn } from "cn";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";

interface TestimonialBasicGridItem {
  id?: string;
  name: string;
  avatar: string;
  content: string;
  role?: string;
  username?: string;
  date?: string;
  link?: string;
  icon?: string;
}

interface TestimonialBasicGridProps {
  heading: string;
  description: string;
  testimonials: TestimonialBasicGridItem[];
  className?: string;
}

interface Testimonial9Props extends TestimonialBasicGridProps {}
type Props = Partial<Testimonial9Props>;

const person1 = {
  name: "Jack Walsh",
  firstName: "Jack",
  lastName: "Walsh",
  initials: "JW",
  email: "jack.walsh@example.com",
  username: "jackwalsh",
  role: "Product Designer",
  company: "Cartwright",
  location: "Brisbane, Australia",
  avatar:
    "https://cdn.shadcnblocks.com/shadcnblocks/image-set/modern/avatars/avatar1.webp",
};
const person3 = {
  name: "Vernon Desilets",
  firstName: "Vernon",
  lastName: "Desilets",
  initials: "VD",
  email: "vernod@example.com",
  username: "vernod",
  role: "Creative Director",
  company: "Soho Logix",
  location: "Paris, France",
  avatar:
    "https://cdn.shadcnblocks.com/shadcnblocks/image-set/modern/avatars/avatar3.webp",
};
const person4 = {
  name: "Lín Wàngshū",
  firstName: "Lín",
  lastName: "Wangshu",
  initials: "LW",
  email: "linwang4@example.com",
  username: "liwang",
  role: "Graphic Designer",
  company: "Tenxcloud",
  location: "Shanghai, China",
  avatar:
    "https://cdn.shadcnblocks.com/shadcnblocks/image-set/modern/avatars/avatar4.webp",
};
const person6 = {
  name: "Jessica Cannon",
  firstName: "Jessica",
  lastName: "Cannon",
  initials: "JC",
  email: "jessica.cannon@example.com",
  username: "jessicacannon",
  role: "Data Analyst",
  company: "Fidelity Investments",
  location: "Boston, USA",
  avatar:
    "https://cdn.shadcnblocks.com/shadcnblocks/image-set/modern/avatars/avatar6.webp",
};
const person7 = {
  name: "Allison Goldstein",
  firstName: "Allison",
  lastName: "Goldstein",
  initials: "AG",
  email: "allison.goldstein@example.com",
  username: "allisongoldstein",
  role: "VP of Product",
  company: "General Mills",
  location: "San Diego, CA",
  avatar:
    "https://cdn.shadcnblocks.com/shadcnblocks/image-set/modern/avatars/avatar7.webp",
};
const person8 = {
  name: "Kim Jihoon",
  firstName: "Kim",
  lastName: "Jihoon",
  initials: "KJ",
  email: "kim.jihoon@example.com",
  username: "kimjihoon",
  role: "Software Engineer",
  company: "Saehan Electronics",
  location: "Seoul, South Korea",
  avatar:
    "https://cdn.shadcnblocks.com/shadcnblocks/image-set/modern/avatars/avatar8.webp",
};
const person9 = {
  name: "Charmaine Bellows",
  firstName: "Charmaine",
  lastName: "Bellows",
  initials: "CB",
  email: "charmaine.bellows@example.com",
  username: "charmainebellows",
  role: "Marketing Manager",
  company: "Solstice Digital",
  location: "New York, USA",
  avatar:
    "https://cdn.shadcnblocks.com/shadcnblocks/image-set/modern/avatars/avatar9.webp",
};
const person11 = {
  name: "Rafael Almeida",
  firstName: "Rafael",
  lastName: "Almeida",
  initials: "RA",
  email: "rafael.almeida@example.com",
  username: "rafaelalmeida",
  role: "Software Engineer",
  company: "Lume",
  location: "São Paulo, Brazil",
  avatar:
    "https://cdn.shadcnblocks.com/shadcnblocks/image-set/modern/avatars/avatar11.webp",
};
const person12 = {
  name: "Yuki Tanaka",
  firstName: "Yuki",
  lastName: "Tanaka",
  initials: "YT",
  email: "yuki.tanaka@example.com",
  username: "yukitanaka",
  role: "General Manager",
  company: "Hinoki",
  location: "Tokyo, Japan",
  avatar:
    "https://cdn.shadcnblocks.com/shadcnblocks/image-set/modern/avatars/avatar12.webp",
};
const defaultProps: Testimonial9Props = {
  heading: "Trusted by 1,000+ product teams",
  description: "See why engineering and design teams choose us to ship faster.",
  testimonials: [
    {
      id: "1",
      name: person3.name,
      username: person3.username,
      date: "2024-11-02",
      role: "Head of Product, Notion",
      avatar: person3.avatar,
      content:
        "We replaced three internal tools with this single platform. The component library alone saved our front-end team two sprints of work on our last release.",
      link: "#",
      icon: "https://cdn.shadcnblocks.com/shadcnblocks/image-set/modern/testimonials/company-icons/notion-icon.svg",
    },
    {
      id: "2",
      name: person7.name,
      username: person7.username,
      date: "2024-10-28",
      role: "Staff Engineer, Slack",
      avatar: person7.avatar,
      content:
        "The blocks are production-ready out of the box. We shipped our new marketing site in a week instead of the six weeks we had budgeted.",
      link: "#",
      icon: "https://cdn.shadcnblocks.com/shadcnblocks/image-set/modern/testimonials/company-icons/slack-icon.svg",
    },
    {
      id: "3",
      name: person12.name,
      username: person12.username,
      date: "2024-10-15",
      role: "Design Lead, Anthropic",
      avatar: person12.avatar,
      content:
        "What impressed me most is the attention to accessibility and dark mode. Every component works with our custom theme without overrides. Our designers actually enjoy building with it.",
      link: "#",
      icon: "https://cdn.shadcnblocks.com/shadcnblocks/image-set/modern/testimonials/company-icons/claude-icon.svg",
    },
    {
      id: "4",
      name: person4.name,
      username: person4.username,
      date: "2024-09-30",
      role: "Staff Engineer, Google",
      avatar: person4.avatar,
      content:
        "We evaluated five UI libraries before settling on this one. The TypeScript support and the Tailwind integration are best-in-class. It fits our stack perfectly.",
      link: "#",
      icon: "https://cdn.shadcnblocks.com/shadcnblocks/image-set/modern/testimonials/company-icons/google-icon.svg",
    },
    {
      id: "5",
      name: person9.name,
      username: person9.username,
      date: "2024-09-12",
      role: "Senior Frontend Engineer, Vercel",
      avatar: person9.avatar,
      content:
        "I use it for every new project now. The layout primitives handle responsive edge cases I used to spend hours debugging. Saves real time on every sprint.",
      link: "#",
      icon: "https://cdn.shadcnblocks.com/shadcnblocks/image-set/modern/testimonials/company-icons/vercel-icon.svg",
    },
    {
      id: "6",
      name: person11.name,
      username: person11.username,
      date: "2024-08-22",
      role: "Principal Engineer, Microsoft",
      avatar: person11.avatar,
      content:
        "Across internal tools we needed consistency without slowing teams down. The blocks gave us a polished baseline from day one and we have not had to refactor any of them since we adopted them org-wide.",
      link: "#",
      icon: "https://cdn.shadcnblocks.com/shadcnblocks/image-set/modern/testimonials/company-icons/microsoft-icon.svg",
    },
    {
      id: "7",
      name: person8.name,
      username: person8.username,
      date: "2024-07-18",
      role: "Director of Brand, Spotify",
      avatar: person8.avatar,
      content:
        "Our campaign landing pages went from concept to launch in days instead of weeks. The motion and layout blocks match our brand system without a single custom CSS override from engineering.",
      link: "#",
      icon: "https://cdn.shadcnblocks.com/shadcnblocks/image-set/modern/testimonials/company-icons/spotify-icon.svg",
    },
    {
      id: "8",
      name: person1.name,
      username: person1.username,
      date: "2024-06-05",
      role: "Principal Engineer, Netflix",
      avatar: person1.avatar,
      content:
        "We A/B test UI constantly. These blocks are predictable enough for our design ops team to assemble variants in Figma and hand off with zero ambiguity. Fewer bugs in production, faster experiments.",
      link: "#",
      icon: "https://cdn.shadcnblocks.com/shadcnblocks/image-set/modern/testimonials/company-icons/netflix-icon.svg",
    },
    {
      id: "9",
      name: person6.name,
      username: person6.username,
      date: "2024-05-14",
      role: "VP Product, Dropbox",
      avatar: person6.avatar,
      content:
        "Security review loved the accessible defaults and the way theming is isolated. We rolled the same block library across three products without forking stylesheets.",
      link: "#",
      icon: "https://cdn.shadcnblocks.com/shadcnblocks/image-set/modern/testimonials/company-icons/dropbox-icon.svg",
    },
  ],
};

const Testimonial9 = (props: Props) => {
  const { heading, description, testimonials, className } = {
    ...defaultProps,
    ...props,
  };

  const list = testimonials.slice(0, 6);

  return (
    <section className={cn("py-32", className)}>
      <div className="container mx-auto">
        <div className="flex flex-col items-center gap-6">
          <h2 className="text-center text-3xl font-semibold lg:text-5xl">
            {heading}
          </h2>
          <p className="text-muted-foreground lg:text-lg">{description}</p>
        </div>
        <div className="mt-14 w-full">
          <div className="columns-1 gap-5 md:columns-2 lg:columns-3">
            {list.map((testimonial, idx) => {
              return (
                <Card key={idx} className="mb-5 break-inside-avoid p-5">
                  <div className="flex justify-between">
                    <div className="flex gap-4 leading-5">
                      <Avatar className="size-9 rounded-full ring-1 ring-input">
                        <AvatarImage
                          src={testimonial.avatar}
                          alt={testimonial.name}
                        />
                        <AvatarFallback>
                          {testimonial.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="text-sm">
                        <p className="font-medium">{testimonial.name}</p>
                        <p className="text-muted-foreground">
                          {testimonial.role}
                        </p>
                      </div>
                    </div>
                    {testimonial.icon ? (
                      <a href={testimonial.link ?? "#"}>
                        <img
                          alt="Testimonial source"
                          src={testimonial.icon}
                          className="size-4 dark:invert"
                        />
                      </a>
                    ) : null}
                  </div>
                  <div className="mt-2 leading-7 text-muted-foreground">
                    <q>{testimonial.content}</q>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export { Testimonial9 };
