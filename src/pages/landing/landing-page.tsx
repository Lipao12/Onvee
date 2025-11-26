import { AppShowcase } from "./components/app-show-case";
import { Audience } from "./components/audience";
import { Demo } from "./components/demo";
import { Features } from "./components/features";
import { Footer } from "./components/footer";
import { Hero } from "./components/hero";
import { Navbar } from "./components/navbar";
import { Pricing } from "./components/pricing";
import { Testimonials } from "./components/testimonials";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />
      <Hero />
      <Features />
      <Testimonials />
      <Demo />
      <Audience />
      <AppShowcase />
      <Pricing />
      <Footer />
    </div>
  );
}
