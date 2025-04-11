import TestimonialSlider from "../../AnotherSlider";
import { Brands } from "../../components/Brands";
import { Footer } from "../../components/Footer";
import { FusionBanner } from "../../components/FussionBaner";
import { Header } from "../../components/Header";
import { Tabs } from "../../components/HomePageTabs";
import { NewsletterSignUp } from "../../components/NewsletterSignUp";
import { SliderSection } from "../../components/SliderSection";
import { testimonialData } from "../../store/DefaultData";

export const HomePage: React.FC = () => {
  const categories = [
    "Men's Fashion",
    "Women's Fashion",
    "Women Accessories",
    "Men Accessories",
    "Discount Deals",
  ];

  const handleCategoryChange = (category: string) => {
    console.log(`Category changed to: ${category}`);
  };

  return (
    <>
      <div className="flex flex-col h-screen">
        <Header />
        <FusionBanner />
        <Brands />
        <SliderSection />
        <Tabs
          categories={categories}
          activeCategory={categories[0]}
          onCategoryChange={handleCategoryChange}
        />
        <div className="b py-12">
          <h2 className="text-3xl font-bold text-center mb-8">
            What Our Customers Say
          </h2>
          <p className="max-w-1/2 text-center mx-auto">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Scelerisque
            duis ultrices sollicitudin aliquam sem. Scelerisque duis ultrices
            sollicitudin{" "}
          </p>
          <TestimonialSlider testimonials={testimonialData} />
        </div>
        <NewsletterSignUp />
        <Footer />
      </div>
    </>
  );
};
