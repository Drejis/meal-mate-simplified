import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import PlanSelector from "@/components/PlanSelector";
import MealGrid from "@/components/MealGrid";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <Features />
      <PlanSelector />
      <MealGrid />
      <Footer />
    </div>
  );
};

export default Index;
