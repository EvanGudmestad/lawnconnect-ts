import {
  CalendarDays,
  Clock,
  CreditCard,
  MapPin,
  ShieldCheck,
  Sprout,
  Star,
} from "lucide-react";
import { Cta10 } from "@/components/cta10";
import { Feature43 } from "@/components/feature43";
import { Footer2 } from "@/components/footer2";
import { Hero115 } from "@/components/hero115";
import { Navbar1 } from "@/components/navbar1";
import { Testimonial9 } from "@/components/testimonial9";

// The navbar prints the title next to the picture, so its picture is only the leaf.
const navLogo = {
  url: "/",
  src: "/lawnconnect-mark.svg",
  alt: "LawnConnect",
  title: "LawnConnect",
};
// The footer prints only the picture, so its picture has the name in it.
const footerLogo = {
  url: "/",
  src: "/lawnconnect-logo.svg",
  alt: "LawnConnect",
  title: "LawnConnect",
};

// The page is a stack of blocks. Each block is a file in src/components that you own,
// and every word on the page is a prop you can change from here.
export function LandingPage() {
  return (
    <>
      <Navbar1
        logo={navLogo}
        menu={[
          { title: "Home", url: "/" },
          { title: "Find a provider", url: "/browse" },
        ]}
        auth={{
          login: { title: "Sign in", url: "/sign-in" },
          signup: { title: "Sign up", url: "/sign-up" },
        }}
      />
      <Hero115
        heading="Your lawn, handled."
        description="Connect with local lawn care providers who serve your ZIP code. Compare services, pick a provider and get your weekend back."
        icon={<Sprout className="size-6" />}
        buttons={{ primary: { text: "Find a provider", url: "/browse" } }}
        image={{
          src: "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80&w=1600",
          alt: "A freshly mowed lawn",
        }}
        byline="Sample listings only: this is a classroom project"
      />
      <div id="how-it-works">
        <Feature43
          heading="Lawn care without the phone tag"
          buttons={{}}
          features={[
            {
              icon: <MapPin className="size-5" />,
              title: "Local to your ZIP",
              description:
                "Providers list the ZIP codes they serve, so every result can actually reach you.",
            },
            {
              icon: <Clock className="size-5" />,
              title: "Book in minutes",
              description:
                "Pick a service and a provider. No quotes by voicemail.",
            },
            {
              icon: <CalendarDays className="size-5" />,
              title: "You choose the day",
              description:
                "Mowing, edging, trimming, cleanup. Pick what you need and when.",
            },
            {
              icon: <ShieldCheck className="size-5" />,
              title: "Listed by real providers",
              description:
                "Every listing shows who created it, and only that person can change it.",
            },
            {
              icon: <CreditCard className="size-5" />,
              title: "Pay in the app",
              description: "One place for the booking and the payment.",
            },
            {
              icon: <Star className="size-5" />,
              title: "Honest feedback",
              description: "Customers rate the work after the job is done.",
            },
          ]}
        />
      </div>
      <Testimonial9
        heading="What neighbors say"
        description="Sample quotes for the demo."
        testimonials={[
          {
            name: "Sample Customer",
            role: "Homeowner",
            avatar: "",
            content:
              "I typed my ZIP code and had three providers in under a minute.",
          },
          {
            name: "Sample Provider",
            role: "Lawn care owner",
            avatar: "",
            content:
              "My listing shows exactly the ZIP codes I serve, so I get fewer wrong-area calls.",
          },
          {
            name: "Sample Customer",
            role: "Renter",
            avatar: "",
            content: "Finding someone for edging used to take a week of texts.",
          },
        ]}
      />
      <Cta10
        heading="Ready to get your Saturday back?"
        description="Browse providers near you, or list your own lawn care business."
        buttons={{
          primary: { text: "Find a provider", url: "/" },
          secondary: { text: "List your business", url: "/sign-up" },
        }}
      />
      <Footer2
        logo={footerLogo}
        description="Connecting lawn care providers with the people who need them."
        sections={[
          {
            title: "LawnConnect",
            links: [
              { name: "Find a provider", href: "/browse" },
              { name: "Home", href: "/home" },
            ],
          },
        ]}
        copyright="© 2026 LawnConnect. A classroom project."
        legalLinks={[]}
      />
    </>
  );
}
