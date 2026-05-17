import AboutHero from "../components/about/AboutHero";
import StorySection from "../components/about/StorySection";
import WhyChoose from "../components/about/WhyChoose";
import OfferSection from "../components/about/OfferSection";
import CTASection from "../components/about/CTASection";

export default function About() {
  return (
    <div className="pt-14">
      <AboutHero />
      <StorySection />
      <WhyChoose />
      <OfferSection />
      <CTASection />
    </div>
  );
}